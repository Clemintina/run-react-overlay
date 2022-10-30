import React, {useEffect, useState} from "react";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import PlayerNicknameView from "@common/utils/player/PlayerNickname";
import {PlayerNickname} from "@common/utils/Schemas";
import {Components} from "@common/zikeji";
import {RequestType} from "@common/utils/externalapis/RunApi";
import {InputBoxButton} from "@components/user/InputBoxButton";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {Autocomplete, Box, TextField} from "@mui/material";
import usePlayerStore from "@renderer/store/zustand/PlayerStore";
import {Player} from "@common/utils/PlayerUtils";
import {IpcValidInvokeChannels} from "@common/utils/IPCHandler";

const NickView = () => {
    const {nicks, hypixelApiKey} = useConfigStore((state) => ({
        nicks: state.nicks,
        hypixelApiKey: state.hypixel.apiKey,
    }));
    const {players} = usePlayerStore((state) => ({players: state.players}));
    const [playerNickname, setPlayerNickname] = useState({name: "", nick: "", added: 0, uuid: ""});
    const [clearText, setClearText] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");
    const [nickInput, setNickInput] = useState("");

    useEffect(() => {
        if (clearText) {
            setClearText(false);
        }
    }, [clearText]);

    const playerArray: Array<string> = [];
    const nickArray: Array<string> = [];

    players.map((p: Player) => {
        if (!p.nicked) {
            playerArray.push(p?.hypixelPlayer?.displayname ?? p.name);
        } else {
            nickArray.push(p.name);
        }
    });

    const addPlayer = (nickname: PlayerNickname) => {
        const pNick = nickname;
        pNick.added = Date.now();
        const user = nicks.some((player) => player.name.toLowerCase() == pNick.name.toLowerCase());
        if (!user) {
            const users = nicks;
            users.push(pNick);
            useConfigStore.getState().setNicks(users);
        }
        /*else {
            const knownNick = nicks.filter((player) => player.name.toLowerCase() != playerNickname.name.toLowerCase());
            console.log("Known Nick: ", knownNick);
            knownNick.push(playerNickname);
            console.log(knownNick);
            useConfigStore.getState().setNicks(knownNick);
        }
         */
        console.log(pNick);
        clearPlayer();
    };

    const removePlayer = (pNick: PlayerNickname) => {
        const users = nicks.filter((player) => player.name.toLowerCase() != pNick.name.toLowerCase());
        useConfigStore.getState().setNicks(users);
    };

    const clearPlayer = () => {
        setPlayerNickname({ ...playerNickname, name: "", nick: "", added: 0, uuid: "" });
        setNickInput("");
        setUsernameInput("");
    };

    const commonSx = {
        minHeight: 20,
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <div className='h-full w-full p-2 text-center'>
                    <div>
                        <SettingCard className={"border-2 border-cyan-500"}>
                            <Box>
                                {/* <InputTextBox
                                    onBlur={async (event) => {
                                        const userInput = event.currentTarget.value;
                                        if (userInput.length == 0) return;
                                        const hypixelRequest = await window.ipcRenderer.invoke<Components.Schemas.Player>("hypixel", RequestType.USERNAME, userInput, hypixelApiKey);
                                        setPlayerNickname({
                                            ...playerNickname,
                                            uuid: hypixelRequest?.data?.uuid ?? userInput,
                                            name: hypixelRequest?.data?.displayname ?? userInput,
                                        });
                                        const user = nicks.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
                                        if (user) {
                                            const users = nicks.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
                                            useConfigStore.getState().setNicks([...users, playerNickname]);
                                        }
                                    }}
                                    onFocus={() => {
                                        setPlayerNickname({ ...playerNickname, name: "" });
                                    }}
                                    options={{
                                        placeholder: "Username",
                                        value: playerNickname.name,
                                        clear: clearText,
                                        label: { text: "Username" },
                                        colour: "info",
                                    }}
                                />*/}
                                <Autocomplete
                                    freeSolo
                                    disablePortal
                                    options={[...playerArray]}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={"Username"}
                                            variant={"outlined"}
                                            onBlur={async (event) => {
                                                const userInput = event.currentTarget.value;
                                                if (userInput.length == 0) return;
                                                const hypixelRequest = await window.ipcRenderer.invoke<Components.Schemas.Player>(IpcValidInvokeChannels.HYPIXEL, [RequestType.USERNAME, userInput, hypixelApiKey]);
                                                setPlayerNickname({
                                                    ...playerNickname,
                                                    uuid: hypixelRequest?.data?.uuid ?? userInput,
                                                    name: hypixelRequest?.data?.displayname ?? userInput,
                                                });
                                                const user = nicks.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
                                                if (user) {
                                                    const users = nicks.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
                                                    useConfigStore.getState().setNicks([...users, playerNickname]);
                                                }
                                            }}
                                            onFocus={() => {
                                                setPlayerNickname({ ...playerNickname, name: "" });
                                            }}
                                            onChange={(event) => {
                                                setUsernameInput(event.target.value);
                                            }}
                                            value={usernameInput}
                                        />
                                    )}
                                />
                            </Box>
                            <Box className={" "}>
                                <Autocomplete
                                    freeSolo
                                    disablePortal
                                    options={[...nickArray]}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={"Nickname"}
                                            variant={"outlined"}
                                            onBlur={(event) => {
                                                setPlayerNickname({ ...playerNickname, nick: event.currentTarget.value });
                                                const user = nicks.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
                                                if (user) {
                                                    const users = nicks.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
                                                    useConfigStore.getState().setNicks([...users, playerNickname]);
                                                }
                                            }}
                                            onChange={(event) => {
                                                setNickInput(event.target.value);
                                            }}
                                            value={nickInput}
                                        />
                                    )}
                                />
                            </Box>
                            <div className={""}>
                                <InputBoxButton
                                    text={"Add"}
                                    sx={{
                                        width: "50%",
                                        height: "100%",
                                    }}
                                    onClick={() => {
                                        addPlayer(playerNickname);
                                        clearPlayer();
                                    }}
                                    options={{
                                        colour: "success",
                                    }}
                                />
                            </div>
                        </SettingCard>
                    </div>
                    <div>
                        {nicks.map((playerNick) => (
                            <div key={playerNick.nick} className={"pt-2"}>
                                <PlayerNicknameView key={playerNick.nick} playerNick={playerNick} handleAdd={addPlayer} handleRemove={removePlayer} />
                            </div>
                        ))}
                    </div>
                </div>
            </NavigationBar>
        </div>
    );
};

export default NickView;
