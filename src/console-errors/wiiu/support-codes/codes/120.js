const SupportCode = require('../../../common/support-code');

module.exports = {
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9001': new SupportCode('Missing name', 'Missing description', 'The server is currently\nundergoing maintenance.\n\nPlease try again later.', 'Missing fix', 'Missing link'),
	'9002': new SupportCode('Missing name', 'Missing description', 'The connection with the server\ntimed out. Please try again.', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'An error has occurred.\n\nPlease try again later.\n\nIf the problem persists, please\nmake a note of the error code\nand visit support.nintendo.com.', 'Missing fix', 'Missing link'),
};