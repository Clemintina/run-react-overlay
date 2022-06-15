import {Player} from "./PlayerUtils";
import {Static, Type} from "@sinclair/typebox";

export namespace Schemas {

    export interface PlayerHandler {
        status: number;
        cause: string;
        data?: Player;
    }

}
