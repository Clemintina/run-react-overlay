/**
 * Checks if process NODE_ENV in 'development' mode
 */
export function inDev(): boolean {
	return process.env.NODE_ENV == "development";
}

export const assertDefaultError = (unreachable: never) => {
    throw new Error(`Unreachable Code! ${unreachable}`);
};

export const awaitTimeout = (ms) => new Promise((res) => setTimeout(res, ms));
