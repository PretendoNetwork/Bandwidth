const SupportCode = require('../../../common/support-code');

module.exports = {
	'0102': new SupportCode('Core::Unknown', 'The reason for the error is unknown', 'Missing message', 'Missing fix', 'Missing link'),
	'0103': new SupportCode('Core::NotImplemented', 'The operation is currently not implemented', 'Missing message', 'Missing fix', 'Missing link'),
	'0104': new SupportCode('Core::InvalidPointer', '	The operation specifies or accesses an invalid pointer', 'Missing message', 'Missing fix', 'Missing link'),
	'0105': new SupportCode('Core::OperationAborted', 'The operation was aborted', 'Missing message', 'Missing fix', 'Missing link'),
	'0106': new SupportCode('Core::Exception', 'The operation raised an exception', 'Missing message', 'Missing fix', 'Missing link'),
	'0107': new SupportCode('Core::AccessDenied', 'An attempt was made to access data in an incorrect manner. This may be due to inadequate permission or the data, file, etc. not existing', 'Missing message', 'Missing fix', 'Missing link'),
	'0108': new SupportCode('Core::InvalidHandle', 'The operation specifies or accesses an invalid DOHandle', 'Missing message', 'Missing fix', 'Missing link'),
	'0109': new SupportCode('Core::InvalidIndex', 'The operation specifies or accesses an invalid index', 'Missing message', 'Missing fix', 'Missing link'),
	'0110': new SupportCode('Core::OutOfMemory', 'The system could not allocate or access enough memory or disk space to perform the specified operation', 'Missing message', 'Missing fix', 'Missing link'),
	'0111': new SupportCode('Core::InvalidArgument', 'Invalid argument were passed with the operation. The argument(s) may be out of range or invalid', 'Missing message', 'Missing fix', 'Missing link'),
	'0112': new SupportCode('Core::Timeout', 'The operation did not complete within the specified timeout for that operation', 'Missing message', 'Missing fix', 'Missing link'),
	'0113': new SupportCode('Core::InitializationFailure', 'Initialization of the component failed', 'Missing message', 'Missing fix', 'Missing link'),
	'0114': new SupportCode('Core::CallInitiationFailure', 'The call failed to initialize', 'Missing message', 'Missing fix', 'Missing link'),
	'0115': new SupportCode('Core::RegistrationError', 'An error occurred during registration', 'Missing message', 'Missing fix', 'Missing link'),
	'0116': new SupportCode('Core::BufferOverflow', 'The buffer is too large to be sent', 'Missing message', 'Missing fix', 'Missing link'),
	'0117': new SupportCode('Core::InvalidLockState', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0118': new SupportCode('Core::InvalidSequence', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0119': new SupportCode('Core::SystemError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0120': new SupportCode('Core::Cancelled', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0301': new SupportCode('RendezVous::ConnectionFailure', 'Connection was unable to be established, either with the Rendez-Vous back end or a Peer', 'Missing message', 'Missing fix', 'Missing link'),
	'0302': new SupportCode('RendezVous::NotAuthenticated', 'The Principal could not be authenticated by the Authentication Service', 'Unable to connect to the server.\nPlease try again later.\n\nFor help, visit support.nintendo.com', 'Missing fix', 'Missing link'),
	'0303': new SupportCode('RendezVous::InvalidUsername', 'The Principal tried to log in with an invalid user name, i.e. the user name does not exist in the database', 'Missing message', 'Missing fix', 'Missing link'),
	'0304': new SupportCode('RendezVous::InvalidPassword', 'The Principal either tried to log in with an invalid password for the provided user name or tried to join a Gathering with an invalid password', 'Missing message', 'Missing fix', 'Missing link'),
	'0305': new SupportCode('RendezVous::UsernameAlreadyExists', 'The provided user name already exists in the database. All usernames must be unique', 'Missing message', 'Missing fix', 'Missing link'),
	'0306': new SupportCode('RendezVous::AccountDisabled', '	The Principal\'s account still exists in the database but the account has been disabled', 'Missing message', 'Missing fix', 'Missing link'),
	'0307': new SupportCode('RendezVous::AccountExpired', 'The Principal\'s account still exists in the database but the account has expired', 'Missing message', 'Missing fix', 'Missing link'),
	'0308': new SupportCode('RendezVous::ConcurrentLoginDenied', 'The Principal does not have the capabilities to perform concurrent logins, i.e. at any given time only one log-in may be maintained', 'Missing message', 'Missing fix', 'Missing link'),
	'0309': new SupportCode('RendezVous::EncryptionFailure', 'Data encryption failed', 'Missing message', 'Missing fix', 'Missing link'),
	'0310': new SupportCode('RendezVous::InvalidPID', 'The operation specifies or accesses an invalid PrincipalID', 'Missing message', 'Missing fix', 'Missing link'),
	'0311': new SupportCode('RendezVous::MaxConnectionsReached', 'Maximum connnection number is reached', 'Unable to connect to the server.\n\nPlease try again later', 'Missing fix', 'Missing link'),
	'0312': new SupportCode('RendezVous::InvalidGID', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0313': new SupportCode('RendezVous::InvalidControlScriptID', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0314': new SupportCode('RendezVous::InvalidOperationInLiveEnvironment', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0315': new SupportCode('RendezVous::DuplicateEntry', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0316': new SupportCode('RendezVous::ControlScriptFailure', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0317': new SupportCode('RendezVous::ClassNotFound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0318': new SupportCode('RendezVous::SessionVoid', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0320': new SupportCode('RendezVous::DDLMismatch', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0321': new SupportCode('RendezVous::InvalidConfiguration', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0322': new SupportCode('RendezVous::SessionFull', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0323': new SupportCode('RendezVous::InvalidGatheringPassword', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0324': new SupportCode('RendezVous::WithoutParticipationPeriod', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0325': new SupportCode('RendezVous::PersistentGatheringCreationMax', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0326': new SupportCode('RendezVous::PersistentGatheringParticipationMax', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0327': new SupportCode('RendezVous::DeniedByParticipants', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0328': new SupportCode('RendezVous::ParticipantInBlackList', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0329': new SupportCode('RendezVous::GameServerMaintenance', 'Missing description', 'The server is currently undergoing\nmaintenance. We apologize for any\ninconvenience. Please try again later.\n\nTo learn more about maintenance,\nvisit support.nintendo.com', 'Missing fix', 'Missing link'),
	'0330': new SupportCode('RendezVous::OperationPostpone', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0331': new SupportCode('RendezVous::OutOfRatingRange', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0332': new SupportCode('RendezVous::ConnectionDisconnected', 'Missing description', 'A communication error has occurred.\n\nThere may be problems with the network\nor the environment. Please try again\nlater', 'Missing fix', 'Missing link'),
	'0333': new SupportCode('RendezVous::InvalidOperation', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0334': new SupportCode('RendezVous::NotParticipatedGathering', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0335': new SupportCode('RendezVous::MatchmakeSessionUserPasswordUnmatch', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0336': new SupportCode('RendezVous::MatchmakeSessionSystemPasswordUnmatch', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0337': new SupportCode('RendezVous::UserIsOffline', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0338': new SupportCode('RendezVous::AlreadyParticipatedGathering', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0339': new SupportCode('RendezVous::PermissionDenied', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0340': new SupportCode('RendezVous::NotFriend', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0341': new SupportCode('RendezVous::SessionClosed', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0342': new SupportCode('RendezVous::DatabaseTemporarilyUnavailable', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0343': new SupportCode('RendezVous::InvalidUniqueId', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0344': new SupportCode('RendezVous::MatchmakingWithdrawn', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0345': new SupportCode('RendezVous::LimitExceeded', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0346': new SupportCode('RendezVous::AccountTemporarilyDisabled', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0347': new SupportCode('RendezVous::PartiallyServiceClosed', 'Missing description', 'This online service has ended.\n\nFor details, please refer to the official\nwebsite for this software', 'Missing fix', 'Missing link'),
	'0348': new SupportCode('RendezVous::ConnectionDisconnectedForConcurrentLogin', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0401': new SupportCode('PythonCore::Exception', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0402': new SupportCode('PythonCore::TypeError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0403': new SupportCode('PythonCore::IndexError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0404': new SupportCode('PythonCore::InvalidReference', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0405': new SupportCode('PythonCore::CallFailure', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0406': new SupportCode('PythonCore::MemoryError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0407': new SupportCode('PythonCore::KeyError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0408': new SupportCode('PythonCore::OperationError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0409': new SupportCode('PythonCore::ConversionError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0410': new SupportCode('PythonCore::ValidationError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0501': new SupportCode('Transport::Unknown', 'The reason for the error is unknown', 'Missing message', 'Missing fix', 'Missing link'),
	'0502': new SupportCode('Transport::ConnectionFailure', 'Network connection was unable to be established', 'Missing message', 'Missing fix', 'Missing link'),
	'0503': new SupportCode('Transport::InvalidUrl', 'The URL contained in the StationURL is invalid. The syntax may be incorrect', 'Missing message', 'Missing fix', 'Missing link'),
	'0504': new SupportCode('Transport::InvalidKey', 'The key used to authenticate a given station is invalid. The secure transport layer uses secret-key based cryptography to ensure the integrity and confidentiality of data sent across the network', 'Missing message', 'Missing fix', 'Missing link'),
	'0505': new SupportCode('Transport::InvalidURLType', 'The specified transport type is invalid', 'Missing message', 'Missing fix', 'Missing link'),
	'0506': new SupportCode('Transport::DuplicateEndpoint', 'The Station is already connected via another EndPoint', 'Missing message', 'Missing fix', 'Missing link'),
	'0507': new SupportCode('Transport::IOError', 'The data could not be sent across the network. This could be due to an invalid message, packet, or buffer', 'Missing message', 'Missing fix', 'Missing link'),
	'0508': new SupportCode('Transport::Timeout', 'The operation did not complete within the specified timeout for that operation', 'Missing message', 'Missing fix', 'Missing link'),
	'0509': new SupportCode('Transport::ConnectionReset', 'The network connection was reset', 'Missing message', 'Missing fix', 'Missing link'),
	'0510': new SupportCode('Transport::IncorrectRemoteAuthentication', 'The destination Station did not authenticate itself properly', 'Missing message', 'Missing fix', 'Missing link'),
	'0511': new SupportCode('Transport::ServerRequestError', '3rd-party server or device answered with an error code according to protocol used e.g. HTTP error code', 'Missing message', 'Missing fix', 'Missing link'),
	'0512': new SupportCode('Transport::DecompressionFailure', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0513': new SupportCode('Transport::ReliableSendBufferFullFatal', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0514': new SupportCode('Transport::UPnPCannotInit', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0515': new SupportCode('Transport::UPnPCannotAddMapping', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0516': new SupportCode('Transport::NatPMPCannotInit', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0517': new SupportCode('Transport::NatPMPCannotAddMapping', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0519': new SupportCode('Transport::UnsupportedNAT', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0520': new SupportCode('Transport::DnsError', 'Missing description', 'Could not connect to the Internet.\n\nThe network may be busy, or there\nmay be problems with the connection\nenvironment. To ensure an optimal\nconnection environment, move closer\nto the access point and make sure that\nthere are no obstructions between\nthe system and the access point.\nIf this does not work, please try\nagain later.\n\n■ Check that your computer can\nconnect to the Internet using the same\nsettings. If not, refer to the instruction\nbooklet that came with your\naccess point.\n\n■ The DNS setting may have been \nentered incorrectly. Check the setting \nin System Settings ⇒ Internet \nSettings.\n\n■ The proxy server may have been\nentered incorrectly. Check the setting\nin System Settings ⇒ Internet \nSettings', 'Missing fix', 'Missing link'),
	'0521': new SupportCode('Transport::ProxyError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0522': new SupportCode('Transport::DataRemaining', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0523': new SupportCode('Transport::NoBuffer', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0524': new SupportCode('Transport::NotFound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0525': new SupportCode('Transport::TemporaryServerError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0526': new SupportCode('Transport::PermanentServerError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0527': new SupportCode('Transport::ServiceUnavailable', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0528': new SupportCode('Transport::ReliableSendBufferFull', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0529': new SupportCode('Transport::InvalidStation', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0530': new SupportCode('Transport::InvalidSubStreamID', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0531': new SupportCode('Transport::PacketBufferFull', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0532': new SupportCode('Transport::NatTraversalError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0533': new SupportCode('Transport::NatCheckError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0602': new SupportCode('DOCore::StationNotReached', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0603': new SupportCode('DOCore::TargetStationDisconnect', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0604': new SupportCode('DOCore::LocalStationLeaving', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0605': new SupportCode('DOCore::ObjectNotFound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0606': new SupportCode('DOCore::InvalidRole', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0607': new SupportCode('DOCore::CallTimeout', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0608': new SupportCode('DOCore::RMCDispatchFailed', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0609': new SupportCode('DOCore::MigrationInProgress', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0610': new SupportCode('DOCore::NoAuthority', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0611': new SupportCode('DOCore::NoTargetStationSpecified', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0612': new SupportCode('DOCore::JoinFailed', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0613': new SupportCode('DOCore::JoinDenied', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0614': new SupportCode('DOCore::ConnectivityTestFailed', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0615': new SupportCode('DOCore::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0616': new SupportCode('DOCore::UnfreedReferences', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0617': new SupportCode('DOCore::JobTerminationFailed', 'Missing description', 'An error has occurred.\nTurn off the power and try again.\n\nFor help, visit support.nintendo.com', 'Missing fix', 'Missing link'),
	'0618': new SupportCode('DOCore::InvalidState', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0619': new SupportCode('DOCore::FaultRecoveryFatal', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0620': new SupportCode('DOCore::FaultRecoveryJobProcessFailed', 'Missing description', 'A communication error has occurred.\n\nThere may be problems with the network\nor the environment. Please try again\nlater', 'Missing fix', 'Missing link'),
	'0621': new SupportCode('DOCore::StationInconsitency', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0622': new SupportCode('DOCore::AbnormalMasterState', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0623': new SupportCode('DOCore::VersionMismatch', 'Missing description', 'A communication error has occurred.\n\nIn order to use online services, a newer\nversion of this software is required.\n\nDownload the newest version of this\nsoftware from Nintendo eShop or other\nsupported software', 'Missing fix', 'Missing link'),
	'0702': new SupportCode('FPD::NotInitialized', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0703': new SupportCode('FPD::AlreadyInitialized', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0704': new SupportCode('FPD::NotConnected', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0705': new SupportCode('FPD::Connected', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0706': new SupportCode('FPD::InitializationFailure', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0707': new SupportCode('FPD::OutOfMemory', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0708': new SupportCode('FPD::RmcFailed', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0709': new SupportCode('FPD::InvalidArgument', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0710': new SupportCode('FPD::InvalidLocalAccountID', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0711': new SupportCode('FPD::InvalidPrincipalID', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0712': new SupportCode('FPD::InvalidLocalFriendCode', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0713': new SupportCode('FPD::LocalAccountNotExists', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0714': new SupportCode('FPD::LocalAccountNotLoaded', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0715': new SupportCode('FPD::LocalAccountAlreadyLoaded', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0716': new SupportCode('FPD::FriendAlreadyExists', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0717': new SupportCode('FPD::FriendNotExists', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0718': new SupportCode('FPD::FriendNumMax', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0719': new SupportCode('FPD::NotFriend', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0720': new SupportCode('FPD::FileIO', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0721': new SupportCode('FPD::P2PInternetProhibited', 'Missing description', 'Online Interaction is restricted by\nParental Controls', 'Missing fix', 'Missing link'),
	'0722': new SupportCode('FPD::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0801': new SupportCode('Authentication::NASAuthenticateError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0802': new SupportCode('Authentication::TokenParseError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0803': new SupportCode('Authentication::HttpConnectionError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0804': new SupportCode('Authentication::HttpDNSError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0805': new SupportCode('Authentication::HttpGetProxySetting', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0806': new SupportCode('Authentication::TokenExpired', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0807': new SupportCode('Authentication::ValidationFailed', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0808': new SupportCode('Authentication::InvalidParam', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0809': new SupportCode('Authentication::PrincipalIdUnmatched', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0810': new SupportCode('Authentication::MoveCountUnmatch', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0811': new SupportCode('Authentication::UnderMaintenance', 'Missing description', 'The server is currently undergoing\nmaintenance. We apologize for any\ninconvenience. Please try again later.\n\nTo learn more about maintenance,\nvisit support.nintendo.com', 'Missing fix', 'Missing link'),
	'0812': new SupportCode('Authentication::UnsupportedVersion', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0813': new SupportCode('Authentication::ServerVersionIsOld', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0814': new SupportCode('Authentication::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0815': new SupportCode('Authentication::ClientVersionIsOld', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0816': new SupportCode('Authentication::AccountLibraryError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0817': new SupportCode('Authentication::ServiceNoLongerAvailable', 'Missing description', 'This online service is no longer available.\n\nThank you for your continued interest', 'Missing fix', 'Missing link'),
	'0818': new SupportCode('Authentication::UnknownApplication', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0819': new SupportCode('Authentication::ApplicationVersionIsOld', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0820': new SupportCode('Authentication::OutOfService', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0821': new SupportCode('Authentication::NetworkServiceLicenseRequired', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0822': new SupportCode('Authentication::NetworkServiceLicenseSystemError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0823': new SupportCode('Authentication::NetworkServiceLicenseError3', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0824': new SupportCode('Authentication::NetworkServiceLicenseError4', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'0899': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1101': new SupportCode('Ranking::NotInitialized', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1102': new SupportCode('Ranking::InvalidArgument', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1103': new SupportCode('Ranking::RegistrationError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1105': new SupportCode('Ranking::NotFound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1106': new SupportCode('Ranking::InvalidScore', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1107': new SupportCode('Ranking::InvalidDataSize', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1109': new SupportCode('Ranking::PermissionDenied', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1110': new SupportCode('Ranking::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1111': new SupportCode('Ranking::NotImplemented', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1201': new SupportCode('DataStore::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1202': new SupportCode('DataStore::InvalidArgument', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1203': new SupportCode('DataStore::PermissionDenied', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1204': new SupportCode('DataStore::NotFound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1205': new SupportCode('DataStore::AlreadyLocked', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1206': new SupportCode('DataStore::UnderReviewing', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1207': new SupportCode('DataStore::Expired', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1208': new SupportCode('DataStore::InvalidCheckToken', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1209': new SupportCode('DataStore::SystemFileError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1210': new SupportCode('DataStore::OverCapacity', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1211': new SupportCode('DataStore::OperationNotAllowed', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1212': new SupportCode('DataStore::InvalidPassword', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1213': new SupportCode('DataStore::ValueNotEqual', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1500': new SupportCode('ServiceItem::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1501': new SupportCode('ServiceItem::InvalidArgument', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1502': new SupportCode('ServiceItem::EShopUnknownHttpError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1503': new SupportCode('ServiceItem::EShopResponseParseError', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1504': new SupportCode('ServiceItem::NotOwned', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1505': new SupportCode('ServiceItem::InvalidLimitationType', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1506': new SupportCode('ServiceItem::ConsumptionRightShortage', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1801': new SupportCode('MatchmakeReferee::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1802': new SupportCode('MatchmakeReferee::InvalidArgument', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1803': new SupportCode('MatchmakeReferee::AlreadyExists', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1804': new SupportCode('MatchmakeReferee::NotParticipatedGathering', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1805': new SupportCode('MatchmakeReferee::NotParticipatedRound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1806': new SupportCode('MatchmakeReferee::StatsNotFound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1807': new SupportCode('MatchmakeReferee::RoundNotFound', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1808': new SupportCode('MatchmakeReferee::RoundArbitrated', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1901': new SupportCode('Subscriber::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1902': new SupportCode('Subscriber::InvalidArgument', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1903': new SupportCode('Subscriber::OverLimit', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1904': new SupportCode('Subscriber::PermissionDenied', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'1999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'2001': new SupportCode('Ranking2::Unknown', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'2002': new SupportCode('Ranking2::InvalidArgument', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'2003': new SupportCode('Ranking2::InvalidScore', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
	'9999': new SupportCode('Missing name', 'Missing description', 'Missing message', 'Missing fix', 'Missing link'),
};