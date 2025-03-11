const SupportCode = require('../../../common/support-code');

module.exports = {
	'0101': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0102': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0103': new SupportCode('Missing name', 'MLC corruption error', 'There is a problem with the system memory.\n\nFor help, make a note of the error code and visit\nsupport.nintendo.com', 'Usually happens on 32GB Wii U models having a Hynix chip,\nthis chip has a problem that slowly corrupts its data overtime,\nthere is nothing much to do except backing up the MLC\nand replacing the Hynix chip entierly.', 'https://github.com/GaryOderNichts/WiiUIdent'),
	'0104': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0105': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'2706': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'2713': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};
