import type { VercelRequest, VercelResponse } from "@vercel/node";

const API_TARGET =
	process.env.OPENCLAW_API_URL || "https://msi.tailda1373.ts.net:8443";
const API_TOKEN = process.env.OPENCLAW_API_TOKEN || "";
const ALLOWED_ORIGINS = [
	"https://claudy-miniapp.vercel.app",
	"http://localhost:5173",
];

function getCorsOrigin(req: VercelRequest): string {
	const origin = req.headers.origin ?? "";
	return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const corsOrigin = getCorsOrigin(req);

	if (req.method === "OPTIONS") {
		res.setHeader("Access-Control-Allow-Origin", corsOrigin);
		res.setHeader(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, PATCH, DELETE, OPTIONS",
		);
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Vary", "Origin");
		return res.status(204).end();
	}

	const path = (req.query.path as string[] | undefined)?.join("/") || "";
	const targetUrl = `${API_TARGET}/${path}`;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (API_TOKEN) {
		headers["Authorization"] = `Bearer ${API_TOKEN}`;
	}

	try {
		const response = await fetch(targetUrl, {
			method: req.method || "GET",
			headers,
			body:
				req.method !== "GET" && req.method !== "HEAD"
					? JSON.stringify(req.body)
					: undefined,
		});

		const data = await response.text();

		res.setHeader("Access-Control-Allow-Origin", corsOrigin);
		res.setHeader("Vary", "Origin");
		res.setHeader("Cache-Control", "no-store");

		res.status(response.status).send(data);
	} catch {
		res.status(502).json({ error: "API proxy failed" });
	}
}
