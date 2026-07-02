import { Server as HttpServer } from "node:http";

import { createDependencies } from "./dependencies";
import { registerSocketServer } from "@/socket/socket";

export function bootstrap(server: HttpServer) {
  const dependencies = createDependencies();

  registerSocketServer(server, dependencies);

  return dependencies;
}
