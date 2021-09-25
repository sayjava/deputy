import { Space, Typography } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { Record } from '../../../../src/engine';

export const RequestPath = ({ record }: { record: Record }) => {
    const { matches = [] } = record;
    const [matched] = matches;
    if (matched) {
        return (
            <Space>
                {/* @ts-ignore: ellipsis ignore */}
                <Typography.Text ellipsis={record.request.path.slice(5)} underline>
                    {record.request.path}
                </Typography.Text>
                <SelectOutlined />
            </Space>
        );
    }

    // @ts-ignore: ellipsis ignore
    return <Typography.Text ellipsis={record.request.path.slice(5)}>{record.request.path}</Typography.Text>;
};
