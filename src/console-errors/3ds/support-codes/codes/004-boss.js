const SupportCode = require('../../../common/support-code');

module.exports = {
	'3001': new SupportCode('Missing name', 'Missing description', 'Unable to connect to the server.\nPlease try again later.\n\nFor help, visit support.nintendo.com', 'Missing fix', 'Missing link'),
	'3008': new SupportCode('Missing name', 'Missing description', 'The server is currently undergoing\nmaintenance. We apologize for any\ninconvenience. Please try again later.\n\nTo learn more about maintenance,\nvisit support.nintendo.com', 'Missing fix', 'Missing link'),
	'3009': new SupportCode('Missing name', 'Missing description', 'An error has occurred.\nTurn off the power and try again.\n\nFor help, visit support.nintendo.com', 'Missing fix', 'Missing link'),
	'4001': new SupportCode('Missing name', 'Missing description', 'An error has occurred.\n\n■ The SD Card may not be inserted.\nPlease turn the power off, insert an\nSD Card, and try again.\n\nFor help, visit support.nintendo.com.\n\n■ The software\'s extra data may have \nbeen deleted. Please create new extra\ndata', 'Missing fix', 'Missing link'),
	'4002': new SupportCode('Missing name', 'Missing description', 'An error has occurred.\nTurn off the power and try again.\n\nFor help, visit support.nintendo.com', 'Missing fix', 'Missing link'),
	'6002': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'6006': new SupportCode('Missing name', 'Missing description', 'An error has occurred.\n\n■ The SD Card may not be inserted.\nPlease turn the power off, insert an\nSD Card, and try again.\n\n■ There may not be enough open\nblocks on the SD Card. Please use\nData Management in System Settings\nto delete unnecessary data on the SD\nCard.\n\n■ The software\'s extra data may have\nbeen deleted. Please create new extra\ndata.\n\n■ For help, visit support.nintendo.com', 'Missing fix', 'Missing link'),
	'7001': new SupportCode('Missing name', 'Missing description', 'Could not connect to the Internet.\n\nThe network may be busy, or there\nmay be problems with the connection\nenvironment. To ensure an optimal\nconnection environment, move closer\nto the access point and make sure that\nthere are no obstructions between\nthe system and the access point.\nIf this does not work, please try\nagain later.\n\n■ Check that your computer can\nconnect to the Internet using the same\nsettings. If not, refer to the instruction\nbooklet that came with your\naccess point.\n\n■ The DNS setting may have been \nentered incorrectly. Check the setting \nin System Settings ⇒ Internet \nSettings.\n\n■ The proxy server may have been\nentered incorrectly. Check the setting\nin System Settings ⇒ Internet \nSettings', 'Missing fix', 'Missing link'),
	'7007': new SupportCode('Missing name', 'Missing description', 'The server is currently undergoing\nmaintenance. We apologize for any\ninconvenience. Please try again later.\n\nTo learn more about maintenance,\nvisit support.nintendo.com', 'Missing fix', 'Missing link'),
};
