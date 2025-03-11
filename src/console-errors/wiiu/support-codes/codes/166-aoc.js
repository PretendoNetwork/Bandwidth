const SupportCode = require('../../../common/support-code');

module.exports = {
	'0100': new SupportCode('Missing name', 'Missing description', 'There is not enough free space\nto save temporary data.\n\nPlease go to Data Management in\nSystem Settings to make space.', 'Missing fix', 'Missing link'),
	'0200': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};