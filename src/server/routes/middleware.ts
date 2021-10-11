import logger from '../logger';

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
