import axios from "axios";

export const sendDiscordRequest = async (discordMessage: DiscordMessage) => {
    const stringifiedData = JSON.stringify(discordMessage.discord);
    if (discordMessage.discord.username == undefined) {
        discordMessage.discord.username = "API Monitor";
    }
    discordMessage.discord.avatar_url = "https://cdn.discordapp.com/avatars/876146821737639936/6d5e2466e75eecc83dd6dc7656922a39.png?size=1024";
    try {
        await axios.post(discordMessage.url, stringifiedData, {headers: {"Content-Type": "application/json"}});
    } catch (e) {
        console.log(e);
    }
};

export interface DiscordMessage {
    url: string;
    discord: {
        avatar_url?: string;
        content?: string;
        username?: string;
        embeds?: Array<{
            color?: number;
            title?: string;
            url?: string;
            author?: {
                name: string;
                icon_url: string;
                url: string;
            };
            description?: string;
            thumbnail?: {
                url: string,
                proxy_url?: string,
                height?: number,
                width?: number
            };
            fields?: Array<{
                name: string;
                value: string;
                inline: boolean;
            }>;
            image?: {url: string};
            timestamp?: number;
            footer?: {
                text: string;
                icon_url: string;
            };
        }>;
        attachments?: [];
    };
}
