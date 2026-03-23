import { getRawInitData } from "@/lib/telegram";

// In production, API goes through Vercel serverless proxy (same origin, no PNA issues)
// In dev, Vite proxy handles it
const API_BASE = import.meta.env.VITE_API_URL || "/api/proxy";

interface FetchOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
}

export async function apiClient<T>(
	path: string,
	options: FetchOptions = {},
): Promise<T> {
	const { body, headers: customHeaders, ...rest } = options;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(customHeaders as Record<string, string>),
	};

	const initData = getRawInitData();
	if (initData) {
		headers["X-Telegram-Init-Data"] = initData;
	}

	const response = await fetch(`${API_BASE}${path}`, {
		...rest,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const errorText = await response.text().catch(() => "Unknown error");
		throw new Error(`API ${response.status}: ${errorText}`);
	}

	return response.json() as Promise<T>;
}
