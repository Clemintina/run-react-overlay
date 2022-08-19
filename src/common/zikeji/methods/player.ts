import {Components, Paths} from "@common/zikeji";
import {Method} from "@common/zikeji/util/Method";
import {getResultObject, ResultObject} from "../util/ResultObject";
import {IPCResponse} from "@common/utils/externalapis/RunApi";

export class Player extends Method {
    /**
     * Returns a player's data, such as game stats.
     * @example
     * ```typescript
     * const player = await client.player.uuid("20934ef9488c465180a78f861586b4cf");
     * console.log(player);
     * ```
     * @category API
     */
    public async uuid(uuid: Components.Parameters.PlayerUuid.Uuid): Promise<IPCResponse<ResultObject<Paths.Player.Get.Responses.$200, ["player"]>>> {
        return {data: getResultObject(await this.client.call<Paths.Player.Get.Responses.$200>("player", {uuid}), ["player"]) as never, status: 200};
    }

    public async username(name: string): Promise<IPCResponse<ResultObject<Paths.Player.Get.Responses.$200, ["player"]>>> {
        return {data: getResultObject(await this.client.call<Paths.Player.Get.Responses.$200>("player", {name}), ["player"]) as never, status: 200};
    }
}
