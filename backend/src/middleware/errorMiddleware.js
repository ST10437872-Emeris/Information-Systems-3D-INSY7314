const { errorResponse } = require('../utils/apiResponse');


function notFoundHandler(req, res) {
    return errorResponse(
        res,
        404,
        'The requested API endpoint was not found.'
    );
}


function errorHandler(error, req, res, next) {

    const statusCode = Number.isInteger(error.statusCode)
        ? error.statusCode
        : 500;

    console.error(
        `[${new Date().toISOString()}] ` +
        `${req.method} ${req.originalUrl}: ${error.message}`
    );

    if (statusCode >= 500) {
        return errorResponse(
            res,
            500,
            'An internal server error occurred.'
        );
    }

    return errorResponse(
        res,
        statusCode,
        error.message || 'Request failed.'
    );
}


module.exports = {
    notFoundHandler,
    errorHandler
};
