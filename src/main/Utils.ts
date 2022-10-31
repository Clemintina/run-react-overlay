import fastJson from "fast-json-stringify";
import {IPCResponse} from "@common/utils/externalapis/RunApi";

export const handleIPCSend = <T>(data: IPCResponse<T>) => {
    const stringify = fastJson({
        title: "Json Schema for IPC",
        type: "object",
        properties: {
            data: {
                type: "object",
                patternProperties: {
                    "^.*$": {
                        anyOf: [{ type: "string" }, { type: "boolean" }, { type: "number" }, { type: "object" }],
                    },
                },
                additionalProperties: true,
            },
            status: { type: "number", default: 200 },
        },
        required: ["data", "status"],
    });
    return stringify(data);
};

export const createEnumChecker = <T extends string, TEnumValue extends string>(enumVariable: { [key in T]: TEnumValue }) => {
    const enumValues = Object.values(enumVariable);
    return (value: string | number | boolean): value is TEnumValue => enumValues.includes(value);
};
