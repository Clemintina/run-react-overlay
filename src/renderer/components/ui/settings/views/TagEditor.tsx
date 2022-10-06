import React from "react";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import { ColourPicker } from "@components/user/settings/components/ColourPicker";
import { ColourPickerArray } from "@components/user/settings/components/ColourPickerArrays";
import { TagArray } from "@common/utils/Schemas";
import useTagStore from "@renderer/store/zustand/TagStore";
import { TagEditor } from "@components/user/settings/components/TagEditor";
import { AccordionDetails, ThemeProvider } from "@mui/material";
import { UserAccordion } from "@components/user/UserAccordion";
import produce from "immer";
import { TagSchema } from "@common/utils/TagSchema";

const TagEditorView = () => {
    const { tagStore } = useTagStore((state) => ({ tagStore: state }));
    let localTagStore = tagStore as TagSchema;
    const theme = {};

    // TODO make it look nicer and cleaner
    return (
        <ThemeProvider theme={theme}>
            <NavigationBar>
                <div className='h-fu"l p-2 flex flex-col'>
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
                                    options={{ colour: localTagStore.run.annoylist.colour, placeholder: localTagStore.run.annoylist.display }}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.annoylist.display = event.currentTarget.value;
                                            }),
                                        );
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPicker
                                    setColour={async (colour: string) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.annoylist.colour = colour;
                                            }),
                                        );
                                    }}
                                    colourObject={localTagStore.run.annoylist.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Blacklisted</span>
                            <span>
                                <TagEditor
                                    options={{ colour: localTagStore.run.blacklist.colour, placeholder: localTagStore.run.blacklist.display }}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.blacklist.display = event.currentTarget.value;
                                            }),
                                        );
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPicker
                                    setColour={async (colour: string) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.blacklist.colour = colour;
                                            }),
                                        );
                                    }}
                                    colourObject={localTagStore.run.blacklist.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Encounters</span>
                            <span>
                                <TagEditor
                                    options={{ colour: localTagStore.run.encounters.colour[0], placeholder: localTagStore.run.encounters.display }}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.encounters.display = event.currentTarget.value;
                                            }),
                                        );
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPickerArray
                                    setColour={async (newTagArray: TagArray) => {
                                        const newColourObject = { ...localTagStore.run.encounters };
                                        const newItem = { colour: newTagArray.colour, requirement: newTagArray.requirement, operator: "<=" };
                                        if (Array.isArray(newColourObject.colour)) {
                                            const newColourArray = [...newColourObject.colour];
                                            newColourArray.filter((item: TagArray, index) => {
                                                if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
                                            });
                                            newColourArray.push(newItem);
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.run.encounters.colour = newColourArray;
                                                }),
                                            );
                                        }
                                    }}
                                    colourObject={localTagStore.run.encounters}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Friends</span>
                            <span>
                                <TagEditor
                                    options={{ colour: localTagStore.run.friends.colour, placeholder: localTagStore.run.friends.display }}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.friends.display = event.currentTarget.value;
                                            }),
                                        );
                                    }}
                                />
                            </span>

                            <span>
                                <ColourPicker
                                    setColour={async (colour: string) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.friends.colour = colour;
                                            }),
                                        );
                                    }}
                                    colourObject={localTagStore.run.friends.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Safelist</span>
                            <span>
                                <TagEditor
                                    options={{ colour: localTagStore.run.safelist.colour, placeholder: localTagStore.run.safelist.display }}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.safelist.display = event.currentTarget.value;
                                            }),
                                        );
                                    }}
                                />
                            </span>
                            <span>
                                <ColourPickerArray
                                    setColour={async (newTagArray: TagArray) => {
                                        const newColourObject = { ...localTagStore.run.safelist };
                                        const newItem = { colour: newTagArray.colour, requirement: newTagArray.requirement, operator: "<=" };
                                        if (Array.isArray(newColourObject.colour)) {
                                            const newColourArray = [...newColourObject.colour];
                                            newColourArray.filter((item: TagArray, index) => {
                                                if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
                                            });
                                            newColourArray.push(newItem);
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.run.safelist.colour = newColourArray;
                                                }),
                                            );
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
                                        options={{ colour: localTagStore.boomza.hacker.colour, placeholder: localTagStore.boomza.hacker.display }}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.boomza.hacker.display = event.currentTarget.value;
                                                }),
                                            );
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.boomza.hacker.colour = colour;
                                                }),
                                            );
                                        }}
                                        colourObject={localTagStore.boomza.hacker.colour}
                                    />
                                </span>
                            </SettingCard>
                            <SettingCard>
                                <span>Sniper</span>
                                <span>
                                    <TagEditor
                                        options={{ colour: localTagStore.boomza.sniper.colour, placeholder: localTagStore.boomza.sniper.display }}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.boomza.sniper.display = event.currentTarget.value;
                                                }),
                                            );
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.boomza.sniper.colour = colour;
                                                }),
                                            );
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
                                        options={{ colour: localTagStore.hypixel.party.colour, placeholder: localTagStore.hypixel.party.display }}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.hypixel.party.display = event.currentTarget.value;
                                                }),
                                            );
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.hypixel.party.colour = colour;
                                                }),
                                            );
                                        }}
                                        colourObject={localTagStore.hypixel.party.colour}
                                    />
                                </span>
                            </SettingCard>
                        </AccordionDetails>
                    </UserAccordion>
                    <UserAccordion name={"Keathiz"}>
                        <AccordionDetails>
                            <SettingCard>
                                <span>No Data</span>
                                <span>
                                    <TagEditor
                                        options={{ colour: localTagStore.keathiz.no_data.colour, placeholder: localTagStore.keathiz.no_data.display }}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.keathiz.no_data.display = event.currentTarget.value;
                                                }),
                                            );
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.keathiz.no_data.colour = colour;
                                                }),
                                            );
                                        }}
                                        colourObject={localTagStore.keathiz.no_data.colour}
                                    />
                                </span>
                            </SettingCard>
                            <SettingCard>
                                <span>Queue Total</span>
                                <span>
                                    <TagEditor
                                        options={{ colour: localTagStore.keathiz.queues.queue_total.colour, placeholder: localTagStore.keathiz.queues.queue_total.display }}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.keathiz.queues.queue_total.display = event.currentTarget.value;
                                                }),
                                            );
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPicker
                                        setColour={async (colour: string) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.keathiz.queues.queue_total.colour = colour;
                                                }),
                                            );
                                        }}
                                        colourObject={localTagStore.keathiz.queues.queue_total.colour}
                                    />
                                </span>
                            </SettingCard>
                            <SettingCard>
                                <span>Queue Count</span>
                                <span>
                                    <TagEditor
                                        options={{ colour: localTagStore.keathiz.queues.queue_count.colours[0], placeholder: localTagStore.keathiz.queues.queue_count.display }}
                                        onBlur={(event) => {
                                            useTagStore.getState().setStore(
                                                produce((state: any) => {
                                                    state.keathiz.queues.queue_count.display = event.currentTarget.value;
                                                }),
                                            );
                                        }}
                                    />
                                </span>
                                <span>
                                    <ColourPickerArray
                                        setColour={async (newTagArray: TagArray) => {
                                            const newColourObject = { ...localTagStore.keathiz.queues.queue_count };
                                            const newItem = { colour: newTagArray.colour, requirement: newTagArray.requirement, operator: "<=" };
                                            if (Array.isArray(newColourObject.colours)) {
                                                const newColourArray = [...newColourObject.colours];
                                                newColourArray.filter((item: TagArray, index) => {
                                                    if (item.requirement == newItem.requirement) newColourArray.splice(index, 1);
                                                });
                                                newColourArray.push(newItem);
                                                useTagStore.getState().setStore(
                                                    produce((state: any) => {
                                                        state.keathiz.queues.queue_count.colours = newColourArray;
                                                    }),
                                                );
                                            }
                                        }}
                                        colourObject={localTagStore.keathiz.queues.queue_count}
                                    />
                                </span>
                            </SettingCard>
                        </AccordionDetails>
                    </UserAccordion>
                </div>
            </NavigationBar>
        </ThemeProvider>
    );
};

export default TagEditorView;
