const SupportCode = require('../../../common/support-code');

module.exports = {
	'0076': new SupportCode('Missing name', 'Missing description', 'The software data is corrupted.\n\nPlease go to Data Management in\nSystem Settings and view the data\nfor this software. Delete anything that\nshows "???" (excluding save data).', 'Missing fix', 'Missing link'),
	'0077': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0078': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0085': new SupportCode('Missing name', 'Missing description', 'The system memory or the USB\nstorage device is full.\n\nIn System Settings, select Data\nManagement ⇒ Copy/Move/Delete Data\nand delete any unnecessary data.', 'Missing fix', 'Missing link'),
	'0086': new SupportCode('Missing name', 'Missing description', 'The USB storage device is\nwrite-protected.\n\nPlease refer to the manual for the\ndevice and disable write-protection.', 'Missing fix', 'Missing link'),
	'0087': new SupportCode('Missing name', 'Missing description', 'The data is corrupted.\n\nPlease turn off the Wii U console\nand try again.\n\nIf the problem persists, please\nmake note of the error code\nand visit support.nintendo.com.', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'An error has occurred.\n\nPlease try again later.\n\nIf the problem persists, please\nmake a note of the error code\nand visit support.nintendo.com.', 'Missing fix', 'Missing link'),
};