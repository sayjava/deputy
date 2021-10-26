import { Space, Table, Alert, Button, Row, Tag } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { Record } from '../../../../src/engine';
import { RequestPath } from './RequestPath';
import { StatusCode } from './StatusCode';
import { useState } from 'react';
import { RecordRow } from './RecordRow';
import { MockImport } from '../mocks/Import';
import { useServerState } from '../Provider';
import { useEditMocks } from '../mocks/Provider';
import ViewMock from '../ViewMock';
import { convertRecordToMock } from '../../utils';

const columns = [
    {
        title: '',
        dataIndex: 'proxy',
        width: '7%',
        render: (_: any, record: Record) => {
            if (record.proxyRequest) {
                const headers = record.request.headers || {};
                const host = headers['host'];
                return <Tag>proxied</Tag>;
            }
            return null;
        },
    },
    {
        title: 'Timestamp',
        dataIndex: 'timestamp',
        width: '15%',
        render: (_: any, record: Record) => {
            const d = new Date(record.timestamp);
            return `${d.toLocaleDateString()} : ${d.toLocaleTimeString()}`;
        },
    },
    {
        title: 'Method',
        dataIndex: ['request', 'method'],
        width: '10%',
    },
    {
        title: 'User-Agent',
        dataIndex: ['request', 'path'],
        ellipsis: true,
        width: '15%',
        render: (_: any, record: Record) => {
            const headers = record.request.headers || {};
            const agent = headers['user-agent'] || 'None';
            return agent;
        },
    },
    {
        title: 'Path',
        dataIndex: ['request', 'path'],
        ellipsis: true,
        render: (_: any, record: Record) => <RequestPath record={record} />,
    },
    {
        title: 'Status',
        dataIndex: ['request', 'path'],
        width: '10%',
        render: (_: any, record: Record) => <StatusCode record={record} />,
    },
];

const ExpandedRow = ({ record }) => {
    const edit = useEditMocks();
    const { proxyRequest } = record;
    const mock = convertRecordToMock(record);

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Row justify="space-between">
                {proxyRequest && (
                    <Button type="dashed" size="small" onClick={() => edit.create(mock)} icon={<PlusCircleFilled />}>
                        Create Mock
                    </Button>
                )}

                <ViewMock record={record} />
            </Row>
            <RecordRow record={record} />
        </Space>
    );
};

export const Records = () => {
    const {
        state: { records, error },
    } = useServerState();
    const [selections, setSelections] = useState([]);

    if (error) {
        return <Alert type="error" description={error.message} message="Records Error" />;
    }

    const historySelection: any = {
        selectedRowKeys: selections,
        onChange: setSelections,
        type: 'checkbox',
    };

    return (
        <Space direction="vertical">
            <MockImport selections={selections} />
            <Table
                columns={columns}
                dataSource={records}
                pagination={false}
                rowSelection={historySelection}
                expandRowByClick
                expandable={{
                    expandedRowRender: (record) => <ExpandedRow record={record} />,
                }}
            ></Table>
        </Space>
    );
};

Records.displayName = 'Records';
