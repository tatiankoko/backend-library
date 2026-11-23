const mongoose = require('mongoose');

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const run = (response, operation) => Promise.resolve()
    .then(operation)
    .catch(error => {
        const status = error.status
            || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
        response.status(status).send(error.message);
    });

const ensureId = (id, resource) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new HttpError(404, `${resource} not found`);
    }
};

const ensureBody = body => {
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
        throw new HttpError(400, 'Invalid request body');
    }
};

module.exports = {
    HttpError,
    run,
    ensureId,
    ensureBody
};
