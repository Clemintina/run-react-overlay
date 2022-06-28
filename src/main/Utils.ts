import fastJson from "fast-json-stringify";

export const handleIPCSend = (data: object) => {
    const stringify = fastJson({
        title: "Json Schema for IPC",
        type: "object",
        properties: {
            data: {
                type: "object",
                patternProperties: {
                    "^.*$": {
                        anyOf: [{type: "string"}, {type: "boolean"}, {type: "number"}],
                    },
                },
                additionalProperties: false,
            },
            code: {type: "number", default: 200},
        },
        required: ["data", "code"],
    });
    return stringify(data);
};
