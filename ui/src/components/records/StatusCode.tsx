import { Tag } from 'antd';
import { Record } from '../../../../src/engine';

export const StatusCode = ({ record }: { record: Record }) => {
    const renderTag = (status: any) => {
        if (status === 404) {
            return <Tag color="purple">{status}</Tag>;
        }

        if (status >= 500) {
            return <Tag color="error">{status}</Tag>;
        }

        if (status >= 400 && status < 500) {
            return <Tag color="warning">{status}</Tag>;
        }

        if (status <= 400) {
            return <Tag color="success">{status}</Tag>;
        }

        return <Tag>{status}</Tag>;
    };

    const { response } = record;
    if (response) {
        return renderTag(response.status || 200);
    }

    return renderTag(404);
};
