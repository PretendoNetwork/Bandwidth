export interface ServerSettings {
	guild_id: string;
	admin_role_id: string;
	head_mod_role_id: string;
	unverified_role_id: string;
	developer_role_id: string;
	mod_applications_channel_id: string;
	vc_mod_apps_channel_id: string;
	forum_mod_apps_channel_id: string;
	network_mod_apps_channel_id: string;
	juxt_mod_apps_channel_id: string;
	reports_channel_id: string;
	readme_channel_id: string;
	rules_channel_id: string;
	stats_members_channel_id: string;
	stats_people_channel_id: string;
	stats_bots_channel_id: string;
	uploaded_network_dumps_channel_id: string;
	ay_lmao_disabled: number;
}

export interface NlpDisabled {
	guild_id: string;
	member_id: string;
}

export interface CommandCooldown {
	member_id: string;
	command_id: string;
	cooldown: string;
}

export interface Poll {
	guild_id: string;
	poll_id: string;
	channel_id: string;
	title: string;
	expiry_time: string;
	options: string;
	votes: string;
	voters: string;
}

export interface Rule {
	guild_id: string;
	id: number;
	title: string;
	description: string;
	time: string;
}

export interface PragmaTableInfo {
	name: string;
}
