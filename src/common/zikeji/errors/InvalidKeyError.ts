export class InvalidKeyError extends Error {

    public code: number;
    constructor(message: string, code = 403) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, InvalidKeyError.prototype);
    }

    public getJson(){
        return {data: this.message, status: this.code}
    }

}
