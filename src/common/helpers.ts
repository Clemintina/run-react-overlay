import fastJson from "fast-json-stringify";
import destr from "destr";

/**
 * Checks if process NODE_ENV in 'development' mode
 */
export function inDev(): boolean {
    return process.env.NODE_ENV == "development";
}

export const handleIPCOn = (data: string) => {
    const response = destr(data);
    return {data: response.data, code: response.code};
};
