export type BoomzaAntisniper = {
	sniper: boolean;
	report: number;
	error: boolean;
	username: string;
};

export type KeathizOverlayRun = {
	success: boolean;
	player: {
		ign_lower: string;
		queues: {
			last_3_min: number;
			last_10_min: number;
			last_30_min: number;
			last_24_hours: number;
			last_48_hours: number;
			total: number;
			consecutive_queue_checks: {
				last_1000_queues: {
					"1_min_requeue": number;
					"2_min_requeue": number;
					"3_min_requeue": number;
				};
				last_30_queues: {
					"1_min_requeue": number;
					"2_min_requeue": number;
					"3_min_requeue": number;
				};
				last_10_queues: {
					"1_min_requeue": number;
					"2_min_requeue": number;
					"3_min_requeue": number;
				};
				weighted: {
					"1_min_requeue": number;
					"2_min_requeue": number;
					"3_min_requeue": number;
				};
			};
		};
		exits: {
			last_3_min: number;
			last_10_min: number;
			last_30_min: number;
			last_24_hours: number;
			last_48_hours: number;
			total: number;
			short_exits: number;
		};
		winstreak: {
			accurate: boolean;
			date: number;
			estimates: {
				overall_winstreak: number;
				eight_one_winstreak: number;
				eight_two_winstreak: number;
				four_three_winstreak: number;
				four_four_winstreak: number;
				two_four_winstreak: number;
				castle_winstreak: number;
				eight_one_rush_winstreak: number;
				eight_two_rush_winstreak: number;
				four_four_rush_winstreak: number;
				eight_one_ultimate_winstreak: number;
				eight_two_ultimate_winstreak: number;
				four_four_ultimate_winstreak: number;
				eight_two_armed_winstreak: number;
				four_four_armed_winstreak: number;
				eight_two_lucky_winstreak: number;
				four_four_lucky_winstreak: number;
				eight_two_voidless_winstreak: number;
				four_four_voidless_winstreak: number;
				tourney_bedwars_two_four_0_winstreak: number;
				tourney_bedwars4s_0_winstreak: number;
				tourney_bedwars4s_1_winstreak: number;
				eight_two_underworld_winstreak: number;
				four_four_underworld_winstreak: number;
				eight_two_swap_winstreak: number;
				four_four_swap_winstreak: number;
			};
		};
		extra: {
			last_seen_lobby: string;
			blacklisted: boolean;
			status: string;
		};
	};
};

export type KeathizDenick = {
	success: boolean;
	player: {
		uuid: string;
		dashed_uuid: string;
		nick_uuid: string;
		dashed_nick_uuid: string;
		date: number;
		ign: string;
		nick: string;
	};
};

export enum KeathizEndpoints {
	OVERLAY_RUN = "overlay/run",
	DENICK = "denick",
}
