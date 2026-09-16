// ! Should ideally be part of https://github.com/PretendoNetwork/error-codes
// ! See PR https://github.com/PretendoNetwork/error-codes/pull/37
// ! (It has now been merged to dev but still not to master)

declare module '@pretendonetwork/error-codes' {
	export interface ModuleInfo {
		name: string;
		description: string;
		system: string;
	}

	export interface ErrorInfo {
		name: string;
		message: string;
		short_description: string;
		long_description: string;
		short_solution: string;
		long_solution: string;
		support_link: string;
		module: ModuleInfo;
	}

	export function getModuleInfo(sysmodule: string, locale: string): ModuleInfo | null;
	export function getErrorInfo(sysmodule: string, code: string, locale: string): ErrorInfo | null;
	export function getAllErrors(): string[];
}
