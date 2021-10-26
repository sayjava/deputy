import { ExportOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useServerState } from '../Provider';

export const MockExport = () => {
    const {
        state: { mocks },
    } = useServerState();
    const fileContent = JSON.stringify(mocks, null, 2);
    return (
        <Button icon={<ExportOutlined />} download="mocks.json" href={URL.createObjectURL(new Blob([fileContent]))}>
            Export
        </Button>
    );
};
