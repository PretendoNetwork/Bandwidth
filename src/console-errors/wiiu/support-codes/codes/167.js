const SupportCode = require('../../../common/support-code');

module.exports = {
	'0001': new SupportCode('Missing name', 'Missing description', 'There is not enough free space for Wii\nsoftware.\n\nPlease go to Wii Options in the Wii\nMenu and move or delete data in order\nto free up at least one block of space.\n\nIf the problem persists, please make\na note of the error code and visit\nsupport.nintendo.com.', 'Missing fix', 'Missing link'),
	'0002': new SupportCode('Missing name', 'Missing description', 'Unable to display on the TV screen.\n\nPlease confirm that the HDMI cable is\nproperly connected to both the Wii U\nconsole and TV and that the TV is set\nto display Wii U content, and then\nrestart the software.', 'Missing fix', 'Missing link'),
};