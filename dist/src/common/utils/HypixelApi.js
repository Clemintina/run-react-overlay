import { Player } from "@zikeji/hypixel";
import { getResultObject } from "@zikeji/hypixel/dist/util/ResultObject";
export class HypixelApi extends Player {
    constructor(client) {
        super();
        this.client = client;
    }
    async username(name) {
        return getResultObject(await this.client.call("player", { name }), ["player"]);
    }
}
//# sourceMappingURL=HypixelApi.js.map