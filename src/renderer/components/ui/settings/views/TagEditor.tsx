import {useSelector} from "react-redux";
import store, {Store} from "@renderer/store";
import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {PlayerStore, updatePlayerStores} from "@renderer/store/PlayerStore";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {ColourPicker} from "@components/user/settings/components/ColourPicker";
import {RUNElectronStoreTagsType} from "@renderer/store/ElectronStoreUtils";
import {RUNElectronStoreTagsTyped} from "@main/appWindow";
import {ColourPickerArray} from "@components/user/settings/components/ColourPickerArrays";
import {TagArray, TagObject} from "@common/utils/Schemas";

const Essentials = () => {
    const localStore: Store = useSelector(() => store.getState());
    const localTagStore: PlayerStore = localStore.playerStore;
    const tagStore: RUNElectronStoreTagsType = localTagStore.tagStore.tags as RUNElectronStoreTagsType;
    const defaultArrayColour = "ffffff";

    const updateColourStore = async (colourPath: RUNElectronStoreTagsTyped, colour) => {
        colour = colour.replace("#", "");
        await window.ipcRenderer.send("tagsSet", {key: colourPath, data: colour});
        store.dispatch(updatePlayerStores({}));
    };

    const updateColourStoreArray = async (colourPath, colour: TagObject) => {
        console.log(colour);
        await window.ipcRenderer.send("tagsSet", {key: colourPath, data: colour});
        store.dispatch(updatePlayerStores({}));
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <div className='h-full p-2 flex flex-col'>
                    <SettingCard>
                        <span className={"w-80"}>Tag</span>
                        <span className={"w-80"}>Display</span>
                        <span className={"w-80"}>Colour</span>
                    </SettingCard>
                    <SettingCard>
                        <span>Annoy List</span>
                        <span style={{color: `#${tagStore.run.annoylist.colour}`}}>{tagStore.run.annoylist.display}</span>
                        <span>
                            <ColourPicker
                                setColour={async (colour: string) => {
                                    await updateColourStore("run.annoylist.colour", colour);
                                }}
                                colourObject={tagStore.run.annoylist.colour}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Blacklisted</span>
                        <span style={{color: `#${tagStore.run.blacklist.colour}`}}>{tagStore.run.blacklist.display}</span>
                        <span>
                            <ColourPicker
                                setColour={async (colour: string) => {
                                    await updateColourStore("run.blacklist.colour", colour);
                                }}
                                colourObject={tagStore.run.blacklist.colour}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Encounters</span>
                        <span style={{color: `#${defaultArrayColour}`}}>{tagStore.run.encounters.display}</span>
                        <span>
                            <ColourPickerArray
                                setColour={async (newTagArray: TagArray) => {
                                    const newColourObject = {...tagStore.run.encounters};
                                    const newItem = {colour: newTagArray.colour, requirement: newTagArray.requirement, operator:'<='};
                                    const newColourArray = [...newColourObject.colour];
                                    newColourArray.filter((item: TagArray,index) => {
                                        if(item.requirement == newItem.requirement) newColourArray.splice(index,1);
                                    });
                                    newColourArray.push(newItem);
                                    newColourObject.colour = newColourArray;
                                    await updateColourStoreArray("run.encounters", newColourObject);
                                }}
                                colourObject={tagStore.run.encounters}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Name Change</span>
                        <span style={{color: `#${tagStore.run.name_change.colour}`}}>{tagStore.run.name_change.display}</span>
                        <span>
                            <ColourPicker
                                setColour={async (colour: string) => {
                                    await updateColourStore("run.name_change.colour", colour);
                                }}
                                colourObject={tagStore.run.name_change.colour}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Personal Safelist</span>
                        <span style={{color: `#${tagStore.run.personal_safelist.colour}`}}>{tagStore.run.personal_safelist.display}</span>
                        <span>
                            <ColourPicker
                                setColour={async (colour: string) => {
                                    await updateColourStore("run.personal_safelist.colour", colour);
                                }}
                                colourObject={tagStore.run.personal_safelist.colour}
                            />
                        </span>
                    </SettingCard>
                    <SettingCard>
                        <span>Safelist</span>
                        <span style={{color: `#${defaultArrayColour}`}}>{tagStore.run.safelist.display}</span>
                        <span>
                            <ColourPickerArray
                                setColour={async (newTagArray: TagArray) => {
                                    const newColourObject = {...tagStore.run.safelist};
                                    const newItem = {colour: newTagArray.colour, requirement: newTagArray.requirement, operator:'<='};
                                    const newColourArray = [...newColourObject.colour];
                                    newColourArray.filter((item: TagArray,index) => {
                                        if(item.requirement == newItem.requirement) newColourArray.splice(index,1);
                                    });
                                    newColourArray.push(newItem);
                                    newColourObject.colour = newColourArray;
                                    await updateColourStoreArray("run.safelist", newColourObject);
                                }}
                                colourObject={tagStore.run.safelist}
                            />
                        </span>
                    </SettingCard>
                </div>
            </NavigationBar>
        </div>
    );
};

export default Essentials;
