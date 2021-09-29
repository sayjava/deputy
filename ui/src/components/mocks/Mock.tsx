import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popconfirm, Row, Space, Tag, Typography } from 'antd';
import { Mock, Proxy, Response } from '../../../../src/engine';
import { useEditMocks } from './Provider';
import { JSONBody } from '../JSONBody';
import { KeyValues } from '../KeyValues';

interface Props {
    mock: Mock;
    readonly?: boolean;
}

const ResponseView = ({ response }: { response: Response }) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <KeyValues values={response.headers} title="Headers" />
            <KeyValues values={response.delay} title="" />
            <KeyValues values={response.delay} title="" />
            <JSONBody body={response.body} />
        </Space>
    );
};

const ProxyRequestView = ({ proxy }: { proxy: Proxy }) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <KeyValues values={proxy} title="Proxy" />
        </Space>
    );
};

export const MockView = ({ mock, readonly }: Props) => {
    const noop = () => {};
    const { delete: deleteExp = noop, clone = noop, update = noop } = useEditMocks();

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {!readonly && (
                <Row justify="space-between">
                    <Col>
                        <Space>
                            <Button onClick={() => update(mock)} size="small" type="dashed" icon={<EditOutlined />}>
                                Edit
                            </Button>
                            <Button onClick={() => clone(mock)} size="small" type="dashed" icon={<CopyOutlined />}>
                                Clone
                            </Button>
                        </Space>
                    </Col>
                    <Col>
                        <Popconfirm
                            title="Delete mock"
                            okText="Yes"
                            cancelText="No"
                            placement="topLeft"
                            onConfirm={() => deleteExp(mock)}
                        >
                            <Button size="small" type="dashed" icon={<DeleteOutlined />} danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
            )}
            <Divider dashed />
            <Row>
                <Col span={12} style={{ padding: '10px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Space direction="horizontal" align="baseline">
                            <Tag color="blue">{mock.request.method || 'GET'}</Tag>
                            <Typography.Text title={mock.request.path}>{mock.request.path}</Typography.Text>
                        </Space>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <KeyValues values={mock.request.pathParams} title="Params" />
                            <KeyValues values={mock.request.queryParams} title="Query" />
                            <KeyValues values={mock.request.headers} title="Headers" />
                            <JSONBody body={mock.request?.body} />
                        </Space>
                    </Space>
                </Col>
                <Col span={12} style={{ padding: '10px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Row justify="space-between">
                            <Col>{mock.response && <Tag color="blue">{mock.response.statusCode || '200'}</Tag>}</Col>
                        </Row>
                        {mock.proxy && <ProxyRequestView proxy={mock.proxy} />}
                        {mock.response && <ResponseView response={mock.response} />}
                    </Space>
                </Col>
            </Row>
        </Space>
    );
};

MockView.displayName = 'MockView';
