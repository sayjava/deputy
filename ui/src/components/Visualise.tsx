import { Button, Modal, Space } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import mermaid from 'mermaid';
import { useEffect, useState } from 'react';
import { useServerState } from './Provider';

const capitalize = (str) => {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
};

const getDestinationHost = (request, splitByURL) => {
    if (splitByURL) {
        const [hostname] = request.path
            .split('/')
            .map((k) => k.replace(/\W/g, ''))
            .filter((k) => k.length);

        return capitalize(hostname);
    }
    const [, hostname] = String(request.headers['host']).split('.');
    return hostname ? capitalize(hostname) : hostname;
};

interface VisualiseState {
    byUrl: boolean;
    open: boolean;
    diagram: string;
}

export const Visualise = () => {
    const {
        state: { records },
    } = useServerState();

    const [state, setState] = useState<VisualiseState>({ byUrl: false, open: false, diagram: '' });

    const createDiagram = (code: string) => {
        return new Promise((resolve, reject) => {
            try {
                mermaid.parse(code);
                mermaid.initialize({ startOnLoad: false });
                mermaid.render('Requests', code, resolve);
            } catch (error) {
                reject(error);
            }
        });
    };

    const createSequenceGraph = async (newState: VisualiseState) => {
        console.log(newState);
        const seqs = ['sequenceDiagram'];
        records.forEach((rec) => {
            const { request, response, proxyRequest } = rec;
            seqs.push(`App->>Server: ${request.method} ${request.path}`);

            const destRequest = proxyRequest || request;
            const destination = getDestinationHost(request, newState.byUrl);

            if (destination) {
                seqs.push(`Server->>${destination}: ${destRequest.method} ${destRequest.path}`);
                seqs.push(`${destination}-->>Server: ${response.statusCode}`);
            } else {
                console.info('no destination');
            }

            seqs.push(`Server->>App: ${response.statusCode}`);
        });

        try {
            const sequence = seqs.join('\n');
            console.info(sequence);
            const newDiagram = await createDiagram(sequence);
            setState(Object.assign({}, state, newState, { diagram: newDiagram }));
        } catch (error) {
            console.error(error);
        }
    };

    const onCancel = () => createSequenceGraph({ byUrl: null, open: false, diagram: '' });
    const onSwitch = () => createSequenceGraph({ byUrl: !state.byUrl, open: true, diagram: state.diagram });

    const blob = new Blob(state.diagram ? [state.diagram] : []);
    const href = URL.createObjectURL(blob);

    return (
        <div>
            <Button
                type="dashed"
                color="blue"
                onClick={() => createSequenceGraph({ byUrl: state.byUrl, open: true, diagram: '' })}
            >
                Visualize
            </Button>
            <Modal
                width={960}
                visible={state.open}
                closable={true}
                onCancel={onCancel}
                title="Visualizations"
                footer={[
                    <Button key="save" download="behave.svg" href={href}>
                        Save
                    </Button>,
                ]}
            >
                <Space direction="vertical">
                    <Checkbox onChange={onSwitch} checked={state.byUrl}>
                        Split services by URL
                    </Checkbox>
                    <div dangerouslySetInnerHTML={{ __html: state.diagram }}></div>
                </Space>
            </Modal>
        </div>
    );
};

Visualise.displayName = 'Visualize';
