import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/app/(landing)/page";
import RoomPage from "@/app/room/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/room/:roomId",
    element: <RoomPage />,
  },
]);
