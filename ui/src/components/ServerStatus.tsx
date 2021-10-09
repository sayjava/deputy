import { ApiFilled } from '@ant-design/icons';
import { notification, Button } from 'antd';
import { useServerState } from './Provider';

export const ServerStatus = () => {
    const {
        state: { connected },
    } = useServerState();

    if (connected) {
        return <></>;
    }

    const doRefresh = () => {
        notification.close(key);
        window.location.reload();
    };

    const key = `disconnected`;
    const reloadBtn = (
        <Button type="primary" size="small" onClick={doRefresh}>
            Reload Page
        </Button>
    );

    notification.warning({
        message: 'Server Disconnected',
        description: 'The dashboard has disconnected from the server',
        duration: null,
        placement: 'topLeft',
        key,
        btn: reloadBtn,
    });

    return <ApiFilled style={{ color: '#ff0000' }} />;
};
