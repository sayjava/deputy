import shortId from 'shortid';
import axios from 'axios';
import os from 'os';
import bodyMatcher from './matchers/body';
import headerMatcher from './matchers/headers';
import pathMatcher from './matchers/path';
import queryMatcher from './matchers/query';
import methodMatcher from './matchers/method';
import {
    Mock,
    IntervalVerification,
    Proxy,
    ProxyRequest,
    Record,
    Request,
    Response,
    Verification,
    VerificationError,
} from '../types';
import { EventEmitter } from 'stream';
import { matchKeys } from './matchers/map';

interface EngineConfig {
    defaultLimit?: number;
    autoForwardRequest?: boolean;
}

interface Props {
    mocks: Mock[];
    config: EngineConfig;
}

const minimumMock: Mock = {
    name: 'sample',
    request: {
        path: '',
    },
};

export const validateMock = (mock: Mock): Mock => {
    const newMock = Object.assign(
        {
            name: 'Mock',
            request: {
                path: '.*',
            },
        },
        mock,
    );

    if (!matchKeys(minimumMock, newMock)) {
        throw new Error('Minimum mock not met');
    }

    if (!matchKeys(minimumMock.request, newMock.request)) {
        throw new Error('Request requires a path');
    }

    return newMock;
};

const notFound = (path: string): Response => {
    return {
        status: 404,
        body: `No response found for ${path}`,
    };
};

export class Engine extends EventEmitter {
    private $mocks: Mock[];
    private $records: Record[] = [];
    private $config: EngineConfig;

    static defaultConfig: EngineConfig = {
        autoForwardRequest: true,
    };

    constructor(mocks: Mock[], config: EngineConfig) {
        super();
        this.$mocks = mocks.map((mock) => {
            return Object.assign(this.baseMock(), mock);
        });

        this.$config = config;
    }

    private isHostNameSame = (request: Request) => {
        const headers = request.headers || {};
        const hostName = headers['Host'] || headers['host'] || '127.0.0.1';

        if (hostName.includes('127.0.0.1') || hostName.includes('localhost')) {
            return true;
        }

        const interfaces = Object.values(os.networkInterfaces()).find((intInfo) => {
            return intInfo.find((info) => hostName.includes(info.address));
        });

        return !!interfaces;
    };

    private baseMock() {
        return {
            id: shortId(),
            name: 'Mock',
            limit: 'unlimited',
        };
    }

    private verifyRequest(request: Request): Record[] {
        return this.$records
            .filter((rec) => methodMatcher(request, rec.request))
            .filter((rec) => rec.request.path === request.path)
            .filter((rec) => headerMatcher(request, rec.request))
            .filter((rec) => bodyMatcher(request, rec.request))
            .sort((a, b) => a.timestamp - b.timestamp);
    }

    private createProxy = (request: Request): Proxy => {
        const headers = request.headers || {};
        return {
            host: headers['Host'] || headers['host'],
            protocol: request.protocol || 'http',
            followRedirect: true,
            skipVerifyTLS: false,
        };
    };

    private createProxyRequest = ({ req, proxy }: { req: Request; proxy: Proxy }): ProxyRequest => {
        const port = proxy.port || (proxy.protocol === 'https' ? 443 : 80);
        const url = `${proxy.protocol || 'http'}://${proxy.host}:${port}${req.path}`;

        return {
            path: req.path,
            url,
            headers: Object.assign({}, req.headers, proxy.headers || {}),
            method: req.method,
            params: req.queryParams || {},
            data: req.body,
        };
    };

    match(request: Request): Mock[] {
        const matches = this.$mocks
            .filter((mock) => methodMatcher(mock.request, request))
            .filter((mock) => pathMatcher(mock.request, request))
            .filter((mock) => queryMatcher(mock.request, request))
            .filter((mock) => headerMatcher(mock.request, request))
            .filter((mock) => bodyMatcher(mock.request, request))
            .filter((mock) => {
                if (mock.limit === 'unlimited' || mock.limit === undefined) {
                    return true;
                }

                const pastMatches = this.$records.filter((record) => {
                    const bids = record.matches.map((b) => b.id);
                    return bids[0] === mock.id;
                }).length;

                return pastMatches < mock.limit;
            });

        return matches;
    }

    async proxy(req: ProxyRequest): Promise<Response> {
        try {
            const res = await axios(req as any);

            return {
                status: res.status,
                headers: res.headers,
                body: res.data,
            };
        } catch (error) {
            const defaultResponse = {
                status: 500,
                headers: { 'content-type': 'application/text' },
                data: error.toString(),
            };
            const { response = defaultResponse } = error;
            return {
                status: response.status,
                headers: response.headers,
                body: response.data,
            };
        }
    }

    async execute(request: Request): Promise<Record> {
        const matches = this.match(request);
        const [matched] = matches;
        const record: Record = {
            request,
            matches,
            response: notFound(request.path),
            timestamp: Date.now(),
        };

        if (matched) {
            if (matched.response) {
                record.response = matched.response;
            } else if (matched.proxy) {
                record.proxyRequest = this.createProxyRequest({ req: request, proxy: matched.proxy });
                record.response = await this.proxy(record.proxyRequest);
            }
        } else {
            if (this.$config.autoForwardRequest) {
                if (!this.isHostNameSame(request)) {
                    record.proxyRequest = this.createProxyRequest({ req: request, proxy: this.createProxy(request) });
                    record.response = await this.proxy(record.proxyRequest);
                }
            }
        }

        this.$records.push(record);
        this.emit('change', this.state);
        return record;
    }

    assert(verification: Verification): boolean | VerificationError {
        const { request, limit = {} } = verification;
        const matches = this.verifyRequest(request);

        // set the lower and upper limits
        const verifyLimit = Object.assign({ atMost: 'unlimited', atLeast: 1 }, limit);

        // lower limit check with an unlimited upper limit
        if (verifyLimit.atMost === 'unlimited' && matches.length >= verifyLimit.atLeast) {
            return true;
        }

        // upper limit check
        if (verifyLimit.atMost !== 'unlimited' && matches.length > verifyLimit.atMost) {
            return {
                actual: matches.length,
                expected: verifyLimit.atLeast,
                message: `Expected to have received ${request.method || 'GET'}:${request.path} at most ${
                    verifyLimit.atMost
                } times but was received ${matches.length} times`,
                records: matches,
            };
        }

        // lower limit check
        if (matches.length < verifyLimit.atLeast) {
            return {
                actual: matches.length,
                expected: verifyLimit.atLeast,
                message: `Expected to have received ${request.method || 'GET'}:${request.path} at least ${
                    verifyLimit.atLeast
                } times but was received ${matches.length} times`,
                records: matches,
            };
        }

        return true;
    }

    assertSequence(requests: Request[]): boolean | VerificationError {
        if (requests.length < 2) {
            return {
                actual: `Received ${requests.length} requests`,
                expected: `At least 2 requests`,
                message: `At least 2 requests is needed for verifying a sequence`,
                records: [],
            };
        }

        const allRecords = requests.map((req) => this.verifyRequest(req));
        const firstRecords = allRecords.map((records) => records[0]);

        const allInSequence = firstRecords.reduce((current, record, index) => {
            if (index === 0) {
                return true;
            }
            const prevRecord = firstRecords[index - 1];

            return current && record && prevRecord && prevRecord.timestamp <= record.timestamp;
        }, true);

        if (!allInSequence) {
            const records = allRecords.flat().sort((a, b) => a.timestamp - b.timestamp);

            const actual = records.map((rec) => `${rec.request.method || 'GET'}:${rec.request.path}`);
            const expected = requests.map((r) => `${r.method || 'GET'}:${r.path}`);

            return {
                expected,
                actual,
                message: `Requests matched are not matched`,
                records: allRecords.flat().sort((a, b) => a.timestamp - b.timestamp),
            };
        }

        return true;
    }

    assertInterval(verify: IntervalVerification): boolean | VerificationError {
        const {
            interval: { atLeast, atMost },
        } = verify;

        const requestRecords = verify.requests.map((req) => {
            return { path: req.path, records: this.verifyRequest(req) };
        });
        const records = requestRecords.map((r) => r.records).flat();

        // check for requests with no records
        const [missing] = requestRecords.filter((recs) => recs.records.length === 0);
        if (missing) {
            return {
                actual: `${missing.path} has no records`,
                expected: `All asserted requests must have matched records`,
                message: 'All request must have at least on record',
                records,
            };
        }

        if (records.flat().length < 2) {
            return {
                actual: `Total record for request is ${records.length}`,
                expected: 'At least two request records are required for interval assertions',
                message: 'Request must have at least one record',
                records,
            };
        }

        if (atLeast) {
            const matched = records.reduce((acc, curr, index) => {
                if (index === 0) {
                    return true;
                }
                const prev = records[index - 1];
                return acc && curr.timestamp - prev.timestamp >= atLeast;
            }, true);

            if (!matched) {
                return {
                    actual: `Request was not called apart in ${atLeast} seconds`,
                    expected: `Requests are called ${atLeast} seconds apart`,
                    message: '',
                    records,
                };
            }

            return matched;
        }

        if (atMost) {
            const matched = records.reduce((acc, curr, index) => {
                if (index === 0) {
                    return true;
                }
                const prev = records[index - 1];
                return acc && curr.timestamp - prev.timestamp <= atMost;
            }, true);

            if (!matched) {
                return {
                    actual: `Request was not called apart in ${atMost} seconds`,
                    expected: `Requests are called ${atMost} seconds apart`,
                    message: '',
                    records,
                };
            }

            return matched;
        }

        return true;
    }

    addMock(mock: Mock): void {
        const newMock = Object.assign(this.baseMock(), mock);
        const validated = validateMock(newMock);
        this.$mocks.push(validated);
        this.emit('change', this.state);
    }

    updateMock(newMock: Mock) {
        const currentMock = this.$mocks.find((m) => m.id === newMock.id);
        const mockIndex = this.$mocks.map((m) => m.id).indexOf(newMock.id);
        const validated = validateMock(newMock);

        if (currentMock) {
            this.$mocks[mockIndex] = Object.assign({}, validated);
        } else {
            this.$mocks.push(validated);
        }
        this.emit('change', this.state);
    }

    removeMock(id: string): void {
        this.$mocks = this.$mocks.filter((exp) => exp.id !== id);
        this.emit('change', this.state);
    }

    clearAllMock(): void {
        this.$mocks = [];
        this.emit('change', this.state);
    }

    clearAllRecords(): void {
        this.$records = [];
        this.emit('change', this.state);
    }

    clearAll(): void {
        this.clearAllMock();
        this.clearAllRecords();
        this.emit('change', this.state);
    }

    reorderMocks(ids: string[]): void {
        const mockIds = this.$mocks.map((m) => m.id);
        const newMocks = [];

        ids.forEach((id) => {
            const mock = this.$mocks[mockIds.indexOf(id)];
            if (mock) {
                newMocks.push(mock);
            }
        });

        this.$mocks = newMocks;
        this.emit('change', this.state);
    }

    get records(): Record[] {
        return this.$records;
    }

    get mocks(): Mock[] {
        return this.$mocks;
    }

    get state(): { mocks: Mock[]; records: Record[] } {
        return { mocks: this.mocks, records: this.records };
    }
}

export const create = ({ mocks, config = { autoForwardRequest: true } }: Props): Engine => {
    const validateMocks = mocks.map(validateMock);
    return new Engine(validateMocks, config);
};
