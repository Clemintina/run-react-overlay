import { Player } from "@common/utils/PlayerUtils";

export const generateRandomNumber = (param1, param2) => {
	const random_number = Math.floor(Math.random() * (param1 - param2 + 1) + param1);
	return random_number < 0 ? generateRandomNumber(param1, param2) : random_number;
};

export const constantPlayerData = () => {
	const player: Player = {
		name: "queued_player",
		id: "8589389e8b6b46c288084eb71ec3479e",
		bot: false,
		nicked: false,
		friended: false,
		loaded: true,
		last_updated: 0,
		hypixelGuild: {
			data: {
				_id: "61e800b78ea8c991568ca03f",
				name: "The Hangover",
				name_lower: "the hangover",
				coins: 0,
				coinsEver: 0,
				created: 1642594487888,
				members: [
					{
						uuid: "96e3b5b8290c4d85a5381d9da63c3f22",
						rank: "Nickel",
						joined: 1642594514148,
						questParticipation: 197,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 4493,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "9f8136c2668f40f587d7d44aa03eab78",
						rank: "Bartender",
						joined: 1642595667315,
						questParticipation: 68,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "f0635cac56404260bf8dcd5f11dc27b9",
						rank: "Hungover",
						joined: 1642602442819,
						questParticipation: 23,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "3aa0ae4346c74359a44cdca3696196ea",
						rank: "Hungover",
						joined: 1642606605817,
						questParticipation: 189,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "56ed8324c9b649a79acead7f38a278b1",
						rank: "Pothead",
						joined: 1642609154478,
						questParticipation: 508,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "cec0af46f3fc42858fd6fd68807040bb",
						rank: "Pothead",
						joined: 1642616146572,
						questParticipation: 308,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "ef895ef3a3e84a47b78f015833bd9f2e",
						rank: "Hungover",
						joined: 1642621509796,
						questParticipation: 27,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 1015,
						},
					},
					{
						uuid: "2f1dc2b6a55343479593e712ca7612ae",
						rank: "Hungover",
						joined: 1642627269546,
						questParticipation: 28,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "bd1b351f710e42c99ebf45b443a395fd",
						rank: "Hungover",
						joined: 1642627988774,
						questParticipation: 282,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "27225951ad9543faae71464db714e688",
						rank: "Hungover",
						joined: 1642630152262,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "769e769ef7cc487ea0be05377ae3d340",
						rank: "Hungover",
						joined: 1642656248867,
						questParticipation: 328,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 1114,
						},
					},
					{
						uuid: "a899617d41fb4a02842de9caa51b9cea",
						rank: "Hungover",
						joined: 1642727665296,
						questParticipation: 53,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "49fa3f391af7477da372828f4a378330",
						rank: "Hungover",
						joined: 1642736087320,
						questParticipation: 63,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "94f8883cc4c04c3d8d2d8e03db4e9e4d",
						rank: "Hungover",
						joined: 1642768259125,
						questParticipation: 62,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "93870d06d48341ccb6d050ccbcc217a6",
						rank: "Hungover",
						joined: 1642776416167,
						questParticipation: 56,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "ec041ac7d2d74314ac8334a18e5bcc48",
						rank: "Hungover",
						joined: 1642779521878,
						questParticipation: 87,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "ab2b556c68664ba1a88858d8a9d4807e",
						rank: "Hungover",
						joined: 1642800952805,
						questParticipation: 330,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "c8ae89de20d34e379052004978ae6c61",
						rank: "Hungover",
						joined: 1642801598117,
						questParticipation: 43,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 146,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "c3c0fc8592c844bb93e757dfe8b5e26a",
						rank: "Pothead",
						joined: 1642802306227,
						questParticipation: 544,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 2449,
							"2022-09-30": 9597,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "7ac76ebbcb744b1c80dbf1deb9edf900",
						rank: "Hungover",
						joined: 1642812774263,
						questParticipation: 7,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "95bebc2ef8fe46dfaaf4aed042a4a2df",
						rank: "Hungover",
						joined: 1642818196799,
						questParticipation: 160,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "f5976b763b6e4407a70de430c266a5be",
						rank: "Pothead",
						joined: 1642902570896,
						questParticipation: 429,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "5679f8fa2442481d96d2e68d5b940ee9",
						rank: "Hungover",
						joined: 1643299657443,
						questParticipation: 304,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 3798,
							"2022-09-30": 421,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "09651dab5ffa4e16950190e567d2ba66",
						rank: "Bouncer",
						joined: 1643491356273,
						questParticipation: 59,
						mutedTill: 1645751831641,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "d5a0c0dde3da47c58d5a8af49be1dd75",
						rank: "Hungover",
						joined: 1643809975112,
						questParticipation: 232,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "eff3bd5a8f6844b89b2cf394aa54831d",
						rank: "Hungover",
						joined: 1643908420938,
						questParticipation: 36,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 25346,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "363a43568f7a43a381b5f813c51bb5eb",
						rank: "Hungover",
						joined: 1645302017305,
						questParticipation: 93,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "541d7a6a6fd0467f9b59fb93c07060fc",
						rank: "Hungover",
						joined: 1645653234002,
						mutedTill: 1645751415777,
						questParticipation: 38,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 1672,
							"2022-10-02": 0,
							"2022-10-01": 18338,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "6c71ff66b0a4458f8d9f1303ef32c424",
						rank: "Hungover",
						joined: 1646539643661,
						questParticipation: 24,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "806fcabe30f244959669110596a82c4d",
						rank: "Guild Master",
						joined: 1647111696993,
						questParticipation: 4,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "16b431153d6640e4a8ddf39176a3c237",
						rank: "Hungover",
						joined: 1647294129699,
						questParticipation: 7,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "861f2d0cea1d4dea9e5551ea4e5b2e52",
						rank: "Hungover",
						joined: 1647556944370,
						questParticipation: 54,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 1612,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "f1dd8ffa9fa14246a29244a8a598f890",
						rank: "Hungover",
						joined: 1648097744340,
						questParticipation: 1,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "ef1af9a1ca26467290ddc62bf306ed0d",
						rank: "Shitfaced",
						joined: 1648345814004,
						questParticipation: 7,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "36fe216fd5aa4ba89ddb0dc308f6f6e1",
						rank: "Hungover",
						joined: 1649456792649,
						questParticipation: 300,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "5b45cb4e71b646acbe293e1c7ce34bc6",
						rank: "Hungover",
						joined: 1649523803626,
						questParticipation: 126,
						expHistory: {
							"2022-10-05": 699,
							"2022-10-04": 820,
							"2022-10-03": 25,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "99cd61eef3684be989425d31ed1213db",
						rank: "Hungover",
						joined: 1649867637221,
						questParticipation: 56,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 414,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "7c0f2df82db849038f4825dc64596aa2",
						rank: "Hungover",
						joined: 1649891904806,
						questParticipation: 378,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 15491,
							"2022-10-03": 5134,
							"2022-10-02": 32519,
							"2022-10-01": 7499,
							"2022-09-30": 894,
							"2022-09-29": 102,
						},
					},
					{
						uuid: "bc84d71720714328ab042a07cde71937",
						rank: "Hungover",
						joined: 1650470104577,
						questParticipation: 28,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "a71375a9e8fe441f95be818eae6f00b9",
						rank: "Hungover",
						joined: 1654665438023,
						questParticipation: 39,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 690,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "9f8cc4fb6c3945e1ac67c382fef1e6cf",
						rank: "Hungover",
						joined: 1656880419066,
						questParticipation: 31,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "d6478f3008d644ecb4d762aacaef9135",
						rank: "Hungover",
						joined: 1663270103035,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
					{
						uuid: "00cd23cf979d4a30a2d841cfeab06c09",
						rank: "Bouncer",
						joined: 1663270707849,
						expHistory: {
							"2022-10-05": 0,
							"2022-10-04": 0,
							"2022-10-03": 0,
							"2022-10-02": 0,
							"2022-10-01": 0,
							"2022-09-30": 0,
							"2022-09-29": 0,
						},
					},
				],
				ranks: [
					{
						name: "Hungover",
						default: true,
						tag: "Hung",
						created: 1642596337365,
						priority: 1,
					},
					{
						name: "Pothead",
						default: false,
						tag: "Head",
						created: 1642596296382,
						priority: 2,
					},
					{
						name: "Bartender",
						default: false,
						tag: "Tender",
						created: 1643404044064,
						priority: 5,
					},
					{
						name: "Bouncer",
						default: false,
						tag: "Bounce",
						created: 1648098680574,
						priority: 4,
					},
					{
						name: "Shitfaced",
						default: false,
						tag: "Shit",
						created: 1642634969889,
						priority: 3,
					},
				],
				achievements: {
					WINNERS: 1413,
					EXPERIENCE_KINGS: 334014,
					ONLINE_PLAYERS: 34,
				},
				exp: 62823831,
				description: "https://discord.gg/cpQ86vgnMp - Apply Here <3",
				tagColor: "GRAY",
				tag: "HANG",
				chatMute: 0,
				guildExpByGameType: {
					MCGO: 220938,
					VAMPIREZ: 276782,
					WALLS3: 202916,
					SURVIVAL_GAMES: 723717,
					MURDER_MYSTERY: 1133169,
					UHC: 533155,
					BATTLEGROUND: 19014,
					ARENA: 27811,
					ARCADE: 2090379,
					DUELS: 4855237,
					PIT: 112696,
					WOOL_GAMES: 193215,
					REPLAY: 0,
					LEGACY: 0,
					SMP: 0,
					HOUSING: 1994486,
					WALLS: 141604,
					BUILD_BATTLE: 1751808,
					GINGERBREAD: 5648,
					TNTGAMES: 2181119,
					SKYWARS: 7691707,
					SPEED_UHC: 0,
					QUAKECRAFT: 101162,
					SKYBLOCK: 0,
					SUPER_SMASH: 74785,
					PAINTBALL: 24323,
					BEDWARS: 122197351,
					PROTOTYPE: 26301541,
				},
			},
			status: 200,
		},
		hypixelPlayer: {
			_id: "5f1d33d2273efab4375d5b63",
			uuid: "8589389e8b6b46c288084eb71ec3479e",
			displayname: "Player",
			firstLogin: 1595749330000,
			knownAliasesLower: [],
			knownAliases: [],
			playername: "catgirlkay",
			achievementsOneTime: [
				"general_first_join",
				"general_first_friend",
				"general_first_chat",
				"buildbattle_legendary",
				"buildbattle_over_99",
				"buildbattle_pro_winner",
				"general_first_party",
				"duels_trial_by_combat",
				"duels_rematch",
				"bedwars_buggy_beds",
				"bedwars_destroy_beds",
				"bedwars_its_dark_down_there",
				"bedwars_merciless",
				"bedwars_thats_a_first",
				"general_a_long_journey_begins",
				"bedwars_already_over",
				"bedwars_builder",
				"bedwars_super_looter",
				"skyblock_your_adventure_begins",
				"skyblock_businessman",
				"bedwars_bed_trap",
				"bedwars_sneaky_rusher",
				"bedwars_revenge",
				"bedwars_ninja",
				"bedwars_distraction",
				"bedwars_alchemist",
				"bedwars_survivor",
				"bedwars_first_blood",
				"bedwars_first",
				"bedwars_rejoining_the_dream",
				"housing_join_friend",
				"housing_join_guild",
				"skywars_touch_of_death",
				"skywars_gapple",
				"skywars_well_well",
				"bedwars_minefield",
				"bedwars_dont_need_bed",
				"bedwars_geared_up",
				"bedwars_katniss_everdeen_style",
				"bedwars_pickaxe_challenge",
				"duels_untouchable",
				"bedwars_the_last_of_us",
				"skywars_fast_and_furious",
				"duels_my_preference",
				"duels_speed_duel",
				"duels_not_close_at_all",
				"general_youtuber",
				"duels_burn_baby_burn",
				"skyblock_your_big_break",
				"bedwars_shear_luck",
				"general_first_game",
				"blitz_first_game",
				"blitz_first_blood",
				"blitz_kill_without_kit",
				"murdermystery_soldiers_eliminated",
				"murdermystery_be_the_hero",
				"skywars_open_chest",
				"skywars_shiny_stuff",
				"skywars_gotcha",
				"duels_gg",
				"duels_build_battle",
				"bedwars_getting_the_job_done_better",
				"bedwars_ultimate_defense",
				"bedwars_team_player",
				"bedwars_bomber",
				"bedwars_you_cant_do_that",
				"general_friends_25",
				"bedwars_strategist",
				"bedwars_emerald_hoarder",
				"bedwars_out_of_stock",
				"bedwars_fireballs",
				"duels_shut_down",
				"duels_revenge",
				"housing_give_cookie",
				"bedwars_mission_control",
				"skywars_mob_spawner",
				"skywars_peacemaker",
				"skywars_baller",
				"skywars_corruption_lord",
				"skywars_gone_fishing",
				"housing_grand_opening",
				"halloween2017_pumpkin_death",
				"halloween2017_tricked",
				"halloween2017_spooky_looks",
				"bedwars_stay_away_from_me",
				"duels_domination",
				"halloween2017_haunted_maps",
				"halloween2017_fear_the_pumpkinator",
				"duels_speedy_sumo",
				"skywars_who_needs_teammates",
				"duels_replay",
				"skywars_speed_run",
				"duels_lobby_slayer",
				"bedwars_diamond_hoarder",
				"bedwars_iron_punch",
				"skywars_speed_runner",
				"housing_become_resident",
				"duels_summoner",
				"duels_got_ya",
				"duels_community_oriented",
				"duels_last_stand",
				"duels_hat_trick",
				"skywars_well_deserved",
				"blitz_champion",
				"blitz_full_inventory",
				"blitz_max_blitz",
				"skywars_happy_meal",
				"duels_one_v_one_me",
				"skywars_now_im_enchanted",
				"skyblock_higher_enchants",
				"skyblock_combined_efforts",
				"skyblock_production_expanded",
				"skywars_siege",
				"housing_make_resident",
				"duels_on_fire",
				"duels_ninja",
				"skywars_max_perk",
				"skywars_kill_streak",
				"bedwars_golem",
				"skywars_fists_of_fury",
				"skywars_legendary",
				"general_vip",
				"general_vip_plus",
				"skywars_enderdragon",
				"christmas2017_holidays_ruined",
				"christmas2017_big_bag_o_gifts",
				"christmas2017_legendary",
				"blitz_find_head",
				"blitz_enchanted_armor",
				"buildbattle_braniac",
				"buildbattle_guessing_streak",
				"buildbattle_teamwork",
				"buildbattle_every_second_counts",
				"christmas2017_christmas_quest",
				"blitz_preference",
				"blitz_no_problem",
				"blitz_safety_first",
				"blitz_invincible",
				"tntgames_tnt_tag_tagger",
				"tntgames_bow_spleef_first_double_jump",
				"buildbattle_professional_builder",
				"blitz_not_skywars",
				"walls_robin_hood",
				"walls_revenge",
				"walls_no_team_deaths",
				"blitz_enchant_sword",
				"duels_well_rounded",
				"blitz_level_seven",
				"general_achievement_npc",
				"christmas2017_hunt_begins_2020",
				"christmas2017_merry_christmas",
				"buildbattle_superior_vote",
				"buildbattle_classic_man",
				"duels_not_hungary",
				"tntgames_tnt_tag_close",
				"tntgames_timer",
				"tntgames_tnt_tag_traveller",
				"tntgames_tnt_tag_differenttags",
				"tntgames_lucky",
				"tntgames_tnt_tag_blownup",
				"skywars_teamwork_makes_the_dream_work",
				"buildbattle_perfect_harmony",
				"arcade_world_economics",
				"blitz_afterburner",
				"murdermystery_win_murderer_fell_in_trap",
				"murdermystery_watson",
				"christmas2017_to_war",
				"christmas2017_todays_the_day",
				"skyblock_time_to_go_on_vacation",
				"skyblock_more_space",
				"skyblock_super_fuel",
				"skyblock_advanced_transportation",
				"murdermystery_kill_detective_fast",
				"murdermystery_uncalculated",
				"housing_recieve_cookie",
				"skyblock_accessories_galore",
				"skyblock_deep_storage",
				"uhc_crafting_revolution",
				"uhc_no_problem_here",
				"uhc_seafood",
				"uhc_adrenaline",
				"skyblock_mass_production",
				"bedwars_savvy_shopper",
				"blitz_coin_festival",
				"skywars_lucky_souls",
				"skywars_map_select",
				"murdermystery_special_two_in_a_row",
				"murdermystery_win_survivor_due_to_time",
				"skywars_going_ham",
				"skywars_lucky_charm",
				"halloween2017_spooky_chest",
				"easter_faster_than_wind",
				"easter_first_egg_2021",
				"easter_easter_egg",
				"easter_all_eggs_2021",
				"easter_bw_jump_boost",
				"easter_you_didnt_see_that_coming",
				"murdermystery_emp",
				"buildbattle_fast_typer",
				"buildbattle_mobster",
				"buildbattle_no_mistakes",
				"buildbattle_obvious",
				"buildbattle_intuition",
				"buildbattle_artist",
				"easter_happy_easter_2021",
				"blitz_find_blitz",
				"blitz_rampage",
				"blitz_win_before_deathmatch",
				"tntgames_tnt_run_purchase_potion",
				"tntgames_pvp_run_sabotage",
				"tntgames_no_you",
				"tntgames_flying_madman",
				"skywars_ashes_to_ashes",
				"blitz_close_call",
				"speeduhc_kit_unlock",
				"speeduhc_my_way",
				"speeduhc_brave_new_world",
				"speeduhc_domination",
				"speeduhc_tears_of_loneliness",
				"speeduhc_golden_apple",
				"uhc_shiny_rock",
				"arcade_woops_didnt_mean_to",
				"arcade_professional_mower",
				"skywars_criminal",
				"quake_good_guy_gamer",
				"walls_first_kit",
				"walls_first_perk",
				"blitz_craft_bread",
				"tntgames_tnt_tag_dm",
				"tntgames_tnt_tag_first_win",
				"tntgames_tnt_tag_aww",
				"blitz_unstoppable",
				"blitz_fish_kill",
				"blitz_no_looting",
				"blitz_apocalypse",
				"blitz_nickname",
				"buildbattle_that_wood_be_perfect",
				"tntgames_bye_bye",
				"blitz_finally",
				"general_creeperbook",
				"duels_master_builders",
				"skyblock_lost_soul",
				"skyblock_into_the_deep",
				"skyblock_promised_fulfilled",
				"skyblock_bigger_storage_is_seeded",
				"skyblock_resourceful",
				"duels_jack_of_all_trades",
				"skyblock_heart_of_the_end",
				"tntgames_spleef_repulsor",
				"copsandcrims_fancy_new_toys",
				"arcade_no_mercy",
				"arcade_zombies_feels_good",
				"general_fishing_hobbyist",
				"general_doing_my_part",
				"arcade_zombies_electrician",
				"buildbattle_fancy",
				"murdermystery_last_survivor",
				"murdermystery_top_zombie",
				"murdermystery_ride_monorail",
				"skywars_donator",
				"housing_join_random",
				"blitz_frame_of_mind",
				"buildbattle_stenographer",
				"housing_join_staff",
				"murdermystery_bow_kill_on_detective",
				"murdermystery_blessing_and_curse",
				"murdermystery_survive_storm_on_top",
				"skywars_challenge_master",
				"skywars_challenge_pro",
				"skywars_challenge_uhc",
				"skywars_challenge_archer",
				"skywars_challenge_no_block",
				"skywars_challenge_half_health",
				"skywars_challenge_no_chest",
				"skywars_challenge_ultimate_warrior",
				"skywars_challenge_rookie",
				"general_hot_potato",
			],
			stats: {
				Bedwars: {
					Experience: generateRandomNumber(10000, 1000000),
					first_join_7: true,
					winstreak: generateRandomNumber(10, 2000),
					bedwars_boxes: 265,
					games_played_bedwars_1: 8659,
					favorite_slots: "Melee,Tools,Tools,Ranged,Potions,Potions,Potions,Utility,Blocks",
					_items_purchased_bedwars: 220940,
					beds_broken_bedwars: generateRandomNumber(1000, 18000),
					coins: 821610,
					deaths_bedwars: 23267,
					entity_attack_deaths_bedwars: 11407,
					entity_attack_final_kills_bedwars: 15242,
					final_kills_bedwars: generateRandomNumber(2000, 18000),
					four_four__items_purchased_bedwars: 60947,
					four_four_beds_broken_bedwars: 2055,
					four_four_deaths_bedwars: 6702,
					four_four_entity_attack_deaths_bedwars: 3337,
					four_four_entity_attack_final_kills_bedwars: 4192,
					four_four_final_kills_bedwars: 7284,
					four_four_games_played_bedwars: 2755,
					four_four_gold_resources_collected_bedwars: 51502,
					four_four_iron_resources_collected_bedwars: 409284,
					four_four_items_purchased_bedwars: 63273,
					four_four_kills_bedwars: 5298,
					four_four_permanent_items_purchased_bedwars: 2326,
					four_four_resources_collected_bedwars: 467169,
					four_four_void_deaths_bedwars: 2992,
					four_four_void_final_kills_bedwars: 2571,
					four_four_void_kills_bedwars: 2952,
					four_four_wins_bedwars: 2587,
					games_played_bedwars: 8615,
					gold_resources_collected_bedwars: 220530,
					iron_resources_collected_bedwars: 1536206,
					items_purchased_bedwars: 231655,
					kills_bedwars: generateRandomNumber(1000, 18000),
					permanent_items_purchased_bedwars: 10715,
					resources_collected_bedwars: 1796982,
					void_deaths_bedwars: 10904,
					void_final_kills_bedwars: 9826,
					void_kills_bedwars: 12099,
					wins_bedwars: generateRandomNumber(1000, 18000),
					favourites_2: "wool,stone_sword,chainmail_boots,magic_milk,blast-proof_glass,speed_ii_potion_(45_seconds),tnt,oak_wood_planks,iron_sword,iron_boots,shears,arrow,invisibility_potion_(30_seconds),water_bucket,stick_(knockback_i),wooden_axe,wooden_pickaxe,ender_pearl,end_stone,jump_v_potion_(45_seconds),golden_apple",
					beds_lost_bedwars: generateRandomNumber(100, 1000),
					emerald_resources_collected_bedwars: 5699,
					entity_attack_final_deaths_bedwars: 257,
					entity_attack_kills_bedwars: 11034,
					final_deaths_bedwars: generateRandomNumber(100, 1000),
					four_four_beds_lost_bedwars: 233,
					four_four_emerald_resources_collected_bedwars: 1124,
					four_four_entity_attack_final_deaths_bedwars: 67,
					four_four_entity_attack_kills_bedwars: 1943,
					four_four_final_deaths_bedwars: 134,
					four_four_losses_bedwars: 98,
					losses_bedwars: generateRandomNumber(100, 1000),
					fall_kills_bedwars: 1126,
					four_four_fall_kills_bedwars: 349,
					diamond_resources_collected_bedwars: 34547,
					four_four_diamond_resources_collected_bedwars: 5259,
					four_three__items_purchased_bedwars: 51327,
					four_three_beds_broken_bedwars: 2443,
					four_three_deaths_bedwars: 6497,
					four_three_diamond_resources_collected_bedwars: 4246,
					four_three_entity_attack_deaths_bedwars: 3548,
					four_three_games_played_bedwars: 2723,
					four_three_gold_resources_collected_bedwars: 49654,
					four_three_iron_resources_collected_bedwars: 287307,
					four_three_items_purchased_bedwars: 53316,
					four_three_kills_bedwars: 5741,
					four_three_permanent_items_purchased_bedwars: 1989,
					four_three_resources_collected_bedwars: 342327,
					four_three_void_deaths_bedwars: 2685,
					four_three_void_kills_bedwars: 3044,
					four_three_wins_bedwars: 2644,
					eight_two__items_purchased_bedwars: 105987,
					eight_two_beds_broken_bedwars: 6497,
					eight_two_deaths_bedwars: 9865,
					eight_two_diamond_resources_collected_bedwars: 24422,
					eight_two_entity_attack_deaths_bedwars: 4457,
					eight_two_entity_attack_final_kills_bedwars: 7311,
					eight_two_final_kills_bedwars: 12636,
					eight_two_games_played_bedwars: 3060,
					eight_two_gold_resources_collected_bedwars: 116216,
					eight_two_iron_resources_collected_bedwars: 821867,
					eight_two_items_purchased_bedwars: 112249,
					eight_two_kills_bedwars: 13196,
					eight_two_permanent_items_purchased_bedwars: 6262,
					eight_two_resources_collected_bedwars: 965816,
					eight_two_void_deaths_bedwars: 5093,
					eight_two_void_final_kills_bedwars: 4593,
					eight_two_void_kills_bedwars: 6025,
					eight_two_wins_bedwars: 2894,
					eight_two_entity_attack_kills_bedwars: 6596,
					eight_two_magic_final_kills_bedwars: 429,
					magic_final_kills_bedwars: 974,
					eight_two_beds_lost_bedwars: 459,
					eight_two_emerald_resources_collected_bedwars: 3311,
					eight_two_fall_kills_bedwars: 502,
					four_four_magic_kills_bedwars: 29,
					magic_kills_bedwars: 107,
					four_four_magic_final_kills_bedwars: 267,
					entity_explosion_kills_bedwars: 48,
					four_four_entity_explosion_kills_bedwars: 20,
					fall_deaths_bedwars: 590,
					four_four_fall_deaths_bedwars: 222,
					eight_two_voidless__items_purchased_bedwars: 121,
					eight_two_voidless_beds_lost_bedwars: 3,
					eight_two_voidless_deaths_bedwars: 15,
					eight_two_voidless_diamond_resources_collected_bedwars: 29,
					eight_two_voidless_emerald_resources_collected_bedwars: 5,
					eight_two_voidless_entity_attack_deaths_bedwars: 11,
					eight_two_voidless_entity_attack_final_deaths_bedwars: 2,
					eight_two_voidless_entity_attack_final_kills_bedwars: 6,
					eight_two_voidless_entity_attack_kills_bedwars: 9,
					eight_two_voidless_fall_deaths_bedwars: 4,
					eight_two_voidless_fall_final_kills_bedwars: 1,
					eight_two_voidless_fall_kills_bedwars: 6,
					eight_two_voidless_final_deaths_bedwars: 3,
					eight_two_voidless_final_kills_bedwars: 7,
					eight_two_voidless_games_played_bedwars: 3,
					eight_two_voidless_gold_resources_collected_bedwars: 159,
					eight_two_voidless_iron_resources_collected_bedwars: 543,
					eight_two_voidless_items_purchased_bedwars: 127,
					eight_two_voidless_kills_bedwars: 15,
					eight_two_voidless_losses_bedwars: 3,
					eight_two_voidless_permanent_items_purchased_bedwars: 6,
					eight_two_voidless_resources_collected_bedwars: 736,
					four_three_entity_attack_final_kills_bedwars: 3611,
					four_three_entity_attack_kills_bedwars: 2384,
					four_three_final_kills_bedwars: 6678,
					four_three_magic_final_kills_bedwars: 271,
					four_three_void_final_kills_bedwars: 2604,
					four_three_magic_deaths_bedwars: 50,
					magic_deaths_bedwars: 264,
					four_three_beds_lost_bedwars: 187,
					four_three_fall_kills_bedwars: 267,
					fall_final_kills_bedwars: 685,
					four_three_fall_final_kills_bedwars: 185,
					four_four_fall_final_kills_bedwars: 236,
					four_three_entity_attack_final_deaths_bedwars: 64,
					four_three_final_deaths_bedwars: 99,
					four_three_losses_bedwars: 71,
					four_three_emerald_resources_collected_bedwars: 1120,
					eight_two_fall_final_kills_bedwars: 262,
					eight_two_final_deaths_bedwars: 199,
					eight_two_losses_bedwars: 163,
					eight_two_void_final_deaths_bedwars: 65,
					void_final_deaths_bedwars: 150,
					eight_two_entity_attack_final_deaths_bedwars: 118,
					four_four_void_final_deaths_bedwars: 53,
					packages: [
						"killmessages_love",
						"killmessages_wrapped_up",
						"killmessages_celebratory",
						"beddestroy_blizzard",
						"killmessages_santa_workshop",
						"killmessages_snow_storm",
						"killmessages_glorious",
						"glyph_no",
						"glyph_squeak",
						"projectiletrail_notes",
						"killeffect_firework",
						"islandtopper_tnt",
						"killmessages_oink",
						"projectiletrail_black_smoke",
						"islandtopper_note",
						"glyph_blossom",
						"glyph_cry_face",
						"npcskin_zhao",
						"npcskin_bao",
						"glyph_thumbs_down",
						"killmessages_to_the_moon",
						"favoritemap_inca",
						"leaderboards_resync_mar_2021",
						"deathcry_enderman",
						"glyph_lantern",
						"projectiletrail_pumpkin_pie",
						"glyph_star",
						"sprays_dogs_of_wisdom",
						"sprays_found_u",
						"projectiletrail_slime",
						"deathcry_fireball",
						"islandtopper_pot",
						"glyph_bronze_shield",
						"npcskin_bed_salesman",
						"deathcry_grumpy_villager",
						"beddestroy_ghosts",
						"islandtopper_gargoyle",
						"sprays_disco_pumpkin",
						"deathcry_deflated_toy",
						"npcskin_xiu",
						"sprays_enderman",
						"projectiletrail_hearts",
						"killeffect_lighting_strike",
						"beddestroy_lighting_strike",
						"sprays_i_love_you",
						"killmessages_woof_woof",
						"beddestroy_eggsplosion",
						"killmessages_eggy",
						"killmessages_buzz",
						"killeffect_final_smash",
						"killeffect_lit",
						"killeffect_tornado",
						"killeffect_beef_everywhere",
						"favoritemap_crogorm",
						"favoritemap_carapace",
						"favoritemap_eastwood",
						"favoritemap_meso",
						"npcskin_purple_pig_pajamas",
						"projectiletrail_water",
						"killeffect_egg_theft",
						"npcskin_bunny_in_suit",
						"sprays_dragon",
						"killmessages_fire",
						"islandtopper_lantern",
						"killeffect_rain_on_my_parade",
						"islandtopper_bunny",
						"sprays_invisibility_potion",
						"islandtopper_sheep",
						"npcskin_magic_vendor",
						"deathcry_splash",
						"glyph_skull",
						"islandtopper_heart",
						"islandtopper_pig",
						"islandtopper_cherry_blossom",
						"beddestroy_squid_missile",
						"deathcry_doused_lantern",
						"islandtopper_flame",
						"npcskin_egg_delivery",
						"glyph_hi",
						"sprays_fireworks",
						"victorydance_anvil_rain",
						"npcskin_creeper",
						"npcskin_holiday_bartender",
						"islandtopper_frankenstein",
						"glyph_big_smile",
						"npcskin_lucky_cat",
						"sprays_easter_basket",
						"sprays_bunny_gg",
						"deathcry_dinosaur",
						"islandtopper_rabbit_ears",
						"sprays_golden_egg",
						"sprays_hypixel_logo_default",
						"killeffect_tnt",
						"npcskin_blue_rabbit",
						"projectiletrail_lava",
						"glyph_bloom",
						"killmessages_western",
						"killeffect_rainbow",
						"glyph_chick",
						"glyph_winky_face",
						"sprays_year_of_the_dog",
						"glyph_easter_flower",
						"glyph_mouse",
						"sprays_bed_shield",
						"npcskin_chen",
						"beddestroy_tornado",
						"sprays_watcher",
						"islandtopper_fountain_firework",
						"islandtopper_carrot",
						"projectiletrail_potion",
						"glyph_gg",
						"sprays_thanks",
						"npcskin_pink_bunny_pajamas",
						"sprays_faboolous",
						"glyph_party",
						"glyph_chocolate_egg",
						"glyph_sparkle",
						"projectiletrail_firework",
						"deathcry_squeal",
						"glyph_thumbs_up",
						"islandtopper_sword",
						"beddestroy_firework",
						"killeffect_fire_breath",
						"glyph_orange",
						"npcskin_blue_sheep_pajamas",
						"npcskin_villager_zombie",
						"killmessages_oxed",
						"npcskin_green_cow_pajamas",
						"victorydance_puppy_party",
						"islandtopper_easter_bell",
						"deathcry_pig",
						"deathcry_dragon_roar",
						"sprays_egg_hunt",
						"victorydance_yeehaw",
						"sprays_easter_eggs",
						"sprays_lantern",
						"killeffect_campfire",
						"killeffect_cookie_fountain",
						"deathcry_monster_burp",
						"killmessages_pirate",
						"islandtopper_smiley_face",
						"projectiletrail_white_smoke",
						"npcskin_wither_skeleton",
						"projectiletrail_green_star",
						"glyph_yes",
						"islandtopper_tree",
						"islandtopper_bomb",
						"glyph_emerald",
						"npcskin_witch",
						"islandtopper_mark_of_the_paw",
						"npcskin_li",
						"islandtopper_brick_house",
						"npcskin_aqua_duck_pajamas",
						"glyph_pig",
						"deathcry_sniff",
						"favoritemap_crypt",
						"favoritemap_paradox",
						"favoritemap_catalyst",
						"favoritemap_sky festival",
						"favoritemap_invasion",
						"favoritemap_sandcastle",
						"favoritemap_planet 98",
						"favoritemap_katsu",
						"favoritemap_unturned",
						"favoritemap_fang outpost",
						"favoritemap_lighthouse",
						"favoritemap_sky rise",
						"favoritemap_gateway",
						"favoritemap_glacier",
						"favoritemap_toro",
						"favoritemap_speedway",
						"favoritemap_yue",
					],
					activeKillMessages: "killmessages_love",
					entity_explosion_deaths_bedwars: 76,
					four_four_entity_explosion_deaths_bedwars: 31,
					four_three_void_final_deaths_bedwars: 26,
					eight_one__items_purchased_bedwars: 2619,
					eight_one_beds_broken_bedwars: 207,
					eight_one_deaths_bedwars: 198,
					eight_one_diamond_resources_collected_bedwars: 620,
					eight_one_entity_attack_final_kills_bedwars: 125,
					eight_one_final_kills_bedwars: 191,
					eight_one_games_played_bedwars: 72,
					eight_one_gold_resources_collected_bedwars: 3122,
					eight_one_iron_resources_collected_bedwars: 17350,
					eight_one_items_purchased_bedwars: 2757,
					eight_one_resources_collected_bedwars: 21236,
					eight_one_void_deaths_bedwars: 131,
					eight_one_void_final_kills_bedwars: 57,
					eight_one_wins_bedwars: 54,
					eight_one_entity_attack_deaths_bedwars: 64,
					eight_one_entity_attack_kills_bedwars: 109,
					eight_one_kills_bedwars: 199,
					eight_one_permanent_items_purchased_bedwars: 138,
					eight_one_beds_lost_bedwars: 31,
					eight_one_entity_attack_final_deaths_bedwars: 8,
					eight_one_final_deaths_bedwars: 17,
					eight_one_losses_bedwars: 18,
					eight_one_void_kills_bedwars: 76,
					eight_two_fall_deaths_bedwars: 178,
					eight_two_magic_deaths_bedwars: 97,
					four_three_fall_deaths_bedwars: 189,
					four_four_magic_deaths_bedwars: 116,
					four_three_magic_kills_bedwars: 23,
					eight_one_magic_final_kills_bedwars: 7,
					fall_final_deaths_bedwars: 20,
					four_four_fall_final_deaths_bedwars: 7,
					four_three_projectile_deaths_bedwars: 5,
					projectile_deaths_bedwars: 9,
					eight_two_entity_explosion_kills_bedwars: 9,
					eight_two_fall_final_deaths_bedwars: 6,
					four_three_fall_final_deaths_bedwars: 7,
					four_four_magic_final_deaths_bedwars: 4,
					magic_final_deaths_bedwars: 14,
					four_four_lucky__items_purchased_bedwars: 703,
					four_four_lucky_beds_broken_bedwars: 22,
					four_four_lucky_deaths_bedwars: 80,
					four_four_lucky_entity_attack_deaths_bedwars: 34,
					four_four_lucky_entity_attack_kills_bedwars: 21,
					four_four_lucky_games_played_bedwars: 23,
					four_four_lucky_gold_resources_collected_bedwars: 731,
					four_four_lucky_iron_resources_collected_bedwars: 5549,
					four_four_lucky_items_purchased_bedwars: 739,
					four_four_lucky_kills_bedwars: 57,
					four_four_lucky_magic_deaths_bedwars: 3,
					four_four_lucky_permanent_items_purchased_bedwars: 36,
					four_four_lucky_projectile_deaths_bedwars: 1,
					four_four_lucky_resources_collected_bedwars: 6323,
					four_four_lucky_void_deaths_bedwars: 38,
					four_four_lucky_wins_bedwars: 19,
					four_four_lucky_entity_attack_final_kills_bedwars: 33,
					four_four_lucky_final_kills_bedwars: 57,
					four_four_lucky_void_kills_bedwars: 28,
					four_four_lucky_emerald_resources_collected_bedwars: 24,
					four_four_lucky_void_final_kills_bedwars: 20,
					four_four_lucky_beds_lost_bedwars: 6,
					four_four_lucky_final_deaths_bedwars: 4,
					four_four_lucky_losses_bedwars: 4,
					four_four_lucky_void_final_deaths_bedwars: 2,
					four_four_lucky_entity_attack_final_deaths_bedwars: 2,
					four_four_lucky_entity_explosion_deaths_bedwars: 2,
					four_four_lucky_magic_final_kills_bedwars: 3,
					four_four_lucky_diamond_resources_collected_bedwars: 19,
					four_four_lucky_fall_deaths_bedwars: 1,
					four_four_lucky_fall_kills_bedwars: 6,
					four_four_lucky_fire_tick_deaths_bedwars: 1,
					eight_two_lucky__items_purchased_bedwars: 32,
					eight_two_lucky_beds_broken_bedwars: 2,
					eight_two_lucky_beds_lost_bedwars: 1,
					eight_two_lucky_deaths_bedwars: 9,
					eight_two_lucky_diamond_resources_collected_bedwars: 9,
					eight_two_lucky_emerald_resources_collected_bedwars: 4,
					eight_two_lucky_entity_attack_deaths_bedwars: 4,
					eight_two_lucky_entity_attack_final_deaths_bedwars: 1,
					eight_two_lucky_entity_attack_final_kills_bedwars: 1,
					eight_two_lucky_entity_attack_kills_bedwars: 1,
					eight_two_lucky_final_deaths_bedwars: 1,
					eight_two_lucky_final_kills_bedwars: 1,
					eight_two_lucky_fire_tick_deaths_bedwars: 1,
					eight_two_lucky_games_played_bedwars: 1,
					eight_two_lucky_gold_resources_collected_bedwars: 29,
					eight_two_lucky_iron_resources_collected_bedwars: 135,
					eight_two_lucky_items_purchased_bedwars: 32,
					eight_two_lucky_kills_bedwars: 3,
					eight_two_lucky_losses_bedwars: 1,
					eight_two_lucky_resources_collected_bedwars: 177,
					eight_two_lucky_void_deaths_bedwars: 4,
					eight_two_lucky_void_kills_bedwars: 2,
					fire_tick_deaths_bedwars: 16,
					four_four_fire_tick_deaths_bedwars: 2,
					eight_two_magic_kills_bedwars: 49,
					eight_two_entity_explosion_final_deaths_bedwars: 2,
					entity_explosion_final_deaths_bedwars: 3,
					bedwars_halloween_boxes: 20,
					eight_two_projectile_kills_bedwars: 9,
					projectile_kills_bedwars: 16,
					eight_one_magic_final_deaths_bedwars: 3,
					eight_one_magic_deaths_bedwars: 1,
					four_four_projectile_kills_bedwars: 4,
					two_four_games_played_bedwars: 5,
					two_four_gold_resources_collected_bedwars: 36,
					two_four_iron_resources_collected_bedwars: 398,
					two_four_resources_collected_bedwars: 434,
					two_four__items_purchased_bedwars: 60,
					two_four_entity_attack_final_kills_bedwars: 3,
					two_four_final_kills_bedwars: 4,
					two_four_items_purchased_bedwars: 60,
					two_four_wins_bedwars: 4,
					two_four_beds_broken_bedwars: 1,
					two_four_deaths_bedwars: 5,
					two_four_entity_attack_deaths_bedwars: 1,
					two_four_entity_attack_kills_bedwars: 2,
					two_four_kills_bedwars: 4,
					two_four_void_deaths_bedwars: 3,
					two_four_void_final_kills_bedwars: 1,
					eight_one_emerald_resources_collected_bedwars: 144,
					eight_two_entity_explosion_deaths_bedwars: 25,
					fire_tick_final_deaths_bedwars: 2,
					four_four_fire_tick_final_deaths_bedwars: 1,
					four_three_entity_explosion_deaths_bedwars: 18,
					four_four_projectile_final_deaths_bedwars: 1,
					projectile_final_deaths_bedwars: 2,
					eight_two_magic_final_deaths_bedwars: 5,
					eight_one_magic_kills_bedwars: 6,
					eight_one_void_final_deaths_bedwars: 6,
					eight_one_fall_kills_bedwars: 8,
					four_three_projectile_kills_bedwars: 3,
					four_four_lucky_entity_explosion_kills_bedwars: 2,
					four_four_lucky_fall_final_kills_bedwars: 1,
					eight_two_projectile_deaths_bedwars: 2,
					entity_explosion_final_kills_bedwars: 32,
					four_four_entity_explosion_final_kills_bedwars: 9,
					eight_two_fire_deaths_bedwars: 1,
					fire_deaths_bedwars: 1,
					four_three_entity_explosion_kills_bedwars: 19,
					four_three_fire_tick_deaths_bedwars: 2,
					bedwars_christmas_boxes: 59,
					four_four_projectile_deaths_bedwars: 2,
					eight_one_entity_explosion_deaths_bedwars: 2,
					four_three_entity_explosion_final_kills_bedwars: 4,
					castle__items_purchased_bedwars: 205,
					castle_beds_lost_bedwars: 3,
					castle_deaths_bedwars: 11,
					castle_games_played_bedwars: 7,
					castle_gold_resources_collected_bedwars: 187,
					castle_iron_resources_collected_bedwars: 1264,
					castle_items_purchased_bedwars: 214,
					castle_resources_collected_bedwars: 1495,
					castle_void_deaths_bedwars: 4,
					castle_wins_bedwars: 5,
					eight_two_entity_explosion_final_kills_bedwars: 19,
					four_three_magic_final_deaths_bedwars: 2,
					eight_two_projectile_final_kills_bedwars: 6,
					projectile_final_kills_bedwars: 9,
					eight_two_voidless_beds_broken_bedwars: 5,
					eight_two_voidless_fall_final_deaths_bedwars: 1,
					four_four_voidless__items_purchased_bedwars: 231,
					four_four_voidless_beds_broken_bedwars: 6,
					four_four_voidless_beds_lost_bedwars: 4,
					four_four_voidless_diamond_resources_collected_bedwars: 15,
					four_four_voidless_emerald_resources_collected_bedwars: 9,
					four_four_voidless_entity_attack_final_deaths_bedwars: 3,
					four_four_voidless_entity_attack_final_kills_bedwars: 20,
					four_four_voidless_entity_attack_kills_bedwars: 33,
					four_four_voidless_fall_final_kills_bedwars: 4,
					four_four_voidless_fall_kills_bedwars: 3,
					four_four_voidless_final_deaths_bedwars: 3,
					four_four_voidless_final_kills_bedwars: 24,
					four_four_voidless_games_played_bedwars: 10,
					four_four_voidless_gold_resources_collected_bedwars: 184,
					four_four_voidless_iron_resources_collected_bedwars: 1413,
					four_four_voidless_items_purchased_bedwars: 248,
					four_four_voidless_kills_bedwars: 36,
					four_four_voidless_losses_bedwars: 2,
					four_four_voidless_permanent_items_purchased_bedwars: 17,
					four_four_voidless_resources_collected_bedwars: 1621,
					four_four_voidless_deaths_bedwars: 15,
					four_four_voidless_entity_attack_deaths_bedwars: 15,
					four_four_voidless_wins_bedwars: 8,
					free_event_key_bedwars_christmas_boxes_2020: true,
					activeBedDestroy: "beddestroy_lighting_strike",
					Bedwars_openedChests: 194,
					Bedwars_openedCommons: 108,
					chest_history_new: ["beddestroy_lighting_strike", "deathcry_sniff", "glyph_pig", "islandtopper_heart", "sprays_year_of_the_dog"],
					Bedwars_openedRares: 57,
					Bedwars_openedLegendaries: 6,
					Bedwars_openedEpics: 24,
					eight_one_fall_final_kills_bedwars: 2,
					eight_two_fire_tick_deaths_bedwars: 12,
					eight_two_fire_final_kills_bedwars: 1,
					fire_final_kills_bedwars: 3,
					eight_two_fire_tick_final_kills_bedwars: 14,
					fire_tick_final_kills_bedwars: 21,
					four_four_fire_tick_final_kills_bedwars: 7,
					four_three_fire_final_kills_bedwars: 2,
					eight_two_fire_kills_bedwars: 1,
					fire_kills_bedwars: 1,
					eight_two_projectile_final_deaths_bedwars: 1,
					four_four_entity_explosion_final_deaths_bedwars: 1,
					activeProjectileTrail: "projectiletrail_none",
					activeKillEffect: "killeffect_lighting_strike",
					activeIslandTopper: "islandtopper_none",
					activeSprays: "sprays_i_love_you",
					four_four_projectile_final_kills_bedwars: 2,
					bedwars_easter_boxes: 0,
					fire_tick_kills_bedwars: 7,
					four_four_fire_tick_kills_bedwars: 1,
					four_three_projectile_final_kills_bedwars: 1,
					shop_sort: "rarity_descending",
					two_four_fall_deaths_bedwars: 1,
					two_four_void_kills_bedwars: 2,
					eight_two_fire_tick_kills_bedwars: 5,
					understands_resource_bank: true,
					castle_diamond_resources_collected_bedwars: 38,
					castle_emerald_resources_collected_bedwars: 6,
					castle_entity_attack_deaths_bedwars: 4,
					castle_entity_attack_final_kills_bedwars: 4,
					castle_entity_attack_kills_bedwars: 2,
					castle_final_kills_bedwars: 9,
					castle_kills_bedwars: 4,
					castle_magic_final_kills_bedwars: 1,
					castle_permanent_items_purchased_bedwars: 9,
					castle_void_kills_bedwars: 2,
					castle_fall_deaths_bedwars: 1,
					castle_magic_deaths_bedwars: 2,
					castle_fall_final_kills_bedwars: 3,
					castle_void_final_kills_bedwars: 1,
					eight_two_fire_tick_final_deaths_bedwars: 1,
					selected_challenge_type: "COLLECTOR",
					eight_two_suffocation_final_kills_bedwars: 1,
					suffocation_final_kills_bedwars: 1,
					total_challenges_completed: 3,
					bw_challenge_no_team_upgrades: 3,
					bw_unique_challenges_completed: 1,
					four_three_fire_tick_kills_bedwars: 1,
					activeWoodType: "woodSkin_dark_oak",
				},
			},
			friendRequestsUuid: [],
			achievementPoints: 4570,
			achievements: {
				bedwars_level: generateRandomNumber(10, 3100),
				buildbattle_build_battle_voter: 353,
				buildbattle_build_battle_points: 307,
				general_challenger: 2380,
				buildbattle_build_battle_score: 2450,
				summer_shopaholic: 611818,
				bedwars_beds: 11204,
				bedwars_bedwars_killer: 53404,
				bedwars_wins: 8184,
				general_quest_master: 750,
				skyblock_treasury: 50,
				skyblock_minion_lover: 110,
				skyblock_gatherer: 16,
				skywars_kills_team: 2969,
				skywars_you_re_a_star: 11,
				general_wins: 2007,
				skywars_wins_team: 275,
				arcade_arcade_banker: 35549,
				general_coins: 174196,
				duels_duels_traveller: 33,
				duels_duels_win_streak: 96,
				duels_duels_winner: 1382,
				bedwars_collectors_edition: 6721,
				skywars_heads: 288,
				blitz_coins: 115366,
				blitz_fighting_expert: 425,
				blitz_kills: 620,
				blitz_kit_expert: 546,
				blitz_kit_experience_collector: 2938,
				murdermystery_hoarder: 612,
				murdermystery_wins_as_survivor: 54,
				skywars_kits_team: 15,
				skywars_kills_solo: 1782,
				duels_goals: 28,
				duels_bridge_doubles_wins: 15,
				duels_bridge_win_streak: 8,
				duels_bridge_wins: 15,
				duels_unique_map_wins: 11,
				duels_duels_division: 3,
				skywars_wins_solo: 185,
				halloween2017_pumpkinator: 2510,
				blitz_looter: 863,
				skywars_kits_solo: 19,
				skywars_opal_obsession: 3,
				skywars_kills_mega: 19,
				skywars_wins_mega: 1,
				skywars_kits_mega: 1,
				blitz_mob_master: 60,
				blitz_rng_master: 5,
				blitz_wins_teams: 27,
				blitz_master_of_kits: 41,
				blitz_ranged_combat: 9,
				skyblock_harvester: 12,
				skyblock_combat: 13,
				skyblock_excavator: 27,
				skyblock_augmentation: 10,
				skyblock_angler: 14,
				skyblock_concoctor: 13,
				christmas2017_advent_2020: 25,
				christmas2017_present_collector: 3126,
				blitz_kit_collector: 1,
				buildbattle_guess_the_build_guesses: 122,
				buildbattle_guess_the_build_winner: 20,
				tntgames_tnt_banker: 14347,
				tntgames_tnt_triathlon: 257,
				tntgames_block_runner: 4443,
				christmas2017_santa_says_rounds: 8,
				walls_coins: 2650,
				walls_wins: 3,
				arena_climb_the_ranks: 2000,
				gingerbread_banker: 2179497,
				walls_kills: 6,
				pit_gold: 1397,
				pit_kills: 31,
				arcade_arcade_winner: 11,
				christmas2017_no_christmas: 22,
				arcade_ctw_slayer: 6,
				murdermystery_kills_as_murderer: 126,
				murdermystery_wins_as_murderer: 7,
				uhc_bounty: 6194,
				uhc_ultimatum: 12,
				uhc_hunter: 3,
				uhc_consumer: 1,
				uhc_moving_up: 3,
				bedwars_loot_box: 65,
				speeduhc_hunter: 49,
				speeduhc_promotion: 89,
				skywars_cages: 7,
				easter_throw_eggs: 331,
				easter_egg_finder: 66,
				easter_master_tracker: 0,
				blitz_treasure_seeker: 3,
				blitz_wins: 19,
				tntgames_pvp_run_killer: 3,
				tntgames_clinic: 473,
				tntgames_tnt_wizards_kills: 5,
				tntgames_tnt_wizards_caps: 1,
				walls3_jack_of_all_trades: 6,
				speeduhc_collector: 1,
				speeduhc_uhc_master: 4,
				quake_coins: 90,
				quake_kills: 5,
				tntgames_tnt_tag_wins: 1,
				summer_gone_fishing: 18,
				duels_duels_mastery: 5,
				skyblock_hard_working_miner: 5,
				skyblock_domesticator: 17,
				murdermystery_countermeasures: 4,
				murdermystery_hitman: 30,
				murdermystery_survival_skills: 3,
				murdermystery_brainiac: 23,
				arcade_zombie_killer: 881,
				arcade_zombies_nice_shot: 732,
				arcade_zombies_round_progression: 19,
				general_master_lure: 166,
				general_trashiest_diver: 31,
				general_luckiest_of_the_sea: 18,
				arcade_zombies_high_round: 16,
				arcade_party_super_star: 12,
				arcade_hide_and_seek_hider_kills: 1,
				arcade_hide_and_seek_master_hider: 1,
				skywars_new_day_new_challenge: 7,
				bedwars_bedwars_challenger: 1,
			},
			quests: {
				bedwars_daily_win: {
					completions: [
						{
							time: 1598740251813,
						},
						{
							time: 1600649080158,
						},
						{
							time: 1602030583945,
						},
						{
							time: 1602500118214,
						},
						{
							time: 1602998207973,
						},
						{
							time: 1603342067878,
						},
						{
							time: 1604584152613,
						},
						{
							time: 1605390077689,
						},
						{
							time: 1605791432192,
						},
						{
							time: 1606663875578,
						},
						{
							time: 1606738982736,
						},
						{
							time: 1606955851543,
						},
						{
							time: 1607010667060,
						},
						{
							time: 1607114147749,
						},
						{
							time: 1607177156040,
						},
						{
							time: 1607185791138,
						},
						{
							time: 1607231619132,
						},
						{
							time: 1607377396925,
						},
						{
							time: 1607403962929,
						},
						{
							time: 1607526288717,
						},
						{
							time: 1607648971016,
						},
						{
							time: 1607685833661,
						},
						{
							time: 1607754080780,
						},
						{
							time: 1607760915606,
						},
						{
							time: 1607843680971,
						},
						{
							time: 1607936228295,
						},
						{
							time: 1608011791992,
						},
						{
							time: 1608106959567,
						},
						{
							time: 1608183137193,
						},
						{
							time: 1608267793839,
						},
						{
							time: 1608387056535,
						},
						{
							time: 1608456961970,
						},
						{
							time: 1608528570362,
						},
						{
							time: 1613828921406,
						},
						{
							time: 1626392083731,
						},
						{
							time: 1661349441038,
						},
						{
							time: 1661552030924,
						},
						{
							time: 1663020332023,
						},
						{
							time: 1663488601489,
						},
					],
				},
				bedwars_daily_one_more: {
					completions: [
						{
							time: 1598740791014,
						},
						{
							time: 1600649880929,
						},
						{
							time: 1602031262346,
						},
						{
							time: 1602500528531,
						},
						{
							time: 1602998795947,
						},
						{
							time: 1603342449103,
						},
						{
							time: 1604584787499,
						},
						{
							time: 1604751649860,
						},
						{
							time: 1605390378768,
						},
						{
							time: 1605791779114,
						},
						{
							time: 1606664545794,
						},
						{
							time: 1606739286847,
						},
						{
							time: 1606956480167,
						},
						{
							time: 1607011108487,
						},
						{
							time: 1607114659175,
						},
						{
							time: 1607177457143,
						},
						{
							time: 1607232078103,
						},
						{
							time: 1607377651733,
						},
						{
							time: 1607404207332,
						},
						{
							time: 1607526626635,
						},
						{
							time: 1607685833661,
						},
						{
							time: 1607756396764,
						},
						{
							time: 1607761274730,
						},
						{
							time: 1607892597058,
						},
						{
							time: 1607936454703,
						},
						{
							time: 1608011791992,
						},
						{
							time: 1608107168154,
						},
						{
							time: 1608183394550,
						},
						{
							time: 1608268362854,
						},
						{
							time: 1608387324460,
						},
						{
							time: 1608457540797,
						},
						{
							time: 1608528876806,
						},
						{
							time: 1608631516580,
						},
						{
							time: 1613829311898,
						},
						{
							time: 1615639355836,
						},
						{
							time: 1626392398960,
						},
						{
							time: 1661350187398,
						},
						{
							time: 1661552465905,
						},
						{
							time: 1663020568398,
						},
						{
							time: 1663489130619,
						},
					],
				},
				bedwars_weekly_bed_elims: {
					completions: [
						{
							time: 1600712816717,
						},
						{
							time: 1602151207608,
						},
						{
							time: 1603135699638,
						},
						{
							time: 1604746632474,
						},
						{
							time: 1605413633130,
						},
						{
							time: 1606741038696,
						},
						{
							time: 1607128072786,
						},
						{
							time: 1607699871069,
						},
						{
							time: 1607936362886,
						},
						{
							time: 1608391708302,
						},
						{
							time: 1663390487924,
						},
					],
				},
				bedwars_weekly_dream_win: {
					completions: [
						{
							time: 1601947892077,
						},
						{
							time: 1608024541016,
						},
					],
					active: {
						objectives: {
							bedwars_dream_wins: 6,
						},
						started: 1608267603524,
					},
				},
				duels_player: {
					completions: [
						{
							time: 1601000350804,
						},
						{
							time: 1604381313786,
						},
						{
							time: 1607284575623,
						},
						{
							time: 1607488367885,
						},
						{
							time: 1608097482315,
						},
						{
							time: 1608445278557,
						},
						{
							time: 1613740794771,
						},
						{
							time: 1617139479581,
						},
						{
							time: 1618189107705,
						},
						{
							time: 1619291687363,
						},
						{
							time: 1621055237184,
						},
						{
							time: 1621464008531,
						},
						{
							time: 1621874148986,
						},
						{
							time: 1625337070706,
						},
						{
							time: 1625436048550,
						},
						{
							time: 1625457964107,
						},
						{
							time: 1625807410875,
						},
						{
							time: 1626138872225,
						},
						{
							time: 1626236930362,
						},
						{
							time: 1626791133743,
						},
						{
							time: 1626896432452,
						},
						{
							time: 1627000942042,
						},
						{
							time: 1627042644088,
						},
						{
							time: 1627255168396,
						},
						{
							time: 1628044709385,
						},
						{
							time: 1628269166629,
						},
						{
							time: 1660333369677,
						},
						{
							time: 1660588451731,
						},
						{
							time: 1660836662606,
						},
						{
							time: 1661189844164,
						},
						{
							time: 1661488691221,
						},
						{
							time: 1661636978153,
						},
						{
							time: 1661734154639,
						},
						{
							time: 1663921303574,
						},
						{
							time: 1664362769029,
						},
					],
				},
				duels_killer: {
					completions: [
						{
							time: 1600941070759,
						},
						{
							time: 1604380852809,
						},
						{
							time: 1607284673681,
						},
						{
							time: 1607488367884,
						},
						{
							time: 1608097482313,
						},
						{
							time: 1608445549932,
						},
						{
							time: 1613741081013,
						},
						{
							time: 1617696056754,
						},
						{
							time: 1618189018339,
						},
						{
							time: 1619291524042,
						},
						{
							time: 1621055296440,
						},
						{
							time: 1621464047816,
						},
						{
							time: 1621874148989,
						},
						{
							time: 1625337070707,
						},
						{
							time: 1625436048550,
						},
						{
							time: 1625458008395,
						},
						{
							time: 1625807432604,
						},
						{
							time: 1626138978409,
						},
						{
							time: 1626236930363,
						},
						{
							time: 1626791133743,
						},
						{
							time: 1626896645693,
						},
						{
							time: 1627000942042,
						},
						{
							time: 1627042644088,
						},
						{
							time: 1627255211689,
						},
						{
							time: 1628044920407,
						},
						{
							time: 1628269451620,
						},
						{
							time: 1660333418915,
						},
						{
							time: 1660588473184,
						},
						{
							time: 1660836662606,
						},
						{
							time: 1661189844165,
						},
						{
							time: 1661488691221,
						},
						{
							time: 1661637005407,
						},
						{
							time: 1661734154639,
						},
						{
							time: 1663921303574,
						},
						{
							time: 1664362769029,
						},
					],
				},
				duels_winner: {
					completions: [
						{
							time: 1600940560868,
						},
						{
							time: 1603241222403,
						},
						{
							time: 1604380194271,
						},
						{
							time: 1606503963435,
						},
						{
							time: 1607118758518,
						},
						{
							time: 1607152048252,
						},
						{
							time: 1607284575623,
						},
						{
							time: 1607451911461,
						},
						{
							time: 1608020975578,
						},
						{
							time: 1608097256390,
						},
						{
							time: 1608188600843,
						},
						{
							time: 1608445152012,
						},
						{
							time: 1613740717279,
						},
						{
							time: 1617139236184,
						},
						{
							time: 1618188777409,
						},
						{
							time: 1618295437580,
						},
						{
							time: 1619291445593,
						},
						{
							time: 1621054995730,
						},
						{
							time: 1621463860012,
						},
						{
							time: 1621873988226,
						},
						{
							time: 1625336963436,
						},
						{
							time: 1625435915407,
						},
						{
							time: 1625457846710,
						},
						{
							time: 1625807361642,
						},
						{
							time: 1626138575470,
						},
						{
							time: 1626236806829,
						},
						{
							time: 1626790984261,
						},
						{
							time: 1626896171958,
						},
						{
							time: 1627000786940,
						},
						{
							time: 1627042403161,
						},
						{
							time: 1627255065514,
						},
						{
							time: 1627749147520,
						},
						{
							time: 1628044709378,
						},
						{
							time: 1628269033941,
						},
						{
							time: 1660227873996,
						},
						{
							time: 1660333302970,
						},
						{
							time: 1660588282069,
						},
						{
							time: 1660836550161,
						},
						{
							time: 1661116241259,
						},
						{
							time: 1661189748700,
						},
						{
							time: 1661488588557,
						},
						{
							time: 1661636874879,
						},
						{
							time: 1661734022159,
						},
						{
							time: 1663921203546,
						},
						{
							time: 1664362633500,
						},
					],
				},
				duels_weekly_wins: {
					completions: [
						{
							time: 1601116285609,
						},
						{
							time: 1607488894308,
						},
						{
							time: 1614487115296,
						},
						{
							time: 1621054709785,
						},
						{
							time: 1625338166893,
						},
						{
							time: 1626831716384,
						},
						{
							time: 1628269511729,
						},
						{
							time: 1660837076336,
						},
						{
							time: 1661516887816,
						},
					],
					active: {
						objectives: {
							win: 15,
						},
						started: 1663921174787,
					},
				},
				duels_weekly_kills: {
					completions: [
						{
							time: 1601453127217,
						},
						{
							time: 1604382209731,
						},
						{
							time: 1617696101200,
						},
						{
							time: 1625340122142,
						},
						{
							time: 1628045100079,
						},
						{
							time: 1661489400573,
						},
					],
					active: {
						objectives: {
							kill: 15,
						},
						started: 1663921173337,
					},
				},
				uhc_team: {
					completions: [
						{
							time: 1612110000130,
						},
					],
					active: {
						objectives: {},
						started: 1616540776209,
					},
				},
				uhc_solo: {
					active: {
						objectives: {},
						started: 1600855499480,
					},
				},
				uhc_dm: {
					active: {
						objectives: {},
						started: 1600855499830,
					},
				},
				uhc_weekly: {
					active: {
						objectives: {
							uhc_kills: 3,
						},
						started: 1600855500230,
					},
				},
				solo_brawler: {
					active: {
						objectives: {},
						started: 1600855500630,
					},
				},
				team_brawler: {
					completions: [
						{
							time: 1620690715607,
						},
					],
					active: {
						objectives: {},
						started: 1621038928988,
					},
				},
				blitz_game_of_the_day: {
					completions: [
						{
							time: 1605108032252,
						},
						{
							time: 1606963438535,
						},
						{
							time: 1607115434265,
						},
						{
							time: 1607148929185,
						},
						{
							time: 1607287102384,
						},
						{
							time: 1607560009074,
						},
						{
							time: 1607693414497,
						},
						{
							time: 1607926508468,
						},
						{
							time: 1608655634411,
						},
						{
							time: 1609195191394,
						},
						{
							time: 1614292313949,
						},
						{
							time: 1617054724070,
						},
						{
							time: 1617845882247,
						},
						{
							time: 1617922310786,
						},
						{
							time: 1619054559340,
						},
						{
							time: 1619644613327,
						},
						{
							time: 1620956006667,
						},
						{
							time: 1621464766195,
						},
						{
							time: 1622117395659,
						},
						{
							time: 1625342630874,
						},
						{
							time: 1625726955293,
						},
						{
							time: 1625979538030,
						},
						{
							time: 1626121242580,
						},
						{
							time: 1626295286413,
						},
						{
							time: 1626373604209,
						},
						{
							time: 1626544521799,
						},
						{
							time: 1660231766251,
						},
						{
							time: 1661127403160,
						},
						{
							time: 1661283279105,
						},
					],
					active: {
						objectives: {},
						started: 1661346878368,
					},
				},
				blitz_win: {
					completions: [
						{
							time: 1605108476821,
						},
						{
							time: 1607130367244,
						},
						{
							time: 1607149052341,
						},
						{
							time: 1607563303245,
						},
						{
							time: 1608659020868,
						},
						{
							time: 1609195592514,
						},
						{
							time: 1617054901157,
						},
						{
							time: 1617847063243,
						},
						{
							time: 1617922668326,
						},
						{
							time: 1619056172527,
						},
						{
							time: 1619644708685,
						},
						{
							time: 1622117177559,
						},
						{
							time: 1625727147242,
						},
						{
							time: 1625979720202,
						},
						{
							time: 1626136024785,
						},
						{
							time: 1626295281629,
						},
						{
							time: 1626372996910,
						},
						{
							time: 1626544516977,
						},
						{
							time: 1626790901550,
						},
						{
							time: 1628864929531,
						},
						{
							time: 1661127569257,
						},
					],
					active: {
						objectives: {},
						started: 1661198979072,
					},
				},
				blitz_loot_chest_daily: {
					completions: [
						{
							time: 1606962943381,
						},
						{
							time: 1607131862701,
						},
						{
							time: 1607149575618,
						},
						{
							time: 1607562897739,
						},
						{
							time: 1608655678134,
						},
						{
							time: 1617054875659,
						},
						{
							time: 1617847745835,
						},
						{
							time: 1617923814450,
						},
						{
							time: 1619056324370,
						},
						{
							time: 1619644493589,
						},
						{
							time: 1622116872222,
						},
						{
							time: 1625727217969,
						},
						{
							time: 1626136098430,
						},
						{
							time: 1626300819457,
						},
						{
							time: 1626373474384,
						},
						{
							time: 1626790885116,
						},
						{
							time: 1661127035801,
						},
					],
					active: {
						objectives: {
							lootchestblitz: 6,
						},
						started: 1661198979072,
					},
				},
				blitz_kills: {
					completions: [
						{
							time: 1605108377007,
						},
						{
							time: 1606965242989,
						},
						{
							time: 1607115851181,
						},
						{
							time: 1607148898015,
						},
						{
							time: 1607287537646,
						},
						{
							time: 1607561452264,
						},
						{
							time: 1607693322825,
						},
						{
							time: 1607926449157,
						},
						{
							time: 1608656354589,
						},
						{
							time: 1617054709436,
						},
						{
							time: 1617846330716,
						},
						{
							time: 1617922587600,
						},
						{
							time: 1619055135018,
						},
						{
							time: 1619643471983,
						},
						{
							time: 1621464711539,
						},
						{
							time: 1625342544958,
						},
						{
							time: 1625726874707,
						},
						{
							time: 1625979547029,
						},
						{
							time: 1626121153642,
						},
						{
							time: 1626295281492,
						},
						{
							time: 1626372996786,
						},
						{
							time: 1626544516977,
						},
						{
							time: 1626790901385,
						},
						{
							time: 1628865030922,
						},
						{
							time: 1661126861283,
						},
					],
					active: {
						objectives: {
							killblitz10: 4,
						},
						started: 1661198979072,
					},
				},
				blitz_weekly_master: {
					completions: [
						{
							time: 1607131598345,
						},
						{
							time: 1617054901157,
						},
						{
							time: 1619576831347,
						},
						{
							time: 1626136024785,
						},
					],
					active: {
						objectives: {
							killblitz10: 30,
							winblitz: 5,
							blitz_games_played: 9,
						},
						started: 1626433553760,
					},
				},
				blitz_loot_chest_weekly: {
					completions: [
						{
							time: 1607134144367,
						},
						{
							time: 1617141461024,
						},
						{
							time: 1619056324370,
						},
						{
							time: 1625341999298,
						},
						{
							time: 1626372963133,
						},
						{
							time: 1661129959053,
						},
					],
					active: {
						objectives: {
							lootchestblitz: 4,
							dealdamageblitz: 173,
						},
						started: 1661820694807,
					},
				},
				mm_daily_win: {
					completions: [
						{
							time: 1601112454214,
						},
						{
							time: 1607843825998,
						},
						{
							time: 1608182804497,
						},
						{
							time: 1608536728512,
						},
						{
							time: 1608737205003,
						},
						{
							time: 1614494933511,
						},
						{
							time: 1614911824532,
						},
						{
							time: 1616297467784,
						},
						{
							time: 1619572892679,
						},
						{
							time: 1620685879434,
						},
						{
							time: 1627001614442,
						},
						{
							time: 1660672566137,
						},
						{
							time: 1661082690526,
						},
						{
							time: 1661190002942,
						},
						{
							time: 1661702162267,
						},
						{
							time: 1661821324778,
						},
					],
					active: {
						objectives: {},
						started: 1663950414823,
					},
				},
				mm_daily_power_play: {
					completions: [
						{
							time: 1601112699970,
						},
						{
							time: 1610670314153,
						},
						{
							time: 1617405515129,
						},
						{
							time: 1661702368631,
						},
					],
					active: {
						objectives: {},
						started: 1661820705705,
					},
				},
				mm_daily_target_kill: {
					completions: [
						{
							time: 1601112192338,
						},
						{
							time: 1616297424032,
						},
					],
					active: {
						objectives: {},
						started: 1617405829470,
					},
				},
				mm_weekly_murderer_kills: {
					completions: [
						{
							time: 1614646062974,
						},
						{
							time: 1619573558606,
						},
						{
							time: 1661085700188,
						},
					],
					active: {
						objectives: {
							mm_weekly_kills_as_murderer: 30,
						},
						started: 1661702983108,
					},
				},
				bedwars_weekly_pumpkinator: {
					completions: [
						{
							time: 1602779343782,
						},
						{
							time: 1603580244255,
						},
						{
							time: 1604643174360,
						},
					],
				},
				bedwars_daily_nightmares: {
					completions: [
						{
							time: 1602501943058,
						},
						{
							time: 1602998795948,
						},
						{
							time: 1603343332679,
						},
						{
							time: 1604586317550,
						},
					],
				},
				skywars_solo_win: {
					completions: [
						{
							time: 1603043113843,
						},
						{
							time: 1605273386633,
						},
						{
							time: 1605800517043,
						},
						{
							time: 1606312413609,
						},
						{
							time: 1606509850044,
						},
						{
							time: 1606657776687,
						},
						{
							time: 1606937712841,
						},
						{
							time: 1607102383598,
						},
						{
							time: 1607483292150,
						},
						{
							time: 1607816236065,
						},
						{
							time: 1607891290778,
						},
						{
							time: 1607922286239,
						},
						{
							time: 1608081201913,
						},
						{
							time: 1608160986243,
						},
						{
							time: 1608196444673,
						},
						{
							time: 1608446445670,
						},
						{
							time: 1608995204296,
						},
						{
							time: 1614461330737,
						},
						{
							time: 1614537192938,
						},
						{
							time: 1614810204419,
						},
						{
							time: 1615429803939,
						},
						{
							time: 1615523029872,
						},
						{
							time: 1615593684364,
						},
						{
							time: 1615776955259,
						},
						{
							time: 1615881937334,
						},
						{
							time: 1615970611469,
						},
						{
							time: 1616179733202,
						},
						{
							time: 1616468554158,
						},
						{
							time: 1616872010683,
						},
						{
							time: 1617078319963,
						},
						{
							time: 1617221890499,
						},
						{
							time: 1617448679496,
						},
						{
							time: 1619645622764,
						},
						{
							time: 1620514027225,
						},
						{
							time: 1620857453930,
						},
						{
							time: 1622020542982,
						},
						{
							time: 1622382012572,
						},
						{
							time: 1625302402598,
						},
						{
							time: 1625894976299,
						},
						{
							time: 1627463309698,
						},
						{
							time: 1660345261749,
						},
						{
							time: 1660834948219,
						},
						{
							time: 1661115070635,
						},
						{
							time: 1661182007273,
						},
						{
							time: 1661490201619,
						},
						{
							time: 1661736126706,
						},
						{
							time: 1661772779937,
						},
						{
							time: 1662171013516,
						},
						{
							time: 1663746471642,
						},
						{
							time: 1663994551167,
						},
						{
							time: 1664447053300,
						},
					],
				},
				skywars_solo_kills: {
					completions: [
						{
							time: 1603044007493,
						},
						{
							time: 1605273784297,
						},
						{
							time: 1605800517043,
						},
						{
							time: 1606393031037,
						},
						{
							time: 1606568845590,
						},
						{
							time: 1606659915913,
						},
						{
							time: 1606937446792,
						},
						{
							time: 1607102383599,
						},
						{
							time: 1607483292153,
						},
						{
							time: 1607891290778,
						},
						{
							time: 1607922614806,
						},
						{
							time: 1608081577372,
						},
						{
							time: 1608170642510,
						},
						{
							time: 1608195945434,
						},
						{
							time: 1608449148911,
						},
						{
							time: 1609549369469,
						},
						{
							time: 1614461574472,
						},
						{
							time: 1614809763735,
						},
						{
							time: 1615257429595,
						},
						{
							time: 1615522578783,
						},
						{
							time: 1615593801429,
						},
						{
							time: 1615881937334,
						},
						{
							time: 1616179733202,
						},
						{
							time: 1616468948681,
						},
						{
							time: 1617078319963,
						},
						{
							time: 1617448679497,
						},
						{
							time: 1619645463439,
						},
						{
							time: 1620857558036,
						},
						{
							time: 1622382629743,
						},
						{
							time: 1625894682098,
						},
						{
							time: 1628212327693,
						},
						{
							time: 1660136100056,
						},
						{
							time: 1660345671522,
						},
						{
							time: 1660836005908,
						},
						{
							time: 1661115521110,
						},
						{
							time: 1661183082658,
						},
						{
							time: 1661490304239,
						},
						{
							time: 1661908992702,
						},
						{
							time: 1662171399684,
						},
						{
							time: 1664194064808,
						},
						{
							time: 1664444576407,
						},
					],
				},
				skywars_team_kills: {
					completions: [
						{
							time: 1605105750859,
						},
						{
							time: 1605687780671,
						},
						{
							time: 1606307625728,
						},
						{
							time: 1606510338456,
						},
						{
							time: 1606662676263,
						},
						{
							time: 1606976206923,
						},
						{
							time: 1607103963872,
						},
						{
							time: 1607232660515,
						},
						{
							time: 1607453885131,
						},
						{
							time: 1607691687466,
						},
						{
							time: 1607750079867,
						},
						{
							time: 1608013937345,
						},
						{
							time: 1608180706978,
						},
						{
							time: 1608252659541,
						},
						{
							time: 1608447628098,
						},
						{
							time: 1608652548421,
						},
						{
							time: 1614371252679,
						},
						{
							time: 1614536449707,
						},
						{
							time: 1614741184622,
						},
						{
							time: 1615012978218,
						},
						{
							time: 1615260629456,
						},
						{
							time: 1615715293379,
						},
						{
							time: 1615883490064,
						},
						{
							time: 1616186942655,
						},
						{
							time: 1616453770341,
						},
						{
							time: 1616538430157,
						},
						{
							time: 1616712372937,
						},
						{
							time: 1617054183556,
						},
						{
							time: 1617224592407,
						},
						{
							time: 1617496031014,
						},
						{
							time: 1618021326861,
						},
						{
							time: 1618919681950,
						},
						{
							time: 1619397927118,
						},
						{
							time: 1620597786069,
						},
						{
							time: 1620860620964,
						},
						{
							time: 1621570163383,
						},
						{
							time: 1622079279309,
						},
						{
							time: 1625438465451,
						},
						{
							time: 1626298056684,
						},
						{
							time: 1660137160462,
						},
					],
					active: {
						objectives: {
							skywars_team_kills: 5,
						},
						started: 1660344289836,
					},
				},
				skywars_team_win: {
					completions: [
						{
							time: 1605105131020,
						},
						{
							time: 1605687357356,
						},
						{
							time: 1606307625727,
						},
						{
							time: 1606509005418,
						},
						{
							time: 1606662143127,
						},
						{
							time: 1606975737104,
						},
						{
							time: 1607103689804,
						},
						{
							time: 1607233664677,
						},
						{
							time: 1607454112575,
						},
						{
							time: 1607691687458,
						},
						{
							time: 1607749819314,
						},
						{
							time: 1607899365108,
						},
						{
							time: 1608180124514,
						},
						{
							time: 1608253535719,
						},
						{
							time: 1608447016903,
						},
						{
							time: 1608652265815,
						},
						{
							time: 1614370769732,
						},
						{
							time: 1614535569471,
						},
						{
							time: 1614740970368,
						},
						{
							time: 1615012048802,
						},
						{
							time: 1615260081582,
						},
						{
							time: 1615536374184,
						},
						{
							time: 1615777593750,
						},
						{
							time: 1615882763505,
						},
						{
							time: 1616186606460,
						},
						{
							time: 1616284144528,
						},
						{
							time: 1616454839654,
						},
						{
							time: 1616525114294,
						},
						{
							time: 1616694042391,
						},
						{
							time: 1616887557009,
						},
						{
							time: 1617224592403,
						},
						{
							time: 1617496031014,
						},
						{
							time: 1617831300379,
						},
						{
							time: 1618643348644,
						},
						{
							time: 1618919592068,
						},
						{
							time: 1619397927118,
						},
						{
							time: 1619647113720,
						},
						{
							time: 1620683204571,
						},
						{
							time: 1620860018103,
						},
						{
							time: 1621462976902,
						},
						{
							time: 1621570163381,
						},
						{
							time: 1622078935737,
						},
						{
							time: 1625437252932,
						},
						{
							time: 1626134465303,
						},
						{
							time: 1660136441069,
						},
					],
					active: {
						objectives: {},
						started: 1660344287886,
					},
				},
				skywars_halloween_harvest_2020: {
					active: {
						objectives: {
							skywars_halloween_mega_wins: 1,
							skywars_halloween_kills: 333,
						},
						started: 1603042995838,
					},
				},
				skywars_daily_tokens: {
					completions: [
						{
							time: 1605105548133,
						},
						{
							time: 1605687559757,
						},
						{
							time: 1606307302915,
						},
						{
							time: 1606509005418,
						},
						{
							time: 1606659619816,
						},
						{
							time: 1606937275291,
						},
						{
							time: 1607017302885,
						},
						{
							time: 1607102265789,
						},
						{
							time: 1607146553034,
						},
						{
							time: 1607233313889,
						},
						{
							time: 1607453620496,
						},
						{
							time: 1607691394419,
						},
						{
							time: 1607749819315,
						},
						{
							time: 1607891713967,
						},
						{
							time: 1607922421416,
						},
						{
							time: 1608014140306,
						},
						{
							time: 1608161180967,
						},
						{
							time: 1608182336771,
						},
						{
							time: 1608446915294,
						},
						{
							time: 1608652441195,
						},
						{
							time: 1614370769744,
						},
						{
							time: 1614535804761,
						},
						{
							time: 1614740970368,
						},
						{
							time: 1615012048803,
						},
						{
							time: 1615260081582,
						},
						{
							time: 1615522578783,
						},
						{
							time: 1615593404505,
						},
						{
							time: 1615777218347,
						},
						{
							time: 1615882146336,
						},
						{
							time: 1616179457858,
						},
						{
							time: 1616431868130,
						},
						{
							time: 1616537875843,
						},
						{
							time: 1616793029672,
						},
						{
							time: 1617054183556,
						},
						{
							time: 1617222295911,
						},
						{
							time: 1617449036700,
						},
						{
							time: 1617831588734,
						},
						{
							time: 1618039237021,
						},
						{
							time: 1618643527584,
						},
						{
							time: 1619326345485,
						},
						{
							time: 1620513873719,
						},
						{
							time: 1620683561672,
						},
						{
							time: 1620857558036,
						},
						{
							time: 1621463735600,
						},
						{
							time: 1622078245028,
						},
						{
							time: 1622382629743,
						},
						{
							time: 1625302402598,
						},
						{
							time: 1625437670003,
						},
						{
							time: 1625894976300,
						},
						{
							time: 1626306720806,
						},
						{
							time: 1628212232123,
						},
						{
							time: 1660135846155,
						},
						{
							time: 1660835137741,
						},
						{
							time: 1661115147210,
						},
						{
							time: 1661182449709,
						},
						{
							time: 1661490201620,
						},
						{
							time: 1661909251832,
						},
						{
							time: 1662171299075,
						},
						{
							time: 1663994551169,
						},
						{
							time: 1664444134240,
						},
					],
				},
				skywars_weekly_free_loot_chest: {
					completions: [
						{
							time: 1605106846043,
						},
						{
							time: 1605688282658,
						},
						{
							time: 1606308789513,
						},
						{
							time: 1606509966218,
						},
						{
							time: 1607103219016,
						},
						{
							time: 1607749819314,
						},
						{
							time: 1608447396387,
						},
						{
							time: 1614371252679,
						},
						{
							time: 1615013198205,
						},
						{
							time: 1615593801429,
						},
						{
							time: 1616187193934,
						},
						{
							time: 1617221890499,
						},
						{
							time: 1617449500761,
						},
						{
							time: 1618920326778,
						},
						{
							time: 1620514027225,
						},
						{
							time: 1622020542983,
						},
						{
							time: 1622383166536,
						},
						{
							time: 1625437670003,
						},
						{
							time: 1627463309698,
						},
						{
							time: 1660345538326,
						},
						{
							time: 1661115845150,
						},
						{
							time: 1662171161906,
						},
						{
							time: 1664194064808,
						},
					],
				},
				skywars_arcade_win: {
					active: {
						objectives: {},
						started: 1603042996838,
					},
				},
				skywars_weekly_kills: {
					completions: [
						{
							time: 1605513021984,
						},
						{
							time: 1606396154320,
						},
						{
							time: 1606659915913,
						},
						{
							time: 1607453620495,
						},
						{
							time: 1607842911424,
						},
						{
							time: 1608741478111,
						},
						{
							time: 1614461574472,
						},
						{
							time: 1615429803939,
						},
						{
							time: 1615881727761,
						},
						{
							time: 1616537875843,
						},
						{
							time: 1618039237021,
						},
						{
							time: 1620858335542,
						},
						{
							time: 1622405147766,
						},
						{
							time: 1660136659649,
						},
						{
							time: 1661908992702,
						},
					],
					active: {
						objectives: {
							skywars_weekly_kills: 116,
						},
						started: 1662170583844,
					},
				},
				skywars_corrupt_win: {
					completions: [
						{
							time: 1605173031072,
						},
						{
							time: 1605688282658,
						},
						{
							time: 1606572000789,
						},
						{
							time: 1607691687466,
						},
						{
							time: 1607933337273,
						},
						{
							time: 1608180706977,
						},
						{
							time: 1608253535719,
						},
						{
							time: 1614373089276,
						},
						{
							time: 1615776067810,
						},
						{
							time: 1615881937334,
						},
						{
							time: 1616539534193,
						},
						{
							time: 1617449500761,
						},
						{
							time: 1625724443005,
						},
						{
							time: 1660345538327,
						},
						{
							time: 1661183778406,
						},
						{
							time: 1661490201619,
						},
						{
							time: 1664448367741,
						},
					],
				},
				skywars_weekly_arcade_win_all: {
					active: {
						objectives: {},
						started: 1604607525125,
					},
				},
				bedwars_daily_gifts: {
					completions: [
						{
							time: 1606955828371,
						},
						{
							time: 1607010877070,
						},
						{
							time: 1607114380526,
						},
						{
							time: 1607185449918,
						},
						{
							time: 1607264425951,
						},
						{
							time: 1607382596224,
						},
						{
							time: 1607404351453,
						},
						{
							time: 1607527575303,
						},
						{
							time: 1607648407828,
						},
						{
							time: 1607686556046,
						},
						{
							time: 1607753623250,
						},
						{
							time: 1607827429705,
						},
						{
							time: 1607893419702,
						},
						{
							time: 1607939740526,
						},
						{
							time: 1608012011361,
						},
						{
							time: 1608114840324,
						},
						{
							time: 1608255690223,
						},
						{
							time: 1608269409546,
						},
						{
							time: 1608390681073,
						},
						{
							time: 1608471271159,
						},
						{
							time: 1608528793713,
						},
						{
							time: 1608648899719,
						},
						{
							time: 1609334563111,
						},
					],
				},
				build_battle_weekly: {
					completions: [
						{
							time: 1660929012095,
						},
					],
					active: {
						objectives: {
							play: 14,
						},
						started: 1661538127263,
					},
				},
				build_battle_christmas_weekly: {
					active: {
						objectives: {},
						started: 1606979914867,
					},
				},
				build_battle_winner: {
					completions: [
						{
							time: 1606980527031,
						},
						{
							time: 1607106051962,
						},
						{
							time: 1607835442847,
						},
						{
							time: 1608602205779,
						},
						{
							time: 1617407433961,
						},
						{
							time: 1625729204974,
						},
						{
							time: 1625951723079,
						},
						{
							time: 1626375786421,
						},
						{
							time: 1626547864041,
						},
						{
							time: 1660138868777,
						},
						{
							time: 1660229431632,
						},
						{
							time: 1660928404442,
						},
						{
							time: 1661077563841,
						},
						{
							time: 1661210791913,
						},
						{
							time: 1661268059645,
						},
						{
							time: 1662047183603,
						},
						{
							time: 1662214896224,
						},
					],
				},
				build_battle_player: {
					completions: [
						{
							time: 1607143410407,
						},
						{
							time: 1608602814281,
						},
						{
							time: 1625728575199,
						},
						{
							time: 1626375797296,
						},
						{
							time: 1660153564665,
						},
						{
							time: 1660334793675,
						},
						{
							time: 1660929725290,
						},
						{
							time: 1661078209022,
						},
						{
							time: 1661209296580,
						},
						{
							time: 1661268070644,
						},
						{
							time: 1662047194638,
						},
					],
					active: {
						objectives: {
							play: 1,
						},
						started: 1662127888638,
					},
				},
				build_battle_christmas: {
					active: {
						objectives: {
							play: 1,
						},
						started: 1606979914867,
					},
				},
				skywars_special_north_pole: {
					completions: [
						{
							time: 1607017090033,
						},
						{
							time: 1607102314905,
						},
						{
							time: 1607146180693,
						},
						{
							time: 1607233231284,
						},
						{
							time: 1607453702469,
						},
						{
							time: 1607692050782,
						},
						{
							time: 1607751514544,
						},
						{
							time: 1607933109979,
						},
						{
							time: 1608013828918,
						},
						{
							time: 1608171272879,
						},
						{
							time: 1608182563178,
						},
						{
							time: 1608448584229,
						},
						{
							time: 1608652933945,
						},
					],
				},
				blitz_special_daily_north_pole: {
					completions: [
						{
							time: 1607115554993,
						},
						{
							time: 1607148434209,
						},
						{
							time: 1607561402304,
						},
						{
							time: 1608655718839,
						},
					],
					active: {
						objectives: {
							blitz_special_gifts: 2,
						},
						started: 1609194747104,
					},
				},
				tnt_wizards_weekly: {
					active: {
						objectives: {
							tnt_wizards_weekly_kills: 5,
						},
						started: 1607138922393,
					},
				},
				tnt_daily_win: {
					completions: [
						{
							time: 1626141298762,
						},
					],
					active: {
						objectives: {},
						started: 1626236420368,
					},
				},
				tnt_bowspleef_weekly: {
					active: {
						objectives: {
							tnt_bowspleef_weekly: 29,
						},
						started: 1607138922393,
					},
				},
				tnt_bowspleef_daily: {
					active: {
						objectives: {
							tnt_bowspleef_daily: 29,
						},
						started: 1607138922393,
					},
				},
				tnt_pvprun_daily: {
					completions: [
						{
							time: 1617924890329,
						},
					],
					active: {
						objectives: {},
						started: 1626236420368,
					},
				},
				tnt_tntrun_daily: {
					completions: [
						{
							time: 1617924272900,
						},
						{
							time: 1660589637794,
						},
					],
					active: {
						objectives: {
							tnt_tntrun_daily: 390,
						},
						started: 1660672219398,
					},
				},
				tnt_weekly_play: {
					active: {
						objectives: {
							tnt_weekly_play: 17,
						},
						started: 1607138922393,
					},
				},
				tnt_tntrun_weekly: {
					completions: [
						{
							time: 1660589711249,
						},
					],
					active: {
						objectives: {
							tnt_tntrun_weekly: 390,
						},
						started: 1661087203898,
					},
				},
				tnt_tnttag_weekly: {
					completions: [
						{
							time: 1660590529764,
						},
					],
					active: {
						objectives: {
							tnt_tnttag_weekly: 13,
						},
						started: 1661087197748,
					},
				},
				tnt_pvprun_weekly: {
					active: {
						objectives: {
							tnt_pvprun_weekly: 3,
						},
						started: 1607138922393,
					},
				},
				tnt_weekly_special: {
					active: {
						objectives: {
							tnt_weekly_candy_canes: 3,
						},
						started: 1607138922393,
					},
				},
				tnt_tnttag_daily: {
					completions: [
						{
							time: 1608162682240,
						},
						{
							time: 1626141026540,
						},
						{
							time: 1627265880799,
						},
						{
							time: 1660591768115,
						},
						{
							time: 1661190976105,
						},
					],
					active: {
						objectives: {
							tnt_tnttag_daily: 4,
						},
						started: 1661234761222,
					},
				},
				tnt_wizards_daily: {
					active: {
						objectives: {
							tnt_wizards_daily_kills: 5,
						},
						started: 1607138922393,
					},
				},
				arcade_gamer: {
					completions: [
						{
							time: 1607823165613,
						},
						{
							time: 1622607454919,
						},
						{
							time: 1626548429223,
						},
						{
							time: 1660840109175,
						},
						{
							time: 1660940618237,
						},
						{
							time: 1661087082352,
						},
					],
					active: {
						objectives: {
							play: 2,
						},
						started: 1661190181170,
					},
				},
				arcade_winner: {
					completions: [
						{
							time: 1607489479794,
						},
						{
							time: 1617222611683,
						},
						{
							time: 1626548380002,
						},
						{
							time: 1660838413498,
						},
						{
							time: 1660938121752,
						},
					],
					active: {
						objectives: {},
						started: 1661086111010,
					},
				},
				arcade_specialist: {
					completions: [
						{
							time: 1660939771390,
						},
					],
					active: {
						objectives: {},
						started: 1661820689751,
					},
				},
				walls_daily_kill: {
					completions: [
						{
							time: 1607211781904,
						},
					],
					active: {
						objectives: {
							walls_daily_kill: 0,
						},
						started: 1625979829687,
					},
				},
				walls_daily_play: {
					completions: [
						{
							time: 1607209618525,
						},
					],
					active: {
						objectives: {},
						started: 1625979830087,
					},
				},
				walls_daily_win: {
					completions: [
						{
							time: 1607209618525,
						},
					],
					active: {
						objectives: {},
						started: 1625979833993,
					},
				},
				walls_weekly: {
					active: {
						objectives: {
							walls_weekly_kills: 6,
							walls_weekly_play: 3,
						},
						started: 1607208186876,
					},
				},
				quake_daily_kill: {
					active: {
						objectives: {
							quake_daily_kill: 5,
						},
						started: 1607209626141,
					},
				},
				quake_daily_play: {
					active: {
						objectives: {
							quake_daily_play: 1,
						},
						started: 1607209626141,
					},
				},
				quake_weekly_play: {
					active: {
						objectives: {
							quake_weekly_play: 1,
						},
						started: 1607209626141,
					},
				},
				paintballer: {
					active: {
						objectives: {},
						started: 1607209626141,
					},
				},
				paintball_killer: {
					active: {
						objectives: {},
						started: 1607209626141,
					},
				},
				quake_daily_win: {
					active: {
						objectives: {},
						started: 1607209626141,
					},
				},
				vampirez_daily_human_kill: {
					active: {
						objectives: {},
						started: 1607209626142,
					},
				},
				vampirez_daily_kill: {
					active: {
						objectives: {},
						started: 1607209626142,
					},
				},
				vampirez_daily_win: {
					active: {
						objectives: {},
						started: 1607209626142,
					},
				},
				vampirez_weekly_human_kill: {
					active: {
						objectives: {},
						started: 1607209626142,
					},
				},
				paintball_expert: {
					active: {
						objectives: {},
						started: 1607209626141,
					},
				},
				gingerbread_maps: {
					active: {
						objectives: {},
						started: 1607209626144,
					},
				},
				gingerbread_racer: {
					active: {
						objectives: {},
						started: 1607209626144,
					},
				},
				arena_daily_kills: {
					active: {
						objectives: {},
						started: 1607209626142,
					},
				},
				arena_daily_play: {
					active: {
						objectives: {},
						started: 1607209626144,
					},
				},
				vampirez_weekly_kill: {
					active: {
						objectives: {},
						started: 1607209626142,
					},
				},
				vampirez_daily_play: {
					active: {
						objectives: {},
						started: 1607209626141,
					},
				},
				gingerbread_bling_bling: {
					active: {
						objectives: {},
						started: 1607209626143,
					},
				},
				arena_daily_wins: {
					active: {
						objectives: {},
						started: 1607209626145,
					},
				},
				vampirez_weekly_win: {
					active: {
						objectives: {},
						started: 1607209626142,
					},
				},
				arena_weekly_play: {
					active: {
						objectives: {},
						started: 1607209626145,
					},
				},
				gingerbread_mastery: {
					active: {
						objectives: {},
						started: 1607209626144,
					},
				},
				prototype_pit_daily_kills: {
					completions: [
						{
							time: 1607212676965,
						},
					],
					active: {
						objectives: {
							kill: 6,
						},
						started: 1607834697928,
					},
				},
				prototype_pit_weekly_gold: {
					active: {
						objectives: {
							prototype_pit_weekly_gold: 1419,
						},
						started: 1607211997365,
					},
				},
				prototype_pit_daily_contract: {
					active: {
						objectives: {},
						started: 1607211997365,
					},
				},
				mm_special_weekly_santa: {
					active: {
						objectives: {
							mm_special_weekly_santa: 1,
						},
						started: 1607535168077,
					},
				},
				mm_weekly_wins: {
					completions: [
						{
							time: 1610670314152,
						},
						{
							time: 1616344073237,
						},
						{
							time: 1660672690922,
						},
						{
							time: 1661085593672,
						},
						{
							time: 1661718469750,
						},
					],
					active: {
						objectives: {},
						started: 1663950416473,
					},
				},
				uhc_weekly_special_cookie: {
					active: {
						objectives: {},
						started: 1608250898487,
					},
				},
				uhc_madness: {
					active: {
						objectives: {
							kill: 49,
						},
						started: 1608250898487,
					},
				},
				cvc_kill: {
					active: {
						objectives: {},
						started: 1608537020469,
					},
				},
				cvc_win_daily_normal: {
					active: {
						objectives: {},
						started: 1608537020469,
					},
				},
				cvc_win_daily_deathmatch: {
					active: {
						objectives: {},
						started: 1608537020469,
					},
				},
				cvc_kill_daily_normal: {
					active: {
						objectives: {},
						started: 1608537020469,
					},
				},
				cvc_kill_weekly: {
					active: {
						objectives: {},
						started: 1608537020469,
					},
				},
				mega_walls_play: {
					active: {
						objectives: {},
						started: 1619635896956,
					},
				},
				mega_walls_win: {
					active: {
						objectives: {},
						started: 1619635897306,
					},
				},
				mega_walls_kill: {
					active: {
						objectives: {},
						started: 1619635897906,
					},
				},
				mega_walls_weekly: {
					active: {
						objectives: {},
						started: 1619635898407,
					},
				},
				supersmash_team_win: {
					active: {
						objectives: {},
						started: 1626312371649,
					},
				},
				supersmash_team_kills: {
					active: {
						objectives: {},
						started: 1626312372055,
					},
				},
				supersmash_solo_kills: {
					active: {
						objectives: {},
						started: 1626312372505,
					},
				},
				supersmash_solo_win: {
					active: {
						objectives: {},
						started: 1626312372875,
					},
				},
				supersmash_weekly_kills: {
					active: {
						objectives: {},
						started: 1626312375179,
					},
				},
				mega_walls_faithful: {
					active: {
						objectives: {},
						started: 1660672235005,
					},
				},
				warlords_domination: {
					active: {
						objectives: {},
						started: 1660672242037,
					},
				},
				warlords_tdm: {
					active: {
						objectives: {},
						started: 1660672242037,
					},
				},
				warlords_ctf: {
					active: {
						objectives: {},
						started: 1660672242037,
					},
				},
				warlords_victorious: {
					active: {
						objectives: {},
						started: 1660672242037,
					},
				},
				warlords_objectives: {
					active: {
						objectives: {},
						started: 1660672242037,
					},
				},
				warlords_dedication: {
					active: {
						objectives: {},
						started: 1660672242037,
					},
				},
				warlords_all_star: {
					active: {
						objectives: {},
						started: 1660672242037,
					},
				},
				mm_daily_infector: {
					completions: [
						{
							time: 1661084257184,
						},
					],
					active: {
						objectives: {},
						started: 1661234818450,
					},
				},
				wool_wars_daily_wins: {
					active: {
						objectives: {},
						started: 1661087252302,
					},
				},
				wool_wars_daily_play: {
					active: {
						objectives: {},
						started: 1661087252302,
					},
				},
				wool_wars_daily_kills: {
					active: {
						objectives: {},
						started: 1661087252302,
					},
				},
				wool_weekly_play: {
					active: {
						objectives: {},
						started: 1661087252302,
					},
				},
				wool_wars_weekly_shears: {
					active: {
						objectives: {},
						started: 1661087252302,
					},
				},
			},
			monthlycrates: {
				"7-2020": {
					REGULAR: true,
				},
				"9-2020": {
					REGULAR: true,
				},
				"10-2020": {
					REGULAR: true,
				},
				"11-2020": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"12-2020": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"1-2021": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"3-2021": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"4-2021": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"5-2021": {
					REGULAR: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
					VIP: true,
				},
				"6-2021": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"7-2021": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"8-2021": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP_PLUS: true,
					MVP: true,
				},
				"8-2022": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
				"9-2022": {
					REGULAR: true,
					VIP: true,
					VIP_PLUS: true,
					MVP: true,
					MVP_PLUS: true,
				},
			},
			eugene: {
				dailyTwoKExp: 1664442698815,
			},
			networkExp: 44155621,
			karma: 10425915,
			achievementTracking: ["general_wins", "arcade_zombie_killer", "arcade_hide_and_seek_master_hider", "arcade_hide_and_seek_hider_kills", "arcade_party_super_star", "arcade_zombies_nice_shot", "arcade_zombies_round_progression"],
			challenges: {
				all_time: {
					BUILD_BATTLE__top_3_challenge: 51,
					DUELS__feed_the_void_challenge: 94,
					BEDWARS__offensive: 1383,
					BEDWARS__support: 415,
					SKYWARS__feeding_the_void_challenge: 206,
					DUELS__teams_challenge: 41,
					SKYWARS__rush_challenge: 81,
					SKYWARS__enderman_challenge: 10,
					BUILD_BATTLE__guesser_challenge: 11,
					SURVIVAL_GAMES__resistance_challenge: 33,
					MURDER_MYSTERY__murder_spree: 6,
					UHC__threat_challenge: 2,
					SURVIVAL_GAMES__star_challenge: 2,
					SURVIVAL_GAMES__blitz_challenge: 15,
					TNTGAMES__pvp_run_challenge: 1,
					TNTGAMES__tnt_tag_challenge: 13,
					SPEED_UHC__wizard_challenge: 4,
					"QUAKECRAFT__don't_blink_challenge": 1,
					WALLS__looting_challenge: 2,
					BEDWARS__defensive: 1,
					TNTGAMES__tnt_run_challenge: 1,
					ARCADE__blocking_dead_challenge: 3,
					ARCADE__party_games_challenge: 1,
					MURDER_MYSTERY__hero: 2,
					MURDER_MYSTERY__sherlock: 1,
				},
				day_a: {
					BEDWARS__offensive: 9,
					BEDWARS__support: 1,
				},
				day_b: {
					SKYWARS__feeding_the_void_challenge: 5,
					BEDWARS__offensive: 5,
				},
				day_d: {
					BEDWARS__offensive: 8,
					BEDWARS__support: 2,
				},
				day_e: {
					BEDWARS__offensive: 2,
					BEDWARS__support: 1,
				},
				day_f: {
					BEDWARS__offensive: 10,
				},
			},
			channel: "ALL",
			achievementRewardsNew: {
				for_points_200: 1598742708489,
				for_points_300: 1600748163249,
				for_points_400: 1600842009082,
				for_points_500: 1600983859968,
				for_points_600: 1601000973659,
				for_points_700: 1601113807879,
				for_points_800: 1601117593339,
				for_points_900: 1601422168348,
				for_points_1000: 1601936371629,
				for_points_1100: 1602263597749,
				for_points_1200: 1602716926579,
				for_points_1300: 1603043354962,
				for_points_1400: 1603341821780,
				for_points_1500: 1604434115640,
				for_points_1600: 1605275536479,
				for_points_1700: 1605529453866,
				for_points_1800: 1605687054468,
				for_points_1900: 1606577599143,
				for_points_2000: 1606976595488,
				for_points_2100: 1607116011106,
				for_points_2200: 1607138793123,
				for_points_2300: 1607228046083,
				for_points_2400: 1607396073290,
				for_points_2500: 1607696445204,
				for_points_2600: 1608092203750,
				for_points_2700: 1608449584450,
				for_points_2800: 1608805422093,
				for_points_2900: 1613601718361,
				for_points_3000: 1614811764557,
				for_points_3100: 1616800953207,
				for_points_3200: 1617408155870,
				for_points_3300: 1617848054642,
				for_points_3400: 1619575966892,
				for_points_3500: 1620598504466,
				for_points_3600: 1625341252972,
				for_points_3700: 1626136531527,
				for_points_3800: 1626305663511,
				for_points_3900: 1628867257297,
				for_points_4000: 1660229803765,
				for_points_4100: 1660426959900,
				for_points_4200: 1660672260379,
				for_points_4300: 1660858603697,
				for_points_4400: 1660945456541,
				for_points_4500: 1661263981146,
				for_points_4600: 1661720967203,
			},
			petConsumables: {
				APPLE: 362,
				BREAD: 363,
				CARROT_ITEM: 327,
				COOKED_BEEF: 366,
				FEATHER: 1095,
				GOLD_RECORD: 1088,
				HAY_BLOCK: 352,
				LAVA_BUCKET: 2075,
				LEASH: 1052,
				MILK_BUCKET: 2081,
				PORK: 324,
				RED_ROSE: 364,
				ROTTEN_FLESH: 338,
				SLIME_BALL: 1014,
				WATER_BUCKET: 2233,
				WOOD_SWORD: 1102,
				BAKED_POTATO: 380,
				MAGMA_CREAM: 366,
				MELON: 369,
				MUSHROOM_SOUP: 320,
				PUMPKIN_PIE: 353,
				RAW_FISH: 386,
				STICK: 1039,
				BONE: 349,
				WHEAT: 337,
				CAKE: 311,
				COOKIE: 348,
			},
			vanityMeta: {
				packages: [
					"hat_ferret",
					"taunt_goodbye",
					"emote_cool",
					"suit_vampire_chestplate",
					"pet_smoldering_skeleton",
					"gadget_explosive_bow",
					"pet_horse_brown",
					"cloak_vampire_wings",
					"hat_halloween_skull",
					"emote_sleepy",
					"pet_chicken",
					"pet_cat_black",
					"taunt_hype_dance",
					"gadget_fortune_cookie",
					"pet_sheep_red_baby",
					"pet_pig",
					"suit_ghost_boots",
					"hat_wood_steve",
					"hat_ender_dragon",
					"pet_sheep_gray",
					"morph_enderman",
					"rankcolor_gold",
					"hat_letter_p",
					"emote_wink",
					"emote_smile",
					"morph_cow",
					"morph_creeper",
					"suit_spiderman_boots",
					"hat_festive_zombie",
					"suit_bumblebee_boots",
					"rankcolor_green",
					"pet_sheep_blue",
					"hat_fox",
					"hat_vintage",
					"suit_yeti_leggings",
					"hat_festive_skeleton",
					"cloak_sweetwings",
					"hat_snow_globe",
					"gadget_paintball_gun",
					"hat_egg_head",
					"hat_bird",
					"suit_baker_boots",
					"pet_sheep_white",
					"suit_thor_helmet",
					"hat_letter_question",
					"hat_letter_l",
					"pet_cow",
					"suit_baker_leggings",
					"hat_letter_r",
					"pet_cat_red",
					"emote_surprised",
					"suit_arctic_helmet",
					"hat_frog",
					"hat_letter_b",
					"suit_disco_boots",
					"hat_reindeer",
					"hat_festive_villager",
					"pet_red_helper",
					"gadget_cornucopia",
					"hat_bell",
					"hat_ginger_bread",
					"suit_fireman_boots",
					"pet_wolf",
					"rankcolor_yellow",
					"hat_festive_squid",
					"hat_snowman",
					"suit_grinch_leggings",
					"hat_festive_herobrine",
					"hat_decoration_ball",
					"cloak_shimmering_wings",
					"gadget_advent_proof",
					"hat_rainbow_present",
					"morph_grinch",
					"morph_chicken",
					"cloak_candy_spiral",
					"suit_elf_boots",
					"pet_white_rabbit",
					"suit_grinch_boots",
					"hat_elephant",
					"cloak_candy_cane",
					"hat_letter_k",
					"suit_mermaid_boots",
					"suit_warrior_leggings",
					"suit_thor_boots",
					"hat_letter_w",
					"hat_letter_s",
					"hat_number_4",
					"emote_sad",
					"gadget_rocket",
					"suit_frog_boots",
					"taunt_clapping",
					"hat_monitor",
					"pet_magma_cube_tiny",
					"pet_brown_horse_baby",
					"rankcolor_light_purple",
					"emote_grin",
					"pet_totem",
					"hat_letter_e",
					"emote_cheeky",
					"suit_flash_chestplate",
					"taunt_wave_dance",
					"gadget_ghosts",
					"pet_villager_blacksmith",
					"cloak_clover",
					"suit_toy_boots",
					"suit_elf_leggings",
					"hat_letter_x",
					"gadget_jetpack",
					"hat_letter_a",
					"hat_monk",
					"gadget_rainbow",
					"pet_growing_zombie",
					"hat_chick",
					"hat_easter_basket",
					"hat_sandwich",
					"rankcolor_white",
					"pet_sheep_yellow",
					"particlepack_spring",
					"emote_cry",
					"cloak_easter_egg",
					"suit_chicken_chestplate",
					"suit_chicken_leggings",
					"suit_easter_egg_chestplate",
					"clickeffects_easter_egg",
					"hat_easter_egg",
					"suit_mermaid_chestplate",
					"suit_bumblebee_leggings",
					"pet_sheep_purple",
					"taunt_cool_dance",
					"suit_chicken_boots",
					"suit_easter_egg_leggings",
					"gadget_tree_planter",
					"suit_mermaid_leggings",
					"suit_frog_leggings",
					"gadget_flaming_egg_launcher",
					"gadget_creeper_astronaut",
					"hat_number_0",
					"morph_spider",
					"pet_sheep_silver",
					"hat_letter_c",
					"pet_mule",
					"hat_letter_plus",
					"hat_clownfish",
					"pet_sheep_orange",
					"hat_letter_y",
					"pet_magma_cube_big",
					"gadget_grappling_hook",
					"pet_cat_siamese",
					"gadget_fire_trail",
					"hat_walrus",
					"suit_warrior_boots",
					"hat_assassin",
					"suit_plumber_boots",
					"pet_sheep_orange_baby",
					"suit_ninja_boots",
					"pet_sheep_cyan",
					"pet_mooshroom",
					"pet_zombie",
					"pet_horse_dark_brown",
					"morph_blaze",
					"rankcolor_blue",
					"hat_number_2",
					"suit_ninja_leggings",
					"suit_ghost_leggings",
					"suit_flash_leggings",
					"suit_death_angel_boots",
					"hat_egyptian_queen",
					"suit_flash_boots",
					"hat_number_3",
					"suit_disco_leggings",
					"suit_necromancer_boots",
					"suit_fireman_chestplate",
					"hat_letter_n",
					"pet_bat",
					"gadget_flower_giver",
					"pet_horse_grey",
					"hat_snowglobe",
					"hat_doge",
					"suit_arctic_leggings",
					"hat_letter_i",
					"emote_relax",
					"pet_silverfish",
					"pet_sheep_brown",
					"hat_number_5",
					"pet_horse_white",
					"gadget_dice",
					"suit_solar_leggings",
					"hat_letter_z",
					"hat_letter_u",
					"hat_dinosaur",
					"morph_pig",
					"suit_dragon_breath_leggings",
					"gadget_horror_movie",
					"emote_dizzy",
					"pet_enderman",
					"hat_letter_hashtag",
					"suit_disco_chestplate",
					"suit_bumblebee_helmet",
					"gadget_wizardwand",
					"suit_arctic_boots",
					"suit_tnt_chestplate",
					"rankcolor_dark_green",
					"hat_skull_king_banner",
					"suit_disco_helmet",
					"gadget_tnt_fountain",
					"gadget_swing",
					"gadget_hype_train",
					"hat_letter_o",
					"gadget_tennis_ball",
					"hat_number_7",
					"suit_solar_chestplate",
					"gadget_sand_castle",
					"hat_cactus",
					"hat_letter_d",
					"hat_orc",
					"taunt_victory",
					"hat_scavenger",
					"hat_mummy",
					"pet_skeleton",
					"rankcolor_dark_red",
					"rankcolor_dark_aqua",
					"pet_sheep_magenta",
					"gadget_magic_carpet",
					"suit_death_angel_chestplate",
					"hat_number_8",
					"hat_earth",
					"suit_warrior_helmet",
					"hat_evil_eye",
					"gadget_frisbee",
					"gadget_ice_cream_stand",
					"suit_wolf_helmet",
					"hat_football_star",
					"hat_polar_bear",
					"hat_koala",
					"hat_number_6",
					"pet_sheep_lime",
					"suit_dragon_breath_chestplate",
					"gadget_paint_trail",
					"pet_cow_baby",
					"suit_pirate_helmet",
					"gadget_tic_tac_toe",
					"hat_siren",
					"hat_space",
					"suit_pirate_leggings",
					"hat_white_wizard",
					"gadget_tetherball",
					"hat_letter_exclaimation",
					"gadget_exploding_sheep",
					"hat_golden_pufferfish",
					"hat_broken_tv",
					"pet_slime_big",
					"hat_letter_j",
					"pet_zombie_villager",
					"pet_chicken_baby",
					"pet_black_rabbit",
					"hat_mage",
					"hat_horse",
					"morph_zombie",
					"gadget_poop_bomb",
					"hat_toaster",
					"gadget_pinata",
					"pet_cave_spider",
					"pet_sheep_magenta_baby",
					"hat_cheese",
					"gadget_hot_potato",
				],
			},
			parkourCheckpointBests: {
				Bedwars: {
					"0": 11303,
					"1": 8000,
					"2": 10900,
					"3": 102259,
				},
				Duels: {
					"0": 13463,
					"1": 30737,
					"2": 26814,
				},
			},
			parkourCompletions: {
				Bedwars: [
					{
						timeStart: 1601509736407,
						timeTook: 133725,
					},
				],
			},
			housingMeta: {
				tutorialStep: "FINISH_FINISHED",
				packages: [
					"air_theme",
					"housing_item_flag_1",
					"housing_item_flag_3",
					"flowers_theme",
					"lollipop_theme",
					"crystals_theme",
					"fruit_salad_theme",
					"smileys_theme",
					"specialoccasion_christmas_skull_red_ornament",
					"northern_lights_theme",
					"fjord_theme",
					"north_pole_theme",
					"goldmine_theme",
					"specialoccasion_christmas_skull_holiday_toy",
					"future_tech_theme",
					"town_square_theme",
					"grand_plains_theme",
					"egg_workshop_theme",
					"skull_pack_spring",
					"blocking_dead_theme",
					"mushrooms_theme",
					"painter_studio_theme",
					"pool_party_bbq_theme",
					"basic_theme",
					"warlords_blue_theme",
					"tenshu_theme",
					"specialoccasion_reward_card_skull_golden_chalice",
					"jungle_theme",
					"warlords_red_theme",
				],
				allowedBlocks: [
					"1:6",
					"3:0",
					"1:0",
					"5:0",
					"50:0",
					"98:0",
					"4:0",
					"18:0",
					"35:0",
					"20:0",
					"324:0",
					"13:0",
					"85:0",
					"2:0",
					"31:1",
					"3:1",
					"38:0",
					"37:0",
					"53:0",
					"109:0",
					"44:0",
					"171:0",
					"139:0",
					"17:1",
					"5:2",
					"45:0",
					"5:1",
					"18:1",
					"126:0",
					"44:5",
					"80:0",
					"78:0",
					"1:3",
					"12:1",
					"172:0",
					"48:0",
					"12:0",
					"24:0",
					"32:0",
					"65:0",
					"323:0",
					"325:0",
					"82:0",
					"1:1",
					"159:3",
					"35:9",
					"155:0",
					"1:5",
					"110:0",
					"162:0",
				],
				given_cookies_105081: ["2b3df4d4-07a5-44db-97ff-30ad863445b2"],
				given_cookies_105089: ["68e0cd33-82d0-4191-9f6b-3a81a16e7dc1"],
				given_cookies_105090: ["fd52cf18-04e0-4b32-874e-a3f42dab4d8f"],
				given_cookies_105091: ["fccd4e64-790d-4e1a-9577-709224c62ae5", "d56474e9-050f-42f8-997f-b93e098ba073"],
				playerSettings: {
					VISIBILITY: "IntegerState-4",
				},
				given_cookies_105092: ["ba529214-5e8e-4347-96e5-3b653feaad5d", "ceacb4cf-9767-4007-976f-0a5b7b3f1db9"],
				given_cookies_105041: ["2bb341d4-efbf-4be1-a025-a33368b273a8"],
				given_cookies_105101: ["e0e404b8-aa56-4539-aba1-d828f509779b"],
				given_cookies_105102: ["ba529214-5e8e-4347-96e5-3b653feaad5d", "e0e404b8-aa56-4539-aba1-d828f509779b"],
				given_cookies_105104: ["ca0fd07b-ad89-432e-b808-44e006929156"],
				given_cookies_105105: ["e0e404b8-aa56-4539-aba1-d828f509779b"],
				given_cookies_105106: ["ac69fca0-a092-4daa-94fc-f8813b814a19"],
				given_cookies_105108: ["494cac30-3da9-4882-bfe0-bd8125fb3b84", "5d863ec4-252f-41d7-9c79-dee88767ebac"],
				given_cookies_105112: ["a4201dba-b822-4536-b93b-ef74d6df0c01"],
				given_cookies_105177: ["081b9e08-1b45-4580-a2f0-40e185fb5161", "28692b54-15e2-4367-8a96-23f648b79fee", "2cc3c3cc-9070-43b3-a8b2-038c99ea9533"],
			},
			newPackageRank: "MVP_PLUS",
			levelUp_MVP_PLUS: 1606626347639,
			questSettings: {},
			rankPlusColor: "DARK_RED",
			achievementSync: {
				quake_tiered: 1,
			},
			adsense_tokens: 0,
			snowball_fight_intro_2019: true,
			lastAdsenseGenerateTime: 1661550732466,
			lastClaimedReward: 1661550732463,
			rewardHighScore: 9,
			rewardScore: 4,
			rewardStreak: 4,
			totalDailyRewards: 54,
			totalRewards: 66,
			achievementTotem: {
				canCustomize: true,
				allowed_max_height: 2,
				unlockedParts: ["birdy", "happy", "arrow", "snake", "pong"],
				selectedParts: {
					slot_0: "arrow",
					slot_1: "birdy",
				},
				unlockedColors: ["blue", "purple"],
				selectedColors: {
					slotcolor_0: "blue",
				},
			},
			tourney: {
				first_join_lobby: 1614998378485,
			},
			easter2021Cooldowns2: {
				NORMAL0: true,
				VIP0: true,
				VIP_PLUS0: true,
				MVP0: true,
				MVP_PLUS0: true,
				NORMAL1: true,
				VIP1: true,
				VIP_PLUS1: true,
				MVP1: true,
				MVP_PLUS1: true,
				NORMAL2: true,
				VIP2: true,
				VIP_PLUS2: true,
				MVP2: true,
				MVP_PLUS2: true,
				NORMAL3: true,
				VIP3: true,
				VIP_PLUS3: true,
				MVP_PLUS3: true,
				MVP3: true,
				SUPERSTAR0: true,
				SUPERSTAR3: true,
				SUPERSTAR2: true,
				SUPERSTAR1: true,
			},
			anniversaryNPCVisited2021: [4, 5, 3, 2, 6],
			anniversaryNPCProgress2021: 1,
			monthlyPackageRank: "SUPERSTAR",
			mostRecentMonthlyPackageRank: "SUPERSTAR",
			adventRewards2020: {
				day2: 1606932946871,
				day1: 1606953927014,
				day3: 1606980540846,
				day4: 1607100414022,
				day5: 1607176844337,
				day6: 1607231170661,
				day7: 1607362444065,
				day8: 1607439444695,
				day9: 1607525525066,
				day10: 1607642937819,
				day11: 1607685680284,
				day12: 1607762188444,
				day13: 1607843843463,
				day14: 1607922939628,
				day15: 1608017821530,
				day16: 1608106071283,
				day17: 1608181529485,
				day18: 1608336575256,
				day19: 1608389805881,
				day20: 1608441550129,
				day21: 1608533760394,
				day22: 1608619084263,
				day23: 1608719429120,
				day24: 1608795269704,
				day25: 1608872628062,
			},
			summer2021Cooldowns: {
				NORMAL0: true,
				VIP0: true,
				VIP_PLUS0: true,
				MVP0: true,
				MVP_PLUS0: true,
				SUPERSTAR0: true,
				NORMAL1: true,
				VIP1: true,
				VIP_PLUS1: true,
				MVP1: true,
				MVP_PLUS1: true,
				SUPERSTAR1: true,
				NORMAL2: true,
				VIP2: true,
				VIP_PLUS2: true,
				MVP2: true,
				MVP_PLUS2: true,
				SUPERSTAR2: true,
				NORMAL3: true,
				VIP3: true,
				VIP_PLUS3: true,
				MVP3: true,
			},
			monthlyRankColor: "GOLD",
			onetime_achievement_menu_sort: "a_to_z",
			vanityFavorites: "GADGET_COWBOY;HAT_GOLDEN_PUFFERFISH",
			currentGadget: "COWBOY",
			skyblock_free_cookie: 1660338377056,
			userLanguage: "ENGLISH",
			currentCloak: "GUILD",
			currentHat: "GOLDEN_PUFFERFISH",
		},
		hypixelFriends: {
			data: [],
			status: 200,
		},
		hypixelFriendsMutuals: null,
		denicked: false,
		sources: {
			runApi: {
				success: true,
				code: 200,
				data: {
					uuid: "8589389e8b6b46c288084eb71ec3479e",
					username: "INVALID",
					bot: {
						tagged: false,
						unidentified: false,
						kay: false,
					},
					blacklist: {
						tagged: false,
						timestamp: 0,
						reason: "",
						report_type: "",
					},
					safelist: {
						tagged: true,
						timesKilled: 1,
						security_level: 0,
						personal: true,
					},
					customTag: "§c<3",
					statistics: {
						encounters: 3,
						threat_level: 0,
					},
					migrated: {
						tagged: false,
					},
					annoylist: {
						tagged: true,
					},
					name_change: {
						last_change: 0,
					},
					ranked_bedwars: {
						elo: 0,
					},
				},
				msTime: 1664792488853,
			},
			boomza: {
				data: {
					sniper: true,
					report: 1,
					error: false,
					username: "CatgirlKay",
				},
				status: 200,
			},
			keathiz: {
				status: 200,
				data: {
					success: false,
					player: {
						ign_lower: "catgirlkay",
						queues: {
							last_3_min: 0,
							last_10_min: 0,
							last_30_min: 0,
							last_24_hours: 0,
							last_48_hours: 0,
							total: 0,
							consecutive_queue_checks: {
								last_1000_queues: {
									"1_min_requeue": 0,
									"2_min_requeue": 0,
									"3_min_requeue": 0,
								},
								last_30_queues: {
									"1_min_requeue": 0,
									"2_min_requeue": 0,
									"3_min_requeue": 0,
								},
								last_10_queues: {
									"1_min_requeue": 0,
									"2_min_requeue": 0,
									"3_min_requeue": 0,
								},
								weighted: {
									"1_min_requeue": 0,
									"2_min_requeue": 0,
									"3_min_requeue": 0,
								},
							},
						},
						exits: {
							last_3_min: 0,
							last_10_min: 0,
							last_30_min: 0,
							last_24_hours: 0,
							last_48_hours: 0,
							total: 0,
							short_exits: 0,
						},
						winstreak: {
							accurate: false,
							date: 0,
							estimates: {
								overall_winstreak: 0,
								eight_one_winstreak: 0,
								eight_two_winstreak: 0,
								four_three_winstreak: 0,
								four_four_winstreak: 0,
								two_four_winstreak: 0,
								castle_winstreak: 0,
								eight_one_rush_winstreak: 0,
								eight_two_rush_winstreak: 0,
								four_four_rush_winstreak: 0,
								eight_one_ultimate_winstreak: 0,
								eight_two_ultimate_winstreak: 0,
								four_four_ultimate_winstreak: 0,
								eight_two_armed_winstreak: 0,
								four_four_armed_winstreak: 0,
								eight_two_lucky_winstreak: 0,
								four_four_lucky_winstreak: 0,
								eight_two_voidless_winstreak: 0,
								four_four_voidless_winstreak: 0,
								tourney_bedwars_two_four_0_winstreak: 0,
								tourney_bedwars4s_0_winstreak: 0,
								tourney_bedwars4s_1_winstreak: 0,
								eight_two_underworld_winstreak: 0,
								four_four_underworld_winstreak: 0,
								eight_two_swap_winstreak: 0,
								four_four_swap_winstreak: 0,
							},
						},
						extra: {
							last_seen_lobby: "",
							blacklisted: false,
							status: "",
						},
					},
				},
			},
			lunar: null,
		},
	};
	return [player];
};
