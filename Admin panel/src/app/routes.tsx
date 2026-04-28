import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./components/Dashboard";
import { Events } from "./components/Events";
import { CreateEvent } from "./components/CreateEvent";
import { EventDetail } from "./components/EventDetail";
import { EditEvent } from "./components/EditEvent";
import { Settings } from "./components/Settings";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "events", Component: Events },
      { path: "create-event", Component: CreateEvent },
      { path: "events/:id", Component: EventDetail },
      { path: "events/:id/edit", Component: EditEvent },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);