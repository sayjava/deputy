import logger from '../logger';
import Yaml from 'yaml';

export const errorHandler = (err, req, res, next) => {
    logger.error(err);
    res.status(500).send({
        message: err.message,
    });
};

export const responseHandler = (req, res) => {
    if (Object.keys(res.locals).length === 0) {
        return res.status(404).json({ message: `${req.method}: ${req.url} Not Found` });
    }
    return res.status(res.locals.code || 200).json(res.locals.body || {});
};

export const parseBodyHandler = (req, _, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/x-yaml')) {
        try {
            req.payload = Yaml.parse(req.body);
            return next();
        } catch (error) {
            return next(error);
        }
    } else {
        req.payload = req.body;
    }

    return next();
};
