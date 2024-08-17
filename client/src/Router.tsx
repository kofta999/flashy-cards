import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { isAuth } from "./services/authService";
import Home from "./pages/Home";
import Layout from "./Layout";
import { ThemeProvider } from "./contexts/theme/ThemeProvider";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
  beforeLoad: () => {
    if (isAuth()) {
      throw redirect({ to: "/home" });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
  beforeLoad: () => {
    if (isAuth()) {
      throw redirect({ to: "/home" });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: Home,
  beforeLoad: () => {
    if (!isAuth()) {
      throw redirect({ to: "/login" });
    }
  },
});

const routeTree = rootRoute.addChildren([registerRoute, loginRoute, homeRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function Router() {
  return <RouterProvider router={router} />;
}
