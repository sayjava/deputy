import React, { useState } from 'react';
import { Badge, Button, Col, Drawer, Row, Space } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import { MockList } from './List';
import { DEFAULT_MOCK } from './Provider';
import { FileImport } from './FileImport';
import { MockExport } from './Export';
import { useServerState } from '../Provider';
import { Create } from './Create';

const MockCount = ({ children }) => {
    const {
        state: { mocks },
    } = useServerState();
    return <Badge count={mocks.length}>{children}</Badge>;
};

export const MocksView = () => {
    const [state, setState] = useState({ showMockView: false, showCreateView: false });

    return (
        <>
            <MockCount>
                <Button type="dashed" onClick={() => setState({ showMockView: true, showCreateView: false })}>
                    Mocks
                </Button>
            </MockCount>
            <Drawer
                title="Mocks"
                placement="left"
                width={960}
                closable
                onClose={() => setState({ showMockView: false, showCreateView: false })}
                visible={state.showMockView}
            >
                <Drawer
                    title="Mock Editor"
                    width={720}
                    closable={true}
                    onClose={() => setState({ showMockView: true, showCreateView: false })}
                    visible={state.showCreateView}
                    placement="left"
                >
                    <Create
                        mock={DEFAULT_MOCK}
                        onDone={() => setState({ showMockView: true, showCreateView: false })}
                    />
                </Drawer>
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
                                <Button
                                    color="blue"
                                    icon={<PlusSquareOutlined />}
                                    type="primary"
                                    onClick={() => setState({ showMockView: true, showCreateView: true })}
                                >
                                    New Mock
                                </Button>
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
