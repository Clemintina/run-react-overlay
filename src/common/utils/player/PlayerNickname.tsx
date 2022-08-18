import {PlayerNickname} from "@common/utils/Schemas";
import useConfigStore from "@renderer/store/zustand/ConfigStore";
import {SettingCard} from "@components/user/settings/components/SettingCard";
import {InputTextBox} from "@components/user/InputTextBox";
import {RequestType} from "@common/utils/externalapis/RunApi";
import {InputBoxButton} from "@components/user/InputBoxButton";
import React from "react";
import {Components} from "@common/zikeji";

const PlayerNicknameView = (props: {key: string; playerNick: PlayerNickname}) => {
    const hypixelApiKey = useConfigStore.getState().hypixel.apiKey;
    const nicksLocal = useConfigStore.getState().nicks;
    return (
        <SettingCard className={"border-2 border-cyan-500"}>
            <span className={" "}>
                <InputTextBox
                    onBlur={(event) => {
                        const nickIndex = nicksLocal.findIndex((obj) => obj.name == props.playerNick.name);
                        nicksLocal[nickIndex].nick = event.currentTarget.value;
                        useConfigStore.getState().setNicks(nicksLocal);
                    }}
                    options={{placeholder: "Nickname", value: props.playerNick.nick}}
                />
            </span>
            <span className={" "}>
                <InputTextBox
                    onBlur={async (event) => {
                        const userInput = event.currentTarget.value;
                        if (userInput.length == 0) return;
                        const nickIndex = nicksLocal.findIndex((obj) => obj.nick == props.playerNick.nick);
                        nicksLocal[nickIndex].name = userInput;
                        const hypixelRequest = await window.ipcRenderer.invoke<Components.Schemas.Player>("hypixel", RequestType.USERNAME, userInput, hypixelApiKey);
                        nicksLocal[nickIndex].uuid = hypixelRequest?.data?.uuid ?? userInput;
                        useConfigStore.getState().setNicks(nicksLocal);
                    }}
                    options={{placeholder: "Username", value: props.playerNick.name}}
                />
            </span>
            <span className={""}>
                <InputBoxButton
                    text={"Remove"}
                    onClick={(event) => {
                        const users = nicksLocal.filter((player) => player.name.toLowerCase() != props.playerNick.name.toLowerCase());
                        useConfigStore.getState().setNicks(users);
                    }}
                />
            </span>
        </SettingCard>
    );
};

export default PlayerNicknameView;
