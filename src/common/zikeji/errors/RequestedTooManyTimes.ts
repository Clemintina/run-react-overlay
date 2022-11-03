/* istanbul ignore file */

export class RequestedTooManyTimes extends Error {
    /**
     * Ignore this for code coverage as reproducing a real rate limit error is difficult.
     */
    public code: number;

    constructor(message: string, code = 429) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, RequestedTooManyTimes.prototype);
    }

    public getJson() {
        return {data: this.message, status: this.code};
    }
}
