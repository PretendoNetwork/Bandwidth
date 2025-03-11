const SupportCode = require('../../../common/support-code');

module.exports = {
	'0100': new SupportCode('Missing name', 'Missing description', 'Communications with the controller have\nbeen interrupted.\nPlease press any button other than the\nPOWER Button. If there is no response,\nreplace or recharge the batteries as\nappropriate and try again.', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};