"use client"
import { adminClient, jwtClient, phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	basePath: '/api/v1/auth',
	plugins: [
        adminClient(), 
        jwtClient(),
        phoneNumberClient(),
    ],
	fetchOptions: {
		headers: {
			'x-client-type': 'desktop'
		}
	}
});


export const {
	admin,
	signIn,
	phoneNumber, 
	signOut, 
	signUp, 
	useSession, 
	getSession, 
	$Infer, 
	updateUser, 
	deleteUser, 
	token,
	forgetPassword,
	resetPassword
} = authClient;