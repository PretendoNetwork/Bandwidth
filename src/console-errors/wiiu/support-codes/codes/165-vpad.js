const SupportCode = require('../../../common/support-code');

module.exports = {
	'0101': new SupportCode('Missing name', 'Missing description', 'Unable to communicate with the\nWii U GamePad. Please check\nthe Wii U GamePad screen.\n\nIf the Wii U GamePad battery has\nrun low, please recharge it.', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};