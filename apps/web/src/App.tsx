import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import AppProviders from "@/app/providers/AppProviders";
// import './index.css'
import "./styles/globals.css";
const App = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
