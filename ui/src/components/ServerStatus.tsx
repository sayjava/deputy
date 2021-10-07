import { ApiFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import { useServerState } from './Provider';

export const ServerStatus = () => {
    const {
        state: { connected },
    } = useServerState();

    if (connected) {
        return <></>;
    }

    </Modal>
};
