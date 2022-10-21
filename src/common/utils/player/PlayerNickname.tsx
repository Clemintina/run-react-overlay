import { PlayerNickname } from "@common/utils/Schemas";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import { SettingCard } from "@components/user/settings/components/SettingCard";
import { InputTextBox } from "@components/user/InputTextBox";
import { RequestType } from "@common/utils/externalapis/RunApi";
import { InputBoxButton } from "@components/user/InputBoxButton";
import React, { useState } from "react";
import { Components } from "@common/zikeji";

const PlayerNicknameView = (props: { key: string; playerNick: PlayerNickname; handleAdd: (player) => void; handleRemove: (player) => void }) => {
    const { nicksLocal, hypixelApiKey } = useConfigStore((state) => ({
        nicksLocal: state.nicks,
        hypixelApiKey: state.hypixel.apiKey,
    }));
    const users = nicksLocal.filter((player) => player.nick.toLowerCase() == props.playerNick.nick.toLowerCase());
    const [playerNickname, setPlayerNickname] = useState(users[0]);

    const clearPlayer = () => {
        setPlayerNickname({ name: "", nick: "", added: 0, uuid: "" });
    };

    return (
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
                        const user = nicksLocal.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
                        if (user) {
                            const users = nicksLocal.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
                            useConfigStore.getState().setNicks([...users, playerNickname]);
                        }
                    }}
                    options={{ placeholder: "Username", value: playerNickname.name, label: { text: "Username" } }}
                />
            </span>
            <span className={" "}>
                <InputTextBox
                    onBlur={(event) => {
                        setPlayerNickname({ ...playerNickname, nick: event.currentTarget.value });
                        const user = nicksLocal.some((player) => player.uuid.toLowerCase() == playerNickname.uuid.toLowerCase());
                        if (user) {
                            const users = nicksLocal.filter((player) => player.uuid.toLowerCase() != playerNickname.uuid.toLowerCase());
                            useConfigStore.getState().setNicks([...users, playerNickname]);
                        }
                    }}
                    options={{ placeholder: "Nickname", value: playerNickname.nick, label: { text: "Nickname" } }}
                />
            </span>
            <span className={""}>
                <InputBoxButton
                    text={"Remove"}
                    onClick={(event) => {
                        props.handleRemove(playerNickname);
                    }}
                />
            </span>
        </SettingCard>
    );
};

export default PlayerNicknameView;
