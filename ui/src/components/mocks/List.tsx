import { Alert, Empty, Space, Collapse, Tag, Row } from 'antd';
import { Mock } from '../../../../src/engine';
import { MockView } from './Mock';
import { useServerState } from '../Provider';

export const MockList = () => {
    const {
        state: { mocks, error },
    } = useServerState();

    const isEmpty = mocks.length === 0 && !error;

    const PanelHeader = ({ mock }: { mock: Mock }) => {
        const colors = {
            GET: 'blue',
            DELETE: 'red',
            PUT: 'green',
            POST: 'purple',
        };

        const method = (mock.request.method || 'GET').toUpperCase();
        const color = mock.limit === 0 ? 'default' : colors[method];

        return (
            <Space>
                <Tag color={color}>{method}</Tag>
                <span>{mock.request.path}</span>
            </Space>
        );
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {isEmpty && <Empty description="No active mocks" />}
            {error && <Alert message="Mocks" description={error} type="error" showIcon />}

            <Collapse>
                {mocks.map((mock) => (
                    <Collapse.Panel key={mock.id} header={<PanelHeader mock={mock} />}>
                        <MockView mock={mock} />
                    </Collapse.Panel>
                ))}
            </Collapse>
        </Space>
    );
};

MockList.displayName = 'MockList';
