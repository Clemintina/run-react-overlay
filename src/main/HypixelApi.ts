import Client, {ClientOptions} from "@common/zikeji/Client";
import {getResultObject, ResultObject} from "@common/zikeji/util/ResultObject";
import {Paths} from "@common/zikeji";

export class HypixelApi {

    private readonly client: Client;

    constructor(key: string, opts: ClientOptions) {
        this.client = new Client(key, opts);
    }

    public getClient(): Client {
        return this.client;
    }

}



