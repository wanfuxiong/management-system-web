class Result {
    private readonly _code: number;
    private readonly _data: object | null;
    private readonly _msg: string;

    constructor(code: number, data: object | null, msg: string) {
        this._code = code;
        this._data = data;
        this._msg = msg;
    }

    get code(): number {
        return this._code;
    }

    get data(): object | null {
        return this._data;
    }

    get msg(): string {
        return this._msg;
    }
}
