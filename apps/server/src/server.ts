// import {createServer} from 'node:http';
// import {createApp} from './app';

// async function bootstrap(){
//   const app = await createApp();
//   const httpServer = createServer(app.server);
//   const PORT = Number(process.env.PORT) || 3000;

//   httpServer.listen(PORT, () => {
//     app.log.info(`Server is running on http://localhost:${PORT}`);
//   });
// }
// bootstrap().catch((err) => {
//   console.error(err);
//   process.exit(1);
// })

// import {createApp} from './app';

// async function bootstrap(){
//   const app = await createApp();
//   const PORT = Number(process.env.PORT) || 3000;
//   await app.listen({
//     port: PORT,
//     host: "0.0.0.0",
//   });
//   app.log.info(`Server running on http://localhost:${PORT}`);
// }

// bootstrap().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
import { createApp } from "./app";
import { createServer } from "node:http";
import { bootstrap } from "./bootstrap";

async function bootstrapServer() {
  const app = await createApp();
  const server = createServer(app.server);
  const PORT = Number(process.env.PORT) || 3000;
  bootstrap(server);
  server.listen(PORT, () => {
    app.log.info(`Server running on http://localhost:${PORT}`);
  });
}

bootstrapServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
