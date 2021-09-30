import { ImportOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { useState } from 'react';
import { Create } from './Create';
import { Record } from '../../../../src/engine';
import { useServerState } from '../Provider';
import { convertRecordToMock } from '../../utils';

export const MockImport = ({ selections = [] }: any) => {
    const disabled = selections.length === 0;
    const [toImport, setToImport] = useState<Array<any> | null>(null);
    const {
        state: { records },
    } = useServerState();

    const USELESS_HEADERS = [
        'x-forwarded-host',
        'x-forwarded-proto',
        'x-forwarded-port',
        'x-forwarded-for',
        'connection',
        'user-agent',
        'remoteAddress',
        'content-length',
        'httpVersion',
    ];

    const cleanHeaders = (headers: any) => {
        const newHeader: any = {};
        Object.entries(headers).forEach(([key, value]: [string, any]) => {
            if (!USELESS_HEADERS.includes(key)) {
                newHeader[key] = value;
            }
        });
        return newHeader;
    };

    const startImport = () => {
        const mocks: Array<any> = selections.map((key: string) => {
            // @ts-ignore: ignore for now
            const record: Record = records.find((rec) => rec.key === key);
            return convertRecordToMock(record);
        });

        setToImport(mocks);
    };

    const onImported = async () => {
        setToImport(null);
    };

    return (
        <>
            {!disabled && (
                <Button type="dashed" icon={<ImportOutlined />} onClick={() => startImport()}>
                    Mock Selected
                </Button>
            )}
            <Drawer
                title="Create Mocks"
                visible={!!toImport}
                placement="left"
                width={620}
                onClose={() => setToImport(null)}
            >
                <Create mock={toImport} onDone={onImported} />
            </Drawer>
        </>
    );
};
