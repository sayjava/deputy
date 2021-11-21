import { Drawer, Alert, notification } from 'antd';
import React, { useState } from 'react';
import { Mock } from '../../../../src/engine';
import { Create } from './Create';
import { mock } from '../../api';
import { nanoid } from 'nanoid';

export interface MockState {
    mocks: Array<any>;
    error: string | null;
}

export const DEFAULT_MOCK: Mock = {
    name: 'A mocked mock',
    description: 'Say hello back',
    request: {
        path: '/hello',
        method: 'GET',
    },
    response: {
        status: 200,
        headers: {
            'content-type': 'application/json',
            'x-server': 'behave-server',
        },
        body: {
            message: 'Howdy',
        },
    },
    limit: 'unlimited',
    delay: 0,
};

interface EditMockContextState {
    clone?: (mock: Mock) => void;
    create?: (mock: Mock) => void;
    delete?: (mock: Mock) => void;
    update?: (mock: Mock) => void;
    reset?: () => void;
    clear?: () => void;
}

const EditMockContext = React.createContext<EditMockContextState>({});

export const useEditMocks = () => {
    const ctx = React.useContext(EditMockContext);
    if (!ctx) {
        throw new Error('Must be mused withing a EditExpectationProvider');
    }

    return ctx;
};

export const EditMockProvider = ({ children }) => {
    const api = mock();
    const [state, setState] = useState<{ mock?: Mock; error: any }>({ error: null });

    const createMock = (mock: Mock) => {
        setState({ mock, error: null });
    };

    const deleteMock = async (mock: Mock) => {
        try {
            await api.delete(JSON.stringify(mock));
            notification.success({
                message: 'Success',
                description: `${mock.request.path} deleted`,
                placement: 'topLeft',
                duration: 3,
            });
            setState({ mock: undefined, error: null });
        } catch (error) {
            setState({ mock: undefined, error });
        }
    };

    const updateMock = async (mock: Mock) => {
        setState({ mock, error: null });
    };

    const cloneMock = (mock: Mock) => {
        const newMock = Object.assign({}, mock, { id: nanoid() });
        setState({ mock: newMock, error: null });
    };

    const onDrawerDone = async () => {
        try {
            setState({ error: null, mock: undefined });
        } catch (error) {
            console.log(error);
        }
    };

    const clearRecords = async () => {
        await api.clear();
    };

    const resetServer = async () => {
        await api.reset();
    };

    return (
        <EditMockContext.Provider
            value={{
                clone: cloneMock,
                delete: deleteMock,
                update: updateMock,
                create: createMock,
                clear: clearRecords,
                reset: resetServer,
            }}
        >
            <>
                <Drawer
                    title="Mock Editor"
                    width={720}
                    closable={false}
                    onClose={() => setState({ mock: undefined, error: null })}
                    visible={!!state.mock}
                    placement="left"
                >
                    <Create mock={state.mock || DEFAULT_MOCK} onDone={onDrawerDone} />
                </Drawer>

                <Drawer
                    title="Error"
                    width={720}
                    closable={false}
                    onClose={() => setState({ mock: undefined, error: null })}
                    visible={!!state.error}
                    placement="left"
                >
                    {state.error && <Alert message={state.error.toString()} description="Error" type="error" />}
                </Drawer>
                {children}
            </>
        </EditMockContext.Provider>
    );
};
