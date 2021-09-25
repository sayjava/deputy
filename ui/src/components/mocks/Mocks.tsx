import React, { useState } from 'react';
import { Badge, Button, Col, Drawer, Row, Space } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { MockList } from './List';
import { DEFAULT_MOCK, useEditMocks } from './Provider';
import { FileImport } from './FileImport';
import { MockExport } from './Export';
import { useServerState } from '../Provider';

const NewMock = () => {
    const { create = () => {} } = useEditMocks();
    return (
        <Button color="blue" icon={<PlusSquareOutlined />} type="primary" onClick={() => create(DEFAULT_MOCK)}>
            New
        </Button>
    );
};

const MockCount = ({ children }) => {
    const {
        state: { mocks },
    } = useServerState();
    return <Badge count={mocks.length}>{children}</Badge>;
};

export const MocksView = () => {
    const [state, setState] = useState({ showMockView: false });

    return (
        <>
            <MockCount>
                <Button type="dashed" onClick={() => setState({ showMockView: true })}>
                    Mocks
                </Button>
            </MockCount>
            <Drawer
                title="Expectations"
                placement="left"
                width={960}
                closable
                onClose={() => setState({ showMockView: false })}
                visible={state.showMockView}
            >
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                        maxWidth: '960px',
                        margin: 'auto',
                    }}
                >
                    <Row justify="space-between">
                        <Col>
                            <Space>
                                <NewMock />
                                <FileImport />
                            </Space>
                        </Col>
                        <Col>
                            <MockExport />
                        </Col>
                    </Row>
                    <MockList />
                </Space>
            </Drawer>
        </>
    );
};
