import { Space, Typography } from 'antd';
import { Record } from '../../../../src/engine';

export const RequestPath = ({ record }: { record: Record }) => {
    const { proxyRequest, request } = record;
    const path = proxyRequest ? proxyRequest.url : request.path;
    const normalizedPath = path.replace(/:443|80/, '');

    return (
        <Space>
            <Typography.Text>{normalizedPath}</Typography.Text>
        </Space>
    );
};
