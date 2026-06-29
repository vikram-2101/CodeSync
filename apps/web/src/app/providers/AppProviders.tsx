import type { PropsWithChildren } from "react";
import QueryProvider from "./QueryProvider";

type AppProvidersProps = PropsWithChildren;

export default function AppProviders({ children }: AppProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}
