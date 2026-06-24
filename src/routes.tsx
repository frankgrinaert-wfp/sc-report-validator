import { createBrowserRouter, Outlet } from "react-router";
import { Dashboard } from "@/components/Dashboard";
import { Navigation } from "@/components/navigation";

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      Component: RootLayout,
      children: [
        {
          path: "/",
          Component: Dashboard,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
