const SupportCode = require('../../../common/support-code');

module.exports = {
	'0101': new SupportCode('Missing name', 'Missing description', 'Could not load System Settings data.', 'Missing fix', 'Missing link'),
	'0102': new SupportCode('Missing name', 'Missing description', 'Could not change settings.', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};