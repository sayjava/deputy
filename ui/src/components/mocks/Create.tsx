import { Alert, Button, notification, Space } from 'antd';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import Yaml from 'yaml';
import { mock as mockApi } from '../../api';

export const Create = ({ onDone, mock }: { onDone: any; mock: any }) => {
    const [error, setError] = useState<any>(null);
    const api = mockApi();

    let yamlValue = typeof mock !== 'string' ? Yaml.stringify(mock, { sortMapEntries: false }) : mock;

    const onCodeChange = (value: any) => {
        yamlValue = value;
    };

    const createMock = async () => {
        setError(null);
        try {
            let description = 'Mock created';
            const mocks = Yaml.parse(yamlValue);

            if (!Array.isArray(mocks)) {
                if (mocks.id) {
                    await api.update(yamlValue);
                    description = `${mocks.request.path} updated`;
                } else {
                    await api.create(yamlValue);
                    description = `${mocks.request.path} created`;
                }
            } else {
                await api.create(yamlValue);
                description = `${mocks.length} mocks successfully created`;
            }

            notification.success({
                message: 'Success',
                description,
                placement: 'topLeft',
                duration: 3,
            });
            onDone();
        } catch (error: any) {
            setError(error.toString());
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <Space title="New Mock" direction="vertical" size="middle" style={{ width: '100%' }}>
                {error && <Alert type="error" message="Mock Error" description={error.toString()} />}
                <Editor
                    height="60vh"
                    value={yamlValue}
                    onChange={onCodeChange}
                    theme="vs-dark"
                    path="mocks.yml"
                    language="yaml"
                    options={{ minimap: { enabled: false } }}
                />
                <Button type="primary" onClick={createMock}>
                    Save
                </Button>
            </Space>
        </div>
    );
};
