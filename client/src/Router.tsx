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
import Deck from "./components/Deck";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Layout />
          <TanStackRouterDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: Register,
  beforeLoad: () => {
    if (isAuth()) {
      throw redirect({ to: "/home" });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: Login,
  beforeLoad: () => {
    if (isAuth()) {
      throw redirect({ to: "/home" });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "home",
  component: Home,
  beforeLoad: () => {
    if (!isAuth()) {
      throw redirect({ to: "/login" });
    }
  },
});

// TODO: Make that better
const deckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "home/decks/$deckId",
  component: Deck,
  beforeLoad: () => {
    if (!isAuth()) {
      throw redirect({ to: "/login" });
    }
  },
});

const routeTree = rootRoute.addChildren([
  registerRoute,
  loginRoute,
  homeRoute,
  deckRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function Router() {
  return <RouterProvider router={router} />;
}
