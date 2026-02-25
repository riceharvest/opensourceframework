import { storage } from "./utils"

export interface AuthResponse {
	user: User
	jwt: string
}

export interface User {
	id: string
	email: string
	name?: string
}

const GENERIC_API_ERROR_MESSAGE = "Request failed. Please try again."

async function parseJsonIfAvailable(response: Response): Promise<unknown> {
	const contentType = response.headers.get("content-type") ?? ""
	if (!contentType.toLowerCase().includes("application/json")) {
		return null
	}

	try {
		return await response.json()
	} catch {
		return null
	}
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
	const data = await parseJsonIfAvailable(response)

	if (response.ok) {
		return (data ?? {}) as T
	}

	throw new Error(GENERIC_API_ERROR_MESSAGE)
}

export function getUserProfile(): Promise<{ user: User | undefined }> {
	const token = storage.getToken()
	const headers = token ? { Authorization: token } : undefined

	return fetch("/auth/me", {
		headers,
	}).then((response) => handleApiResponse<{ user: User | undefined }>(response))
}

export function loginWithEmailAndPassword(data: unknown): Promise<AuthResponse> {
	return fetch("/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	}).then((response) => handleApiResponse<AuthResponse>(response))
}

export function registerWithEmailAndPassword(data: unknown): Promise<AuthResponse> {
	return fetch("/auth/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	}).then((response) => handleApiResponse<AuthResponse>(response))
}

export function logout(): Promise<{ message: string }> {
	return fetch("/auth/logout", { method: "POST" }).then((response) =>
		handleApiResponse<{ message: string }>(response)
	)
}
