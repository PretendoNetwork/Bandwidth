const SupportCode = require('../../../common/support-code');

module.exports = {
	'1003': new SupportCode('Missing name', 'Missing description', 'In order to use this service, a system\nupdate is required.\n\nTo perform a system update, select\nSystem Update from Other Settings\nin System Settings', 'Missing fix', 'Missing link'),
	'3502': new SupportCode('Missing name', 'Missing description', 'A communication error has occurred.\n\nOur network is experiencing high\ntraffic volumes. We apologize for the\ninconvenience. Please try again later', 'Missing fix', 'Missing link'),
	'3503': new SupportCode('Missing name', 'Missing description', 'The server is currently undergoing\nmaintenance. We apologize for any\ninconvenience. Please try again later.\n\nTo learn more about maintenance,\nvisit support.nintendo.com', 'Missing fix', 'Missing link'),
};