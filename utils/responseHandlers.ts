import logger from "../utils/logger.js";
const SERVER_ERROR_MESSAGE = "Server error.";
const REQUEST_BASED_ERROR_MESSAGE = "Request error.";
const SERVER_ERROR_MESSAGE_TO_LOG = "Server error.";
const REQUEST_BASED_ERROR_MESSAGE_TO_LOG = "Request error.";
const SUCCESS_MESSAGE_TO_LOG = "Successful operation.";

export const serverErrorHandler = (res: any, message: any) => {
    if (!message) {
        message = SERVER_ERROR_MESSAGE_TO_LOG;
    }
    logger.error(message);

    res.status(500).send(SERVER_ERROR_MESSAGE).end();
}

export const requestErrorHandler = (res: any, message: any) => {
    if (!message) {
        message = REQUEST_BASED_ERROR_MESSAGE_TO_LOG;
    }
    logger.error(message);

    res.status(400).send(REQUEST_BASED_ERROR_MESSAGE).end();
}
export const successHandler = (res: any, data: any, message: any) => {
    if (!message) {
        message = SUCCESS_MESSAGE_TO_LOG;
    }
    logger.verbose(message);

    if (typeof (data) === "number") {
        data = { returnValue: data };
        // Wrapping number values inside an object so that
        // express will not strangely use it automatically
        // as http status code. E.g. replacing 200 below with
    }

    res.status(200).send(data).end();
}
