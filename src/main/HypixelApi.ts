import Client, { ClientOptions } from "@common/zikeji/Client";

export class HypixelApi {
    private readonly client: Client;

    constructor(key: string, opts: ClientOptions) {
        this.client = new Client(key, opts);
    }

    public getClient(): Client {
        return this.client;
    }
}
