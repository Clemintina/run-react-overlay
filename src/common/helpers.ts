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

export const hexToRgbA = (hex, opacity) => {
	let c;
	if (/^#([A-Fa-f\d]{3}){1,2}$/.test(hex)) {
		c = hex.substring(1).split("");
		if (c.length === 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = `0x${c.join("")}`;
		return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${opacity})`;
	}
};
