const SupportCode = require('../../../common/support-code');

module.exports = {
	'0101': new SupportCode('Missing name', 'Missing description', 'Communications with the controller have\nbeen interrupted.\nPlease press any button other than the\nPOWER Button. If there is no response,\nreplace or recharge the batteries as\nappropriate and try again.', 'Missing fix', 'Missing link'),
	'0201': new SupportCode('Missing name', 'Missing description', 'Replace the batteries for the\nWii Balance Board.', 'Missing fix', 'Missing link'),
	'0204': new SupportCode('Missing name', 'Missing description', 'This weight is outside the range that\ncan be measured by the Wii Balance\nBoard.', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};