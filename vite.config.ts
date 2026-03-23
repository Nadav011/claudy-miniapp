import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	server: {
		proxy: {
			"/api/proxy": {
				target: "http://100.87.247.87:18792",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/proxy/, ""),
			},
		},
	},
});
