import { createFileRoute } from "@tanstack/react-router";

// A server route: a raw HTTP endpoint that lives next to the pages. Handlers get
// the same data client as server functions. /api/apps and /api/app-logs are
// reserved by the hosting platform.
export const Route = createFileRoute("/api/time")({
  server: {
    handlers: {
      GET: async () => Response.json({ now: new Date().toISOString() }, { headers: { "cache-control": "no-store" } }),
    },
  },
});
