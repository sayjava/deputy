import React from 'react';
import 'antd/dist/antd.css';
import { Space, Row, Col, Typography, Divider } from 'antd';

import './App.css';

import { Layout } from 'antd';
import { ServerProvider } from './components/Provider';
import { Records } from './components/records/Records';
import { EditMockProvider } from './components/mocks/Provider';
import { MocksView } from './components/mocks/Mocks';
import { ServerControls } from './components/ServerControls';
import { Visualise } from './components/Visualise';
import { Header } from 'antd/lib/layout/layout';
import { ReactComponent as Logo } from './logo.svg';

const { Footer, Content } = Layout;

const App = () => {
    return (
        <ServerProvider>
            <EditMockProvider>
                <Layout className="layout" style={{ minHeight: '100vh' }}>
                    <Header className="header">
                        <Row justify="space-between">
                            <Row align="middle">
                                <Logo width="30" />
                                <span style={{ color: 'white', paddingLeft: '10px' }}>Deputy</span>
                            </Row>

                            <Typography.Link href="https://sayjava.github.io/behave/" target="_blank">
                                Docs
                            </Typography.Link>
                        </Row>
                    </Header>
                    <Content style={{ padding: '20px 50px' }}>
                        <Row justify="space-between">
                            <Col>
                                <Typography.Title level={4}>Logs</Typography.Title>
                            </Col>
                            <Col>
                                <ServerControls />
                            </Col>
                        </Row>

                        <Divider dashed />

                        <div className="site-layout-content">
                            <Space direction="vertical" size="large">
                                <Row justify="space-between">
                                    <Col>
                                        <MocksView />
                                    </Col>
                                    <Col>
                                        <Visualise />
                                    </Col>
                                </Row>
                                <Records />
                            </Space>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Behave UI Server</Footer>
                </Layout>
            </EditMockProvider>
        </ServerProvider>
    );
};

export default App;
