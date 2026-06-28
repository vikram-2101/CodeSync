import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { routes } from "./routes";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: ["http://localhost:5173"],
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET ?? "dev-secret",
});

app.get("/", async () => ({ status: "ok", service: "codesync-backend" }));

await routes(app);

const port = Number(process.env.PORT ?? 4000);
await app.listen({ port, host: "0.0.0.0" });

console.log(`Backend running on http://localhost:${port}`);
