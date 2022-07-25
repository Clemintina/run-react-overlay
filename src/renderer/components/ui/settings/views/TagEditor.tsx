import {ConfigStore} from "@renderer/store/ConfigStore";
import {useSelector} from "react-redux";
import store, {Store} from "@renderer/store";
import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {PlayerStore, PlayerStoreTyped, updatePlayerStores} from "@renderer/store/PlayerStore";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {ColourPicker} from "@components/user/settings/components/ColourPicker";
import {RUNElectronStoreTagsType} from "@renderer/store/ElectronStoreUtils";
import {RUNElectronStoreTagsTyped} from "@main/appWindow";
import {ColourPickerArray} from "@components/user/settings/components/ColourPickerArrays";

const Essentials = () => {
    const localStore:Store = useSelector(() => store.getState());
    const localTagStore: PlayerStore = localStore.playerStore;
    const tagStore:RUNElectronStoreTagsType = localTagStore.tagStore.tags as RUNElectronStoreTagsType;
    const defaultArrayColour = "ffffff";

    const updateColourStore =async (colourPath:RUNElectronStoreTagsTyped,colour) => {
        colour = colour.replace("#", "");
        await window.ipcRenderer.send("tagsSet", {key: colourPath, data: colour});
        store.dispatch(updatePlayerStores({}));
    };

    const updateColourStoreArray =async (colourPath,colour) => {
        colour = colour.replace("#", "");
        await window.ipcRenderer.send("tagsSet", {key: colourPath, data: colour});
        store.dispatch(updatePlayerStores({}));
    };

    // TODO make it look nicer and cleaner

    return (
        <div>
            <NavigationBar>
                <div className='h-full p-2 flex flex-col'>
                    <SettingCard>
                        <span className={'w-80'}>Tag</span>
                        <span className={'w-80'}>Display</span>
                        <span className={'w-80'}>Colour</span>
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
                                setColour={async (colour: string) => {
                                    await updateColourStoreArray("run.encounters.colour", colour);
                                }}
                                colourObject={tagStore.run.encounters.colour}
                                text={'Not Implemented'}
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
                                setColour={async (colour: string) => {
                                    await updateColourStoreArray("run.safelist.colour", colour);
                                }}
                                colourObject={tagStore.run.safelist.colour}
                                text={'Not Implemented'}
                            />
                        </span>
                    </SettingCard>
                </div>
            </NavigationBar>
        </div>
    );
};

export default Essentials;
