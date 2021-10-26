import { ImportOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { useRef } from 'react';
import { useEditMocks } from './Provider';

export const FileImport = () => {
    const refImport: React.MutableRefObject<any> = useRef();
    const { create = () => {} } = useEditMocks();

    const doImport = () => {
        refImport.current && refImport.current.click();
    };

    const onFilesChange = async (evt: any) => {
        const reads = Array.from(evt.target.files).map((file: any) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = (e) => reject(e);
                reader.onloadend = () => {
                    try {
                        resolve(reader.result as string);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.readAsText(file, 'utf-8');
            });
        });

        try {
            const mocks = await (await Promise.all(reads)).join('\n');
            create(JSON.parse(mocks));
        } catch (error) {
            notification.error({
                message: error.toString(),
                description: 'Error',
            });
        }
    };

    return (
        <>
            <Button icon={<ImportOutlined />} onClick={doImport}>
                Import
            </Button>
            <input onChange={onFilesChange} ref={refImport} type="file" style={{ display: 'none' }} accept=".json" />
        </>
    );
};

FileImport.displayName = 'FileImport';
