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
import Decks from "./pages/Decks";
import Layout from "./components/layouts/Layout";
import { ThemeProvider } from "./contexts/theme/ThemeProvider";
import Deck from "./pages/Deck";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CreateDeck from "./pages/CreateDeck";
import DecksLayout from "./components/layouts/DecksLayout";
import EditDeck from "./pages/EditDeck";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        {" "}
        <Layout />
        <ReactQueryDevtools />
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: Register,
  beforeLoad: () => {
    if (isAuth()) {
      throw redirect({ to: "/decks" });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: Login,
  beforeLoad: () => {
    if (isAuth()) {
      throw redirect({ to: "/decks" });
    }
  },
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});

const decksIndexRoute = createRoute({
  getParentRoute: () => decksRoute,
  path: "/",
  component: Decks,
  beforeLoad: () => {
    if (!isAuth()) {
      throw redirect({ to: "/login" });
    }
  },
});

const decksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/decks",
  component: DecksLayout,
});

const deckRoute = createRoute({
  getParentRoute: () => decksRoute,
  path: "$deckId",
  component: Deck,
  beforeLoad: () => {
    if (!isAuth()) {
      throw redirect({ to: "/login" });
    }
  },
});

const newDeckRoute = createRoute({
  getParentRoute: () => decksRoute,
  path: "new",
  component: CreateDeck,
  beforeLoad: () => {
    if (!isAuth()) {
      throw redirect({ to: "/login" });
    }
  },
});

const editDeckRoute = createRoute({
  getParentRoute: () => decksRoute,
  path: "$deckId/edit",
  component: EditDeck,
  beforeLoad: () => {
    if (!isAuth()) {
      throw redirect({ to: "/login" });
    }
  },
});

const routeTree = rootRoute.addChildren([
  registerRoute,
  loginRoute,
  landingRoute,
  decksRoute.addChildren([
    decksIndexRoute,
    deckRoute,
    editDeckRoute,
    newDeckRoute,
  ]),
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
