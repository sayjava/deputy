import React, { useEffect, useState } from 'react';
import { Mock, Record } from '../../../src/engine';
import { nanoid } from 'nanoid';

export interface RecordsState {
    records: Array<Record>;
    mocks: Array<Mock>;
    connected: boolean;
    error: any;
}

const startState: RecordsState = {
    records: [],
    mocks: [],
    connected: false,
    error: null,
};

interface ServerStateState {
    state: RecordsState;
}

const ServerStateContext = React.createContext<ServerStateState>({
    state: startState,
});

export const useServerState = () => {
    const ctx = React.useContext(ServerStateContext);
    if (!ctx) {
        throw new Error('Must be mused withing a LogsProvider');
    }

    return ctx;
};

export const ServerProvider = ({ children }) => {
    const [state, setState] = useState<RecordsState>(startState);

    const update = ({ mocks, records }) => {
        const serverRecords = records.reverse().map((record: any) => Object.assign(record, { key: nanoid() }));
        setState({ error: null, records: serverRecords, connected: true, mocks });
    };

    useEffect(() => {
        const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
        const host = process.env.NODE_ENV === 'development' ? 'localhost:8081' : window.location.host;
        const ws = new WebSocket(`${protocol}://${host}`);
        ws.onerror = (ev: Event) => setState({ error: ev.toString(), connected: true, records: [], mocks: [] });
        ws.onclose = (ev: Event) => setState({ error: null, records: [], mocks: [], connected: false });
        ws.onmessage = ({ data }) => update(JSON.parse(data));
    }, []);

    return <ServerStateContext.Provider value={{ state }}>{children}</ServerStateContext.Provider>;
};
