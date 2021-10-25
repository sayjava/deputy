import { Alert, Button, notification, Space } from 'antd';
import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import Yaml from 'yaml';
import { mock as mockApi } from '../../api';

export const Create = ({ onDone, mock }: { onDone: any; mock: any }) => {
    const [error, setError] = useState<any>(null);
    const api = mockApi();
    const editorRef = useRef(null);

    const editorOptions = {
        minimap: {
            enabled: false,
        },
        lineSuggest: {
            enabled: true,
        },
        smoothScrolling: true,
    };

    const handleEditorDidMount = (editor) => {
        const yamlValue = typeof mock !== 'string' ? Yaml.stringify(mock, { sortMapEntries: false }) : mock;
        editorRef.current = editor;
        editor.setValue(yamlValue);
        editor.setScrollPosition({ scrollTop: 0, scrollLeft: 0 });
    };

    const createMock = async () => {
        setError(null);
        try {
            let description = 'Mock created';
            const editorValue = editorRef.current.getValue();
            const mocks = Yaml.parse(editorValue);

            if (!Array.isArray(mocks)) {
                if (mocks.id) {
                    await api.update(editorValue);
                    description = `${mocks.request.path} updated`;
                } else {
                    await api.create(editorValue);
                    description = `${mocks.request.path} created`;
                }
            } else {
                await api.create(editorValue);
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
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    path="mocks.yml"
                    language="yaml"
                    options={editorOptions}
                />
                <Button type="primary" onClick={createMock}>
                    Save
                </Button>
            </Space>
        </div>
    );
};
