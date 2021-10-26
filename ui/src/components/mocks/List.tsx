import { Empty, Space, Table, Switch, Button, Popconfirm } from 'antd';
import { Mock } from '../../../../src/engine';
import { useServerState } from '../Provider';
import { CheckOutlined, CloseOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEditMocks } from './Provider';
import { mock as api } from '../../api';
import { Create } from './Create';

const noop = () => {};

const OpsColumn = ({ mock }: { mock: Mock }) => {
    const { delete: deleteExp = noop, clone = noop } = useEditMocks();
    return (
        <Space>
            <Button onClick={() => clone(mock)} size="small" type="dashed" icon={<CopyOutlined />}>
                Clone
            </Button>
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
        </Space>
    );
};

const ToggleMock = ({ mock }: { mock: Mock }) => {
    const isEnabled = mock.limit !== 0;

    const onToggle = async (val) => {
        if (val) {
            mock.limit = 'unlimited';
        } else {
            mock.limit = 0;
        }

        await api().update(JSON.stringify(mock, null, 2));
    };

    return (
        <Switch
            defaultChecked={isEnabled}
            onChange={(v) => onToggle(v)}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
        />
    );
};

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        key: 'id',
        title: 'Method',
        dataIndex: 'request.method',
        render: (_: any, mock: Mock) => mock.request.method || 'GET',
    },
    {
        key: 'id',
        title: 'Status',
        render: (_: any, mock: Mock) => mock.response?.statusCode || 200,
    },
    {
        key: 'id',
        title: 'Path',
        render: (_: any, mock: Mock) => mock.request.path,
    },
    {
        title: 'Enabled',
        render: (_: any, mock: Mock) => <ToggleMock mock={mock} />,
    },
    {
        key: 'id',
        title: '',
        render: (_: any, mock: Mock) => <OpsColumn mock={mock} />,
    },
];

export const MockList = () => {
    const {
        state: { mocks, error },
    } = useServerState();

    const isEmpty = mocks.length === 0 && !error;

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {isEmpty && <Empty description="No active mocks" />}
            <Table
                rowKey="id"
                columns={columns}
                dataSource={mocks}
                expandable={{
                    expandedRowRender: (record) => <Create mock={record} onDone={() => console.log('done')} />,
                }}
            ></Table>
        </Space>
    );
};

MockList.displayName = 'MockList';
