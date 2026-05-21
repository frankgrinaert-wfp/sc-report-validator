import { createBrowserRouter } from "react-router";
import { Dashboard } from "@/components/Dashboard";
import { SchoolDetail } from "@/components/SchoolDetail";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Dashboard,
    },
    {
      path: "/school/:schoolId",
      Component: SchoolDetail,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
