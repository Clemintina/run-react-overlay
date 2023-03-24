import { GenericHTTPError, InvalidKeyError, RateLimitError } from "@common/zikeji";
import type { DefaultMeta, RequestOptions } from "../Client";
import { Components } from "../types/api";
import axios, { CreateAxiosDefaults } from "axios";
import { RequestedTooManyTimes } from "@common/zikeji/errors/RequestedTooManyTimes";

/** @internal */
const CACHE_CONTROL_REGEX = /s-maxage=(\d+)/;

/** @internal */
export const request = async <T extends Components.Schemas.ApiSuccess & { cause?: string } & { cloudflareCache?: DefaultMeta["cloudflareCache"] }>(options: RequestOptions): Promise<T> => {
	let axiosError: Error;
	const axiosConfig: CreateAxiosDefaults = {
		headers: {
			Accept: "application/json",
		},
		timeout: options.timeout,
		timeoutErrorMessage: JSON.stringify({ status: 408, data: { success: false } }),
		validateStatus: () => true,
	};

	if (options.key) {
		// @ts-ignore
		axiosConfig.headers = {
			...axiosConfig.headers,
			"API-Key": options.key,
		};
	}

	if (options.proxy) {
		axiosConfig.httpsAgent = options.proxy;
	}

	const axiosClient = axios.create(axiosConfig);
	const axiosResponse = await axiosClient.get(options.url);

	if (!options.noRateLimit) {
		// @ts-ignore
		options.getRateLimitHeaders(axiosResponse.headers);
	}

	let responseObject: T | undefined;
	try {
		responseObject = axiosResponse.data;
	} catch (e) {
		console.log(e);
	}

	if (axiosResponse.status !== 200) {
		if (axiosResponse.status === 429) {
			if (axiosResponse.data.cause === "You have already looked up this name recently") {
				axiosError = new RequestedTooManyTimes(`This player has been requested too many times!`);
			} else {
				axiosError = new RateLimitError(`Hit key throttle.`);
			}
		} else if (axiosResponse.status === 403) {
			if (axiosResponse.data.cause == "Too many invalid API keys") {
				axiosError = new GenericHTTPError(axiosResponse.status, axiosResponse.data.cause);
			} else {
				axiosError = new InvalidKeyError("Invalid Hypixel API Key");
			}
		} else if (responseObject?.cause) {
			axiosError = new GenericHTTPError(axiosResponse.status, responseObject.cause);
		} else {
			/**
			 * Generic catch all that probably should never be caught.
			 */
			axiosError = new Error(`${axiosResponse.status} ${axiosResponse.statusText}. Response: ${responseObject}`);
		}
	}

	if (typeof responseObject === "undefined") {
		axiosError = new Error(`Invalid JSON response received. Response: ${responseObject}`);
	}

	if (axiosResponse.headers["cf-cache-status"] && responseObject != undefined) {
		const age = parseInt(axiosResponse.headers.age as string, 10);
		const maxAge = CACHE_CONTROL_REGEX.exec(axiosResponse.headers["cache-control"] as string);
		responseObject.cloudflareCache = {
			status: axiosResponse.headers["cf-cache-status"] as never,
			...(typeof age === "number" && !Number.isNaN(age) && { age }),
			...(axiosResponse.headers["cf-cache-status"] === "HIT" && (typeof age !== "number" || Number.isNaN(age)) && { age: 0 }),
			...(maxAge &&
				typeof maxAge === "object" &&
				maxAge.length === 2 &&
				parseInt(maxAge[1], 10) > 0 && {
					maxAge: parseInt(maxAge[1], 10),
				}),
		};
	}

	return new Promise<T>((resolve, reject) => {
		if (axiosResponse.status != 200) return reject(axiosError);
		else if (axiosResponse.status == 200 && responseObject != null) return resolve(responseObject);
		else reject(axiosError);
	});
};
