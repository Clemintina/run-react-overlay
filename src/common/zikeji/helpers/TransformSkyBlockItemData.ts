import { Components } from "../types/api";
import { NBTInventory } from "@common/zikeji";

/**
 * Interface used in the {@link SkyBlockProfileMemberWithTransformedInventories} intersection to describe the intellisense for the inventory after being transformed.
 */
export interface SkyBlockProfileTransformedInventories {
    inv_armor: NBTInventory;
    candy_inventory_contents?: NBTInventory;
    ender_chest_contents?: NBTInventory;
    fishing_bag?: NBTInventory;
    inv_contents?: NBTInventory;
    potion_bag?: NBTInventory;
    quiver?: NBTInventory;
    talisman_bag?: NBTInventory;
    wardrobe_contents?: NBTInventory;
}

/**
 * This type is a intersection type omitting the default inventory types and including the transformed inventory types.
 */
export type SkyBlockProfileMemberWithTransformedInventories = Omit<Components.Schemas.SkyBlockProfileMember, keyof SkyBlockProfileTransformedInventories> & SkyBlockProfileTransformedInventories;

/** @internal */
const SKYBLOCK_INVENTORIES: (keyof SkyBlockProfileTransformedInventories)[] = ["inv_armor", "candy_inventory_contents", "ender_chest_contents", "fishing_bag", "inv_contents", "potion_bag", "quiver", "talisman_bag", "wardrobe_contents"];
