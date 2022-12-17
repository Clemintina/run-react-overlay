import { Paths } from "@main/zikeji";
import { Method } from "@main/zikeji/util/Method";
import { getResultObject, ResultObject } from "../../util/ResultObject";

export class SkyBlockResources extends Method {
	/**
	 * Returns the list of ingame collections.
	 * @return An object of [[Collection | Collection interface]] objects.
	 * @category API
	 */
	public async collections(): Promise<ResultObject<Paths.ResourcesSkyblockCollections.Get.Responses.$200, ["collections"]>> {
		return getResultObject(await this.client.call<Paths.ResourcesSkyblockCollections.Get.Responses.$200>("resources/skyblock/collections"), ["collections"]);
	}

	/**
	 * Returns the current skills from the SkyBlock gamemode.
	 * @category API
	 */
	public async skills(): Promise<ResultObject<Paths.ResourcesSkyblockSkills.Get.Responses.$200, ["collections"]>> {
		return getResultObject(await this.client.call<Paths.ResourcesSkyblockSkills.Get.Responses.$200>("resources/skyblock/skills"), ["collections"]);
	}
}
