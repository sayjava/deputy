import React from 'react';
import { Row, Col, Card } from 'antd';
import { Record } from '../../../../src/engine';
import { JSONBody } from '../JSONBody';
import { KeyValues } from '../KeyValues';
import cookie from 'cookie';

interface RecordProps {
    title: string;
    headers: any;
    body: any;
}

const Response = ({ title, headers, body = '' }: RecordProps) => {
    return (
        <Card title={title}>
            <KeyValues values={headers} title="Headers" />
            <JSONBody body={body} />
        </Card>
    );
};

export const RecordRow = ({ record }: { record: Record }) => {
    const { request, response, proxyRequest } = record;
    const { queryParams, headers, pathParams, body } = request;

    const cookies = headers.cookie ? cookie.parse(headers.cookie) : undefined;

    return (
        <div style={{ width: '100%' }}>
            <Row style={{ width: '100%' }}>
                <Col span={12}>
                    <Card title={proxyRequest ? 'Request (proxied)' : 'Request'}>
                        <KeyValues
                            values={headers}
                            title="Headers"
                            ignoreList={['cookie', 'content-length', 'httpVersion', 'connection', 'remoteAddress']}
                        />
                        <KeyValues values={cookies} title="Cookies" />
                        <KeyValues values={queryParams} title="Query Params" />
                        <KeyValues values={pathParams} title="Path Params" />
                        <JSONBody body={body} />
                    </Card>
                </Col>
                <Col span={12} style={{ padding: '0 10px' }}>
                    <Response title="Response" headers={response.headers} body={response.body} />
                </Col>
            </Row>
        </div>
    );
};
