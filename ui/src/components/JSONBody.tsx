import Editor from '@monaco-editor/react';

export const JSONBody = ({ body }: { body: any }) => {
    if (!body) {
        return null;
    }

    return (
        <div>
            <Editor
                height="30vh"
                value={JSON.stringify(body, null, 2)}
                theme="vs-dark"
                language="json"
                options={{ minimap: { enabled: false }, readOnly: true }}
            />
        </div>
    );
};
