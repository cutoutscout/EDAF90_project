import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import Search from "./Search";
import Population from "./Population";
import SearchHistory from "./SearchHistory";

const routerConfig: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "sök",
        Component: Search,
      },
      {
        path: "Befolknings data",
        Component: Population,
      },
      {
        path: "sökningshistorik",
          Component: SearchHistory,
          /*children:[
            {
            path: "new/:uuid",
            Component: NewSaladInfobox,
            }

          ]*/
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
        <CardTitle>Välkommen till skånes befolknings prognos</CardTitle>
        <CardDescription>
          
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
