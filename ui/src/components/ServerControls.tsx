import { Space, Button, Row, Col, Popconfirm } from 'antd';
import { useEditMocks } from './mocks/Provider';

export const ServerControls = () => {
    const noop = () => {};
    const { clear = noop, reset = noop } = useEditMocks();

    return (
        <Row justify="space-between" align="middle">
            <Col>
                <Space>
                    <Popconfirm
                        title="This will clear server history"
                        onConfirm={() => clear()}
                        placement="topLeft"
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="dashed">Clear Logs</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="This reset the server, logs and expectations"
                        onConfirm={() => reset()}
                        placement="topLeft"
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="dashed" danger>
                            Reset Server
                        </Button>
                    </Popconfirm>
                </Space>
            </Col>
        </Row>
    );
};
