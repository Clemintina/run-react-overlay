import React from "react";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import {ColourPicker} from "@components/user/settings/components/ColourPicker";
import {ColourPickerArray} from "@components/user/settings/components/ColourPickerArrays";
import {TagArray} from "@common/utils/Schemas";
import {TagSchema} from "@common/utils/TagSchema";
import useTagStore from "@renderer/store/zustand/TagStore";
import {TagEditor} from "@components/user/settings/components/TagEditor";
import {AccordionDetails} from "@mui/material";
import {UserAccordion} from "@components/user/UserAccordion";

const TagEditorView = () => {
    const localTagStore: TagSchema = useTagStore((state) => state);

    const updateColourStore = async () => {
        useTagStore.getState().setTagStore(localTagStore);
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <div className="h-full p-2 flex flex-col">
                    <SettingCard>
                        <span className={"w-80"}>Tag</span>
                        <span className={"w-80"}>Display</span>
                        <span className={"w-80"}>Colour</span>
                    </SettingCard>
                    <UserAccordion name={"Run"}>
                        <SettingCard>
                            <span>Annoy List</span>
                            <span>
                                <TagEditor
                                    options={{colour: localTagStore.run.annoylist.colour, placeholder: localTagStore.run.annoylist.display}}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(() => {
                                            localTagStore.run.annoylist.display = event.currentTarget.value;
                                        });
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPicker
                                    setColour={async (colour: string) => {
                                        localTagStore.run.annoylist.colour = colour;
                                        await updateColourStore();
                                    }}
                                    colourObject={localTagStore.run.annoylist.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Blacklisted</span>
                            <span>
                                <TagEditor
                                    options={{colour: localTagStore.run.blacklist.colour, placeholder: localTagStore.run.blacklist.display}}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(() => {
                                            localTagStore.run.blacklist.display = event.currentTarget.value;
                                        });
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPicker
                                    setColour={async (colour: string) => {
                                        localTagStore.run.blacklist.colour = colour;
                                        await updateColourStore();
                                    }}
                                    colourObject={localTagStore.run.blacklist.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Encounters</span>
                            <span>
                                <TagEditor
                                    options={{colour: localTagStore.run.encounters.colour[0], placeholder: localTagStore.run.encounters.display}}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(() => {
                                            localTagStore.run.encounters.display = event.currentTarget.value;
                                        });
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPickerArray
                                    setColour={async (newTagArray: TagArray) => {
                                        const newColourObject = {...localTagStore.run.encounters};
                                        const newItem = {colour: newTagArray.colour, requirement: newTagArray.requirement, operator: "<="};
                                        if (Array.isArray(newColourObject.colour)) {
                                            const newColourArray = [...newColourObject.colour];
                                            newColourArray.filter((item: TagArray, index) => {
                                                if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
                                            });
                                            newColourArray.push(newItem);
                                            localTagStore.run.encounters.colour = newColourArray;
                                            await updateColourStore();
                                        }
                                    }}
                                    colourObject={localTagStore.run.encounters}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Name Change</span>
                            <span>
                                <TagEditor
                                    options={{colour: localTagStore.run.name_change.colour, placeholder: localTagStore.run.name_change.display}}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(() => {
                                            localTagStore.run.name_change.display = event.currentTarget.value;
                                        });
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPicker
                                    setColour={async (colour: string) => {
                                        localTagStore.run.name_change.colour = colour;
                                        await updateColourStore();
                                    }}
                                    colourObject={localTagStore.run.name_change.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Safelist</span>
                            <span>
                                <TagEditor
                                    options={{colour: localTagStore.run.safelist.colour, placeholder: localTagStore.run.safelist.display}}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(() => {
                                            localTagStore.run.safelist.display = event.currentTarget.value;
                                        });
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPickerArray
                                    setColour={async (newTagArray: TagArray) => {
                                        const newColourObject = {...localTagStore.run.safelist};
                                        const newItem = {colour: newTagArray.colour, requirement: newTagArray.requirement, operator: "<="};
                                        if (Array.isArray(newColourObject.colour)) {
                                            const newColourArray = [...newColourObject.colour];
                                            newColourArray.filter((item: TagArray, index) => {
                                                if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
                                            });
                                            newColourArray.push(newItem);
                                            localTagStore.run.safelist.colour = newColourArray;
                                            await updateColourStore();
                                        }
                                    }}
                                    colourObject={localTagStore.run.safelist}
                                />
                            </span>
                        </SettingCard>
                    </UserAccordion>
                    <UserAccordion name={"Boomza"}>
                        <AccordionDetails>
                            <SettingCard>
                                <span>Hacker</span>
                                <span>
                                    <TagEditor
                                        options={{colour: localTagStore.boomza.hacker.colour, placeholder: localTagStore.boomza.hacker.display}}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(() => {
                                                localTagStore.boomza.hacker.display = event.currentTarget.value;
                                            });
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            localTagStore.boomza.hacker.colour = colour;
                                            await updateColourStore();
                                        }}
                                        colourObject={localTagStore.boomza.hacker.colour}
                                    />
                                </span>
                            </SettingCard>
                            <SettingCard>
                                <span>Sniper</span>
                                <span>
                                    <TagEditor
                                        options={{colour: localTagStore.boomza.sniper.colour, placeholder: localTagStore.boomza.sniper.display}}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(() => {
                                                localTagStore.boomza.sniper.display = event.currentTarget.value;
                                            });
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            localTagStore.boomza.sniper.colour = colour;
                                            await updateColourStore();
                                        }}
                                        colourObject={localTagStore.boomza.sniper.colour}
                                    />
                                </span>
                            </SettingCard>
                        </AccordionDetails>
                    </UserAccordion>
                    <UserAccordion name={"Hypixel"}>
                        <AccordionDetails>
                            <SettingCard>
                                <span>Party</span>
                                <span>
                                    <TagEditor
                                        options={{colour: localTagStore.hypixel.party.colour, placeholder: localTagStore.hypixel.party.display}}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(() => {
                                                localTagStore.hypixel.party.display = event.currentTarget.value;
                                            });
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            localTagStore.hypixel.party.colour = colour;
                                            await updateColourStore();
                                        }}
                                        colourObject={localTagStore.hypixel.party.colour}
                                    />
                                </span>
                            </SettingCard>
                        </AccordionDetails>
                    </UserAccordion>
                </div>
            </NavigationBar>
        </div>
    );
};

export default TagEditorView;
