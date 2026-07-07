import type { PropsWithChildren } from "react";
import QueryProvider from "./QueryProvider";

import { SocketProvider } from "./socket";

type AppProvidersProps = PropsWithChildren;

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  );
}
