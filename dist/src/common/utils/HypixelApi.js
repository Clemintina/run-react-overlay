import { Client, Player } from "@zikeji/hypixel";
import { getResultObject } from "@zikeji/hypixel/dist/util/ResultObject";
export class HypixelApi extends Player {
    client;
    constructor(key, opts) {
        super();
        this.client = new Client(key, opts);
    }
    async username(name) {
        return getResultObject(await this.client.call("player", { name }), ["player"]);
    }
    getClient() {
        return this.client;
    }
}
//# sourceMappingURL=HypixelApi.js.map