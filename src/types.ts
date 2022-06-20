/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Request {
    protocol?: string;
    path: string;
    method?: string;
    contentType?: 'application/json' | 'text/plain';
    body?:
        | string
        | {
              [key: string]: any;
          };

    headers?: {
        [key: string]: string;
    };
    pathParams?: {
        [key: string]: any;
    };
    queryParams?: {
        [key: string]: any;
    };
    time?: number;
}

export interface Verification {
    request: Request;
    limit?: {
        atLeast?: number;
        atMost?: number | 'unlimited';
    };
}

export interface IntervalVerification {
    requests: Request[];
    interval: {
        atLeast?: number;
        atMost?: number;
    };
}

export interface VerificationError {
    message: string;
    actual: any;
    expected: any;
    records: Record[];
}

export interface Response {
    /**
     * HTTP Status code
     */
    status?: number;

    /**
     * Response body
     */
    body?: string | any;

    /**
     * Attachment to stream back to client
     */
    attachment?: string;

    /**
     * how long the response should be delayed in seconds
     */
    delay?: number;

    /**
     * HTTP response headers
     */
    headers?: {
        [key: string]: string | number;
    };
}

export interface Proxy {
    port?: number;
    protocol?: string;
    host: string;
    followRedirect?: boolean;
    skipVerifyTLS?: boolean;
    keepHost?: boolean;
    headers?: any;
}

export interface Mock {
    id?: string;
    name?: string;
    description?: string;
    request: Request;
    response?: Response;

    fileResponse?: string;

    /**
     * Proxy for this mock
     */
    proxy?: Proxy;

    /**
     *
     */
    limit?: 'unlimited' | number;

    /**
     * Time to live for this mock
     */
    timeToLive?: number;

    /**
     * Priority
     */
    priority?: number;

    /**
     * Delay to respond
     */
    delay?: number;
}

export interface ProxyRequest extends Request {
    url: string;
    params?: any;
    data?: any;
}

export interface Record {
    request: Request;
    response: Response;
    matches: Mock[];
    timestamp: number;
    proxyRequest?: ProxyRequest;
}

export interface DeputyConfig {
    apiPort?: number;
    port?: number;
    mocksDirectory?: string;
    tls?: boolean;
    autoProxy?: boolean;
    domains?: string;
}

export interface MiddlewareConfig extends DeputyConfig {
    enableAPI?: boolean;
}
