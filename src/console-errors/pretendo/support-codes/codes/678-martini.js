const SupportCode = require('../../../common/support-code');

module.exports = {
	'1000': new SupportCode('678-1000', 'Juxtapostion has been installed successfully', null, 'N/A', null),
	'1001': new SupportCode('678-1001', 'MCP failure, may be caused by HaxchiFW', null, 'Restart your console', null),
	'1002': new SupportCode('678-1002', 'Could not find Miiverse on your console', null, 'N/A', null),
	'1003': new SupportCode('678-1003', 'No compatable CFW found', null, 'Please have Mocha running before opening Martini', null),
	'1004': new SupportCode('678-1004', 'Failed to mount IOSU', null, 'Restart your console', null),
	'1005': new SupportCode('678-1005', 'Could not find a clean version of Miiverse applet or recovery files', null, 'N/A', null),
	'1006': new SupportCode('678-1006', 'Could not find a clean version of NSSL cert', null, 'N/A', null),
	'1007': new SupportCode('678-1007', 'Failed to create a backup', null, 'Try again?', null),
	'1008': new SupportCode('678-1008', 'Failed to patch Miiverse\nYour system has not been modified', null, 'Try running Martini again.', null),
	'1009': new SupportCode('678-1009', 'Patch Created a Corrupted File\nYour system has not been modified', null, 'Try running Martini again.', null),
	'1010': new SupportCode('678-1010', ':warning: Patch created a corrupted file\n**YOUR SYSTEM HAS BEEN MODIFIED AND MAY BE IN AN UNSTABLE STATE**', null, 'Contact a developer immediately.', null),
	'1011': new SupportCode('678-1011', ':warning: **PATCH HAS FAILED TO REPLACE CERT\nYOUR SYSTEM MAY HAVE BRICKED**', null, 'Contact a developer immediately.', null),
	'1012': new SupportCode('678-1012', 'Juxtapostion has been uninstalled successfully', null, 'N/A', null),
	'1013': new SupportCode('678-1013', 'Uninstalling failed', null, 'Try again?', null),
};