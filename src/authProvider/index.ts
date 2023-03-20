import type { AuthBindings } from "@refinedev/core";
import * as cookie from "cookie";
import Cookies from "js-cookie";
// import { promiseTimeout } from '@arijs/frontend/isomorphic/utils/promise'
import dataProvider from "../dataProvider";

const COOKIE_NAME = "user";

export interface UserIdentity {
	access_token: string
	admin: Record<string, any>
}

const setCookieIdentity = (user: UserIdentity) => {
	Cookies.set(COOKIE_NAME, JSON.stringify(user));
}

const getCookieIdentity = (): UserIdentity | undefined => {
	const parsedCookie = Cookies.get(COOKIE_NAME);
	return parsedCookie ? JSON.parse(parsedCookie) : undefined;
}

const removeCookieIdentity = () => {
	Cookies.remove(COOKIE_NAME);
}

export const authProvider: AuthBindings = {
	login: async ({ email: username, password, remember }) => {
		// console.warn(`authProvider login:`, Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v).substring(0, 32)])))
		// Suppose we actually send a request to the back end here.
		// const user = mockUsers.find((item) => item.username === username);

		try {
			// console.warn(`authProvider login before request`);
			const result = await dataProvider.create({
				resource: 'auth/login',
				variables: {
					username,
					password,
				},
				meta: { noAuth: true },
			});
			// console.warn(`authProvider login result`, result);
			const { data: { access_token, admin } } = result;
			setCookieIdentity({ access_token, admin });
			return {
				success: true,
				redirectTo: "/",
			};
		} catch (error) {
			// console.warn(`authProvider login error`, error)
			return {
				success: false,
				// error: new Error("Invalid email or password"),
				error: error as Error,
			};
		}

	},
	logout: async () => {
		removeCookieIdentity();

		return {
			success: true,
			redirectTo: "/login",
		};
	},
	onError: async (error) => {
		console.error(error);
		return { error };
	},
	check: async (request) => {
		let user = undefined;
		if (request) {
			const hasCookie = request.headers.get("Cookie");
			if (hasCookie) {
				const parsedCookie = cookie.parse(request.headers.get("Cookie"));
				user = parsedCookie[COOKIE_NAME];
			}
		} else {
			user = getCookieIdentity();
		}

		const { pathname = undefined } = request ? new URL(request.url) : {};

		if (!user) {
			return {
				authenticated: false,
				error: new Error("Unauthenticated"),
				logout: true,
				redirectTo: `/login${pathname ? `?to=${pathname}` : ``}`,
			};
		}

		return {
			authenticated: true,
		};
	},
	getPermissions: async () => null,
	getIdentity: async () => getCookieIdentity() ?? null,
};
