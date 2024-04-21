const SupportCode = require('../../../common/support-code');

module.exports = {
	'0100': new SupportCode('Missing name', 'Missing description', 'There is not enough free space to\ncreate save data.\n\nPlease go to Data Management in\nSystem Settings to make space.', 'Missing fix', 'Missing link'),
	'0200': new SupportCode('Missing name', 'Missing description', 'There is not enough free space to\ncreate save data.\n\nPlease go to Data Management in\nSystem Settings to make space.', 'Missing fix', 'Missing link'),
	'0202': new SupportCode('Missing name', 'Missing description', 'Unable to detect USB storage device.\n\nTurn the console off, ensure that the\nUSB device is connected properly, and\nthen try again.', 'Missing fix', 'Missing link'),
	'0205': new SupportCode('Missing name', 'Missing description', 'Insert the disc.', 'Missing fix', 'Missing link'),
	'0213': new SupportCode('Missing name', 'Missing description', 'The USB storage device is\nwrite-protected.\n\nPlease refer to the manual for the\ndevice and disable write-protection.', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9000': new SupportCode('Missing name', 'Missing description', 'Save data could not be created.\n\nPlease make note of the error code,\nand then turn off the console\'s power,\nunplug the Wii U console\'s AC adapter\nfrom the outlet, and visit\nsupport.nintendo.com.', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};