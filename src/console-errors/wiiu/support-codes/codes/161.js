const SupportCode = require('../../../common/support-code');

module.exports = {
	'0101': new SupportCode('Missing name', 'Missing description', 'This disc has been used with another\nconsole. It cannot be used with this\nconsole.\n\nFor more information, please refer to\nthe software manual.', 'Missing fix', 'Missing link'),
	'0102': new SupportCode('Missing name', 'Missing description', 'The disc could not be read. It might\nbe dirty.\n\nPress the EJECT Button, remove\nthe disc, and clean it gently, using\na soft cloth to wipe outward from\nthe center.\n\nIf that does not resolve the issue,\nplease make a note of the error\ncode and visit support.nintendo.com.', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};