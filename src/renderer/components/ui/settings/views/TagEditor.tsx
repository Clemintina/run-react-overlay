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

const TagEditorView = () => {
    const { run, boomza, keathiz, hypixel } = useTagStore((state) => ({ run: state.run, boomza: state.boomza, keathiz: state.keathiz, hypixel: state.hypixel }));
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
                    <UserAccordion name={"Seraph"}>
                        <SettingCard>
                            <span>Annoy List</span>
                            <span>
                                <TagEditor
                                    options={{
                                        colour: run.annoylist.colour,
                                        placeholder: run.annoylist.display,
                                        label: { text: "Annoy list" },
                                    }}
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
                                    colourObject={run.annoylist.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Blacklisted</span>
                            <span>
                                <TagEditor
                                    options={{
                                        colour: run.blacklist.colour,
                                        placeholder: run.blacklist.display,
                                        label: { text: "Blacklist" },
                                    }}
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
                                    colourObject={run.blacklist.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Encounters</span>
                            <span>
                                <TagEditor
                                    options={{
                                        colour: run.encounters.colour[0],
                                        placeholder: run.encounters.display,
                                        label: { text: "Encounters" },
                                    }}
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
                                        const newColourObject = { ...run.encounters };
                                        const newItem = {
                                            colour: newTagArray.colour,
                                            requirement: newTagArray.requirement,
                                            operator: "<=",
                                        };
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
                                    colourObject={run.encounters}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Friends</span>
                            <span>
                                <TagEditor
                                    options={{
                                        colour: run.friends.colour,
                                        placeholder: run.friends.display,
                                        label: { text: "Friends" },
                                    }}
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
                                    colourObject={run.friends.colour}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Safelist</span>
                            <span>
                                <TagEditor
                                    options={{
                                        colour: run.safelist.colour,
                                        placeholder: run.safelist.display,
                                        label: { text: "Safelist" },
                                    }}
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
                                        const newColourObject = { ...run.safelist };
                                        const newItem = {
                                            colour: newTagArray.colour,
                                            requirement: newTagArray.requirement,
                                            operator: "<=",
                                        };
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
                                    colourObject={run.safelist}
                                />
                            </span>
                        </SettingCard>
                        <SettingCard>
                            <span>Personal Safelist</span>
                            <span>
                                <TagEditor
                                    options={{
                                        colour: run.personal_safelist.colour,
                                        placeholder: run.personal_safelist.display,
                                        label: { text: "Personal Safelist" },
                                    }}
                                    onBlur={(event) => {
                                        useTagStore.getState().setStore(
                                            produce((state: any) => {
                                                state.run.personal_safelist.display = event.currentTarget.value;
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
                                                state.run.personal_safelist.colour = colour;
                                            }),
                                        );
                                    }}
                                    colourObject={run.personal_safelist.colour}
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
                                        options={{
                                            colour: boomza.hacker.colour,
                                            placeholder: boomza.hacker.display,
                                            label: { text: "Boomza Hacker" },
                                        }}
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
                                        colourObject={boomza.hacker.colour}
                                    />
                                </span>
                            </SettingCard>
                            <SettingCard>
                                <span>Sniper</span>
                                <span>
                                    <TagEditor
                                        options={{
                                            colour: boomza.sniper.colour,
                                            placeholder: boomza.sniper.display,
                                            label: { text: "Boomza Sniper" },
                                        }}
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
                                        colourObject={boomza.sniper.colour}
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
                                        options={{
                                            colour: hypixel.party.colour,
                                            placeholder: hypixel.party.display,
                                            label: { text: "Party" },
                                        }}
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
                                        colourObject={hypixel.party.colour}
                                    />
                                </span>
                            </SettingCard>
                        </AccordionDetails>
                    </UserAccordion>
                    <UserAccordion name={"Antisniper"}>
                        <AccordionDetails>
                            <SettingCard>
                                <span>No Data</span>
                                <span>
                                    <TagEditor
                                        options={{
                                            colour: keathiz.no_data.colour,
                                            placeholder: keathiz.no_data.display,
                                            label: { text: "Keathiz No Data" },
                                        }}
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
                                        colourObject={keathiz.no_data.colour}
                                    />
                                </span>
                            </SettingCard>
                            <SettingCard>
                                <span>Queue Total</span>
                                <span>
                                    <TagEditor
                                        options={{
                                            colour: keathiz.queues.queue_total.colour,
                                            placeholder: keathiz.queues.queue_total.display,
                                            label: { text: "Keathiz Queue Total" },
                                        }}
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
                                        colourObject={keathiz.queues.queue_total.colour}
                                    />
                                </span>
                            </SettingCard>
                            <SettingCard>
                                <span>Queue Count</span>
                                <span>
                                    <TagEditor
                                        options={{
                                            colour: keathiz.queues.queue_count.colours[0],
                                            placeholder: keathiz.queues.queue_count.display,
                                            label: { text: "Keathiz Queue Count" },
                                        }}
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
                                            const newColourObject = { ...keathiz.queues.queue_count };
                                            const newItem = {
                                                colour: newTagArray.colour,
                                                requirement: newTagArray.requirement,
                                                operator: "<=",
                                            };
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
                                        colourObject={keathiz.queues.queue_count}
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
