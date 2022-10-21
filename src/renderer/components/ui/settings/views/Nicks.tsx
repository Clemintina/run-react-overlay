import React, { useEffect, useState } from "react";
import NavigationBar from "@components/ui/settings/views/NavigationBar";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import PlayerNicknameView from "@common/utils/player/PlayerNickname";
import { PlayerNickname } from "@common/utils/Schemas";
import { InputTextBox } from "@components/user/InputTextBox";
import { Components } from "@common/zikeji";
import { RequestType } from "@common/utils/externalapis/RunApi";
import { InputBoxButton } from "@components/user/InputBoxButton";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import { SxProps } from "@mui/material";

const NickView = () => {
    const { nicks, hypixelApiKey } = useConfigStore((state) => ({
        nicks: state.nicks,
        hypixelApiKey: state.hypixel.apiKey,
    }));
    const [playerNickname, setPlayerNickname] = useState({ name: "", nick: "", added: 0, uuid: "" });
    const [clearText, setClearText] = useState(false);
    const styledProps: SxProps = {
        width: 0.86,
    };

    useEffect(() => {
        if (clearText) {
            setClearText(false);
        }
    }, [clearText]);

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
    };

    // TODO make it look nicer and cleaner
    return (
        <div>
            <NavigationBar>
                <div className='h-full w-full p-2 text-center'>
                    <div>
                        <SettingCard className={"border-2 border-cyan-500"}>
                            <span className={" "}>
                                <InputTextBox
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
                                />
                            </span>
                            <span className={" "}>
                                <InputTextBox
                                    onBlur={(event) => {
                                        setPlayerNickname({ ...playerNickname, nick: event.currentTarget.value });
                                        const user = nicks.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
                                        if (user) {
                                            const users = nicks.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
                                            useConfigStore.getState().setNicks([...users, playerNickname]);
                                        }
                                    }}
                                    options={{
                                        placeholder: "Nickname",
                                        value: playerNickname.nick,
                                        clear: clearText,
                                        colour: "info",
                                        label: { text: "Nickname" },
                                    }}
                                />
                            </span>
                            <span className={""}>
                                <InputBoxButton
                                    text={"Add"}
                                    onClick={() => {
                                        addPlayer(playerNickname);
                                    }}
                                />
                            </span>
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
