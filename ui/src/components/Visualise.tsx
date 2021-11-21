import { Alert, Button, Col, Modal, Row, Space, Empty } from 'antd';
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
    return hostname ? capitalize(hostname) : 'Deputy';
};

interface VisualiseState {
    byUrl: boolean;
    open: boolean;
    code: string;
    withProxy: boolean;
    warn: boolean;
}

const Diagram = ({ code }) => {
    const [state, setState] = useState({ svg: null, error: null, href: '' });
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

Diagram.displayName = 'SequenceDiagram';

const MAX_RECORDS = 15;
export const Visualise = () => {
    const {
        state: { records },
    } = useServerState();

    const [state, setState] = useState<VisualiseState>({
        byUrl: false,
        open: false,
        code: null,
        withProxy: false,
        warn: false,
    });

    const createSequenceGraph = async (newState: VisualiseState) => {
        if (records.length === 0) {
            return setState(Object.assign({}, state, newState, { code: null }));
        }

        const seqs = ['sequenceDiagram'];
        records.slice(0, MAX_RECORDS).forEach((rec) => {
            const { request, response, proxyRequest } = rec;
            const destRequest = proxyRequest || request;
            const destination = getDestinationHost(destRequest, newState.byUrl);

            if (proxyRequest) {
                if (state.withProxy) {
                    seqs.push(`App->>Proxy: ${request.method} ${request.path}`);
                    seqs.push(`Proxy->>${destination}: ${request.method} ${request.path}`);
                    seqs.push(`${destination}->>Proxy: ${response.status}`);
                    seqs.push(`Proxy->>App: ${response.status}`);
                } else {
                    seqs.push(`App->>${destination}: ${request.method} ${request.path}`);
                    seqs.push(`${destination}->>App: ${response.status}`);
                }
            } else {
                seqs.push(`App->>${destination}: ${request.method} ${request.path}`);
                seqs.push(`${destination}->>App: ${response.status}`);
            }
        });
        const code = seqs.join('\n');
        return setState(Object.assign({}, state, newState, { code, warn: records.length > MAX_RECORDS }));
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
                {state.warn && (
                    <Alert type="warning" message={`Only a maximum of ${MAX_RECORDS} are rendered`} showIcon />
                )}
                <Space direction="vertical" style={{ width: '100%' }}>
                    {records.length === 0 && (
                        <>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Records" />
                        </>
                    )}

                    {records.length !== 0 && (
                        <>
                            <Row justify="center" style={{ width: '100%' }}>
                                <Col>
                                    <Checkbox onChange={switchByUrl} checked={state.byUrl}>
                                        Path based services
                                    </Checkbox>
                                </Col>
                                <Col>
                                    <Checkbox
                                        onChange={switchProxy}
                                        checked={state.withProxy}
                                        style={{ display: 'none' }}
                                    >
                                        Show proxy
                                    </Checkbox>
                                </Col>
                            </Row>
                            {state.code && <Diagram code={state.code} />}
                        </>
                    )}
                </Space>
            </Modal>
        </div>
    );
};

Visualise.displayName = 'Visualize';
