class HttpError extends Error {
    code: any;

    constructor(message: string, errorCode: any) {
        super(message);
        this.code = errorCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export default HttpError;