import { ApiFilled } from '@ant-design/icons';
import { useServerState } from './Provider';

export const ServerStatus = () => {
    const {
        state: { connected },
    } = useServerState();

    if (connected) {
        return <></>;
    }

    return <ApiFilled style={{ color: '#ff0000' }} />;
};
