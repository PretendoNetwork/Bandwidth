const SupportCode = require('../../../common/support-code');

module.exports = {
	'9000': new SupportCode('CLOSE_APPLICATION', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9001': new SupportCode('RETRIABLE', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9002': new SupportCode('UNDER_MAINTENANCE', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9003': new SupportCode('SERVICE_FINISHED', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9100': new SupportCode('INVALID_TEMPLATE', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};