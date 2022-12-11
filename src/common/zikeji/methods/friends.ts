import { Components, Paths } from "@common/zikeji";
import { Method } from "@common/zikeji/util/Method";
import { getResultArray, ResultArray } from "../util/ResultArray";
import { IPCResponse } from "@common/utils/externalapis/RunApi";

export class Friends extends Method {
  /**
   * Returns friendships for given player.
   * @example
   * ```typescript
   * const friends = await client.friends.uuid("20934ef9488c465180a78f861586b4cf");
   * console.log(friends);
   * ```
   * @category API
   */
  public async uuid(uuid: Components.Parameters.PlayerUuid.Uuid): Promise<IPCResponse<ResultArray<Paths.Friends.Get.Responses.$200, "records">>> {
    return {
      data: getResultArray(await this.client.call<Paths.Friends.Get.Responses.$200>("friends", { uuid }), "records") as never,
      status: 200
    };
  }
}
