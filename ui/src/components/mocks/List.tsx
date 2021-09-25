import { Alert, Empty, Space, Collapse, Tag } from 'antd';
import { Mock } from '../../../../src/engine';
import { MockView } from './Mock';
import { useServerState } from '../Provider';

export const MockList = () => {
    const {
        state: { mocks, error },
    } = useServerState();

    const isEmpty = mocks.length === 0 && !error;

    const PanelHeader = ({ mock }: { mock: Mock }) => {
        return (
            <Space>
                <Tag color="blue">{mock.request.method || 'GET'}</Tag>
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
