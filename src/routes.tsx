import { createBrowserRouter } from "react-router";
import { Dashboard } from "@/components/Dashboard";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Dashboard,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
