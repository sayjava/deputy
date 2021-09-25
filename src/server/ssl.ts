import path from 'path';
import fs from 'fs';

const TLS_CERT_NAME = 'cert.pem';
const TLS_KEY_NAME = 'key.pem';
const keyFile = path.join(process.cwd(), 'ssl', TLS_KEY_NAME);
const certFile = path.join(process.cwd(), 'ssl', TLS_CERT_NAME);

export const loadSSLCerts = () => {
    return {
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile),
    };
};

export const isTLSEnabled = () => {
    if (process.env.NODE_ENV === 'test') {
        return false;
    }
    return fs.existsSync(keyFile) && fs.existsSync(certFile);
};
