const SupportCode = require('../../../common/support-code');

module.exports = {
	'1004': new SupportCode('SSL_CONNECT_ERROR', 'Missing description', 'SSL connection failed.', 'Missing fix', 'Missing link'),
	'1018': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1032': new SupportCode('UI_Reject_Content_Click', 'Missing description', 'This file cannot be loaded.', 'Missing fix', 'Missing link'),
	'1506': new SupportCode('SSLMOD_CERT_HAS_EXPIRED', 'Missing description', 'The certificate has expired.\n(Please check that date\nand time settings on your\nNintendo 3DS system\nare correct.)', 'Ensure your 3ds' rtc is correct', 'Missing link'),
	'1509': new SupportCode('SSLMOD_DEPTH_ZERO_SELF_SIGNED_CERT', 'Missing description', 'Self-signed certificates\ncannot be verified.', 'Missing fix', 'Missing link'),
	'1510': new SupportCode('SSLMOD_SELF_SIGNED_CERT_IN_CHAIN', 'Missing description', 'The certificate\nis self-signed.', 'Missing fix', 'Missing link'),
	'1511': new SupportCode('SSLMOD_UNABLE_TO_GET_ISSUER_CERT', 'Certificate Conflict', 'Certificate not found.', 'Uninstall rev.pem and reinstall nimbus', 'Missing link'),
};
