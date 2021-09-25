import { Tag } from 'antd';
import { Record } from '../../../../src/engine';

export const StatusCode = ({ record }: { record: Record }) => {
    const renderTag = (statusCode: any) => {
        if (statusCode === 404) {
            return <Tag color="purple">{statusCode}</Tag>;
        }

        if (statusCode >= 500) {
            return <Tag color="error">{statusCode}</Tag>;
        }

        if (statusCode >= 400 && statusCode < 500) {
            return <Tag color="warning">{statusCode}</Tag>;
        }

        if (statusCode <= 400) {
            return <Tag color="success">{statusCode}</Tag>;
        }

        return <Tag>{statusCode}</Tag>;
    };

    const { response } = record;
    if (response) {
        return renderTag(response.statusCode || 200);
    }

    return renderTag(404);
};
