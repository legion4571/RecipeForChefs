import { createBrowserRouter } from "react-router";
import { CatalogPage } from "./pages/CatalogPage";
import { RecipePage } from "./pages/RecipePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: CatalogPage,
  },
  {
    path: "/recipe/:id",
    Component: RecipePage,
  },
]);
