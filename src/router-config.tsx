import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import ComposeSalad from "./compose-salad";
import ViewCart,{NewSaladInfobox} from "./view-cart";

const routerConfig: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
      path: "compose-salad",
      Component: ComposeSalad,
    },
    {
      path: "view-cart",
        Component: ViewCart,
        children:[
          {
          path: "new/:uuid",
          Component: NewSaladInfobox,
          }

        ]
    },
    {
      path: "*",
      Component: PageNotFound,
    },
    ],
  },
];

function Home() {
  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Välkommen till min salladsbar</CardTitle>
        <CardDescription>
          Här kan du komponera och beställa sallader.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function PageNotFound() {
  return <h2>Page not found</h2>;
}


const router = createBrowserRouter(routerConfig);

export default router;
