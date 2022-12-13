import { Static, Type } from "@sinclair/typebox";

export const RUNElectronStore = Type.Optional(
	Type.Object({
		settings: Type.Optional(
			Type.Object({
				updater: Type.Boolean({
					description: "Enable Automatic Updates",
					default: true,
				}),
			}),
		),
	}),
);

export const getDefaultElectronStore: RUNElectronStoreType = {
	settings: {
		updater: true,
	},
};

export type RUNElectronStoreType = Static<typeof RUNElectronStore>;

/**
 * Borrowed from
 * {@link [StackOverflow](https://stackoverflow.com/questions/47057649/typescript-string-dot-notation-of-nested-object)}
 */

export type PathsToStringProps<T> = T extends string ? [] : { [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>] }[Extract<keyof T, string>];

export type Join<T extends string[], D extends string> = T extends [] ? never : T extends [infer F] ? F : T extends [infer F, ...infer R] ? (F extends string ? `${F}${D}${Join<Extract<R, string[]>, D>}` : never) : string;
