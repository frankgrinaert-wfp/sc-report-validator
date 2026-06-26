import { useState } from "react";
import { createBrowserRouter, Outlet } from "react-router";
import { Dashboard } from "@/components/Dashboard";
import { Navigation } from "@/components/navigation";
import { getCurrentSchoolYearValue } from "@/data/reportDashboard";

function RootLayout() {
  const [country, setCountry] = useState("gambia");
  const [schoolYear, setSchoolYear] = useState(getCurrentSchoolYearValue);

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation
        country={country}
        onCountryChange={setCountry}
        schoolYear={schoolYear}
        onSchoolYearChange={setSchoolYear}
      />
      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ country, schoolYear }} />
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
