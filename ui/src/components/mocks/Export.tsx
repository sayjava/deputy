import { ExportOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Yaml from 'yaml';

import { useServerState } from '../Provider';

export const MockExport = () => {
    const {
        state: { mocks },
    } = useServerState();
    const fileContent = Yaml.stringify(mocks, { indent: 2 });
    return (
        <Button icon={<ExportOutlined />} download="mocks.yml" href={URL.createObjectURL(new Blob([fileContent]))}>
            Export
        </Button>
    );
};
