import {Client, Paths, Player} from "@zikeji/hypixel";
import {getResultObject, ResultObject} from "@zikeji/hypixel/dist/util/ResultObject";

export class HypixelApi extends Player {
    private client: Client;

    constructor(client: Client) {
        super();
        this.client = client;
    }

    public async username(name: string): Promise<ResultObject<Paths.Player.Get.Responses.$200, ["player"]>> {
        return getResultObject(await this.client.call<Paths.Player.Get.Responses.$200>("player", {name}), ["player"]) as never;
    }
}

export interface HypixelApiKeyRaw {
    success: boolean,
    record: HypixelApiKey
}

export interface HypixelApiKey {
    key: string,
    owner: string,
    limit: number,
    queriesInPastMin: number,
    totalQueries: number
}