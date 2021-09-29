import { Button, Drawer, Tag } from 'antd';
import { useState } from 'react';
import { Record } from '../../../src/types';
import { MockView } from './mocks/Mock';

const ViewMock = ({ record }: { record: Record }) => {
    const { matches = [] } = record;
    const [matched] = matches;
    const [isOpen, setOpen] = useState(false);

    if (matched) {
        return (
            <>
                <Button type="dashed" size="small" onClick={() => setOpen(true)}>
                    View Mock
                </Button>
                <Drawer width="750" placement="right" closable visible={isOpen} onClose={() => setOpen(false)}>
                    <MockView mock={matched} readonly />
                </Drawer>
            </>
        );
    }

    return <></>;
};

ViewMock.displayName = 'ViewMock';
export default ViewMock;
