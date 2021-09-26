import { Alert, Button, Col, Modal, Row, Space } from 'antd';
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
    code: string;
    withProxy: boolean;
}

const Diagram = ({ code }) => {
    const [state, setState] = useState({ svg: null, error: null, href: '' });

    console.log('reading new code', code);

    useEffect(() => {
        try {
            mermaid.parse(code);
            mermaid.initialize({ startOnLoad: false });
            mermaid.render('Requests', code, (svg) => {
                const blob = new Blob([svg]);
                const href = URL.createObjectURL(blob);
                setState({ svg, error: null, href });
            });
        } catch (error) {
            setState({ svg: null, error, href: '' });
            console.error(error);
        }
    }, [code]);

    return (
        <div>
            {state.error && <Alert message="SVG Error" description={state.error.toString()} />}
            {state.svg && <div dangerouslySetInnerHTML={{ __html: state.svg }}></div>}
            <Row justify="end">
                <Button href={state.href} type="primary" download="sequence.svg">
                    Save Diagram
                </Button>
            </Row>
        </div>
    );
};

export const Visualise = () => {
    const {
        state: { records },
    } = useServerState();

    const [state, setState] = useState<VisualiseState>({ byUrl: false, open: false, code: null, withProxy: true });

    const createSequenceGraph = async (newState: VisualiseState) => {
        if (records.length === 0) {
            return setState(Object.assign({}, state, newState, { code: null }));
        }

        const seqs = ['sequenceDiagram'];
        records.forEach((rec) => {
            const { request, response, proxyRequest } = rec;
            seqs.push(`App->>Proxy: ${request.method} ${request.path}`);
            const destRequest = proxyRequest || request;
            const destination = getDestinationHost(request, newState.byUrl);

            if (destination) {
                seqs.push(`Proxy->>${destination}: ${destRequest.method} ${destRequest.path}`);
                seqs.push(`${destination}-->>Proxy: ${response.statusCode}`);
            } else {
                console.info('no destination');
            }

            seqs.push(`Server->>App: ${response.statusCode}`);
        });
        const code = seqs.join('\n');
        return setState(Object.assign({}, state, newState, { code }));
    };

    const onCancel = () => createSequenceGraph(Object.assign(state, { open: false }));
    const switchByUrl = () => createSequenceGraph(Object.assign(state, { byUrl: !state.byUrl }));
    const switchProxy = () => createSequenceGraph(Object.assign(state, { withProxy: !state.withProxy }));

    return (
        <div>
            <Button
                type="dashed"
                color="blue"
                onClick={() => createSequenceGraph(Object.assign(state, { open: true }))}
            >
                Visualize
            </Button>
            <Modal
                width={960}
                visible={state.open}
                closable={true}
                onCancel={onCancel}
                title="Visualizations"
                footer={[]}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Row justify="center" style={{ width: '100%' }}>
                        <Col>
                            <Checkbox onChange={switchByUrl} checked={state.byUrl}>
                                Path based services
                            </Checkbox>
                        </Col>
                        <Col>
                            <Checkbox onChange={switchProxy} checked={state.withProxy} style={{ display: 'none' }}>
                                Show proxy
                            </Checkbox>
                        </Col>
                    </Row>

                    {state.code && <Diagram code={state.code} />}
                </Space>
            </Modal>
        </div>
    );
};

Visualise.displayName = 'Visualize';
