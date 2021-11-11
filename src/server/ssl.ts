import path from 'path';
import fs from 'fs';
import * as devcert from 'devcert';

const TLS_CERT_NAME = 'cert.pem';
const TLS_KEY_NAME = 'key.pem';
const keyFile = path.join(process.cwd(), 'ssl', TLS_KEY_NAME);
const certFile = path.join(process.cwd(), 'ssl', TLS_CERT_NAME);

const isSSLExisting = () => {
    if (process.env.NODE_ENV === 'test') {
        return false;
    }
    return fs.existsSync(keyFile) && fs.existsSync(certFile);
};

const generateSSL = async ({ domains }) => {
    const { key, cert } = await devcert.certificateFor(['localhost', ...domains]);

    fs.mkdirSync(path.join(process.cwd(), 'ssl'));
    fs.writeFileSync(keyFile, key);
    fs.writeFileSync(certFile, cert);
};

export const loadSSLCerts = async ({ domains }) => {
    if (!isSSLExisting()) {
        await generateSSL({ domains });
    }
    return Promise.resolve({
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
    });
};
