import { useState } from "react";
import { Link, Outlet } from "react-router";

import { inventory, type Inventory } from "@/inventory";
import { Salad } from "@/salad";

import {
  NavigationMenu,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";


export type OutletContextType ={
  inventory: Inventory;
  cart: Salad[];
  addSalad:(newSalad: Salad) => void;
};


function App() {

  return (
    <div>
      <h1 className="mb-6">
        Skånes befolkningsprognos
      </h1>

      <NavigationMenu className="list-none">

        <NavigationMenuItem>
        <Link to="/" className={navigationMenuTriggerStyle()}>
        Hem 
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Link to="/Search" className={navigationMenuTriggerStyle()}>
          Sök
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Link to="/SearchHistory" className={navigationMenuTriggerStyle()}>
          Sökningshistorik
        </Link>
      </NavigationMenuItem>

       <NavigationMenuItem>
        <Link to="/Population" className={navigationMenuTriggerStyle()}>
          Befolknings data
        </Link>
      </NavigationMenuItem>


      </NavigationMenu>

    </div>
  );
}

export default App;
