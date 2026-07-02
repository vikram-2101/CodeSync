import Fastify from "fastify";
import cors from "@fastify/cors";

export async function createApp() {
  const app = Fastify({
    logger: true,
  });
  await app.register(cors, {
    origin: true,
    credentials: true,
  });
  app.get("/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  });
  return app;
}
