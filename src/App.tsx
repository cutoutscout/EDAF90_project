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

const initialCart = [
  new Salad()
    .add("Sallad", inventory["Sallad"])
    .add("Kycklingfilé", inventory["Kycklingfilé"])
    .add("Bacon", inventory["Bacon"])
    .add("Krutonger", inventory["Krutonger"])
    .add("Parmesan", inventory["Parmesan"])
    .add("Ceasardressing", inventory["Ceasardressing"])
    .add("Gurka", inventory["Gurka"]),
  new Salad()
    .add("Sallad + Quinoa", inventory["Sallad + Quinoa"])
    .add("Kycklingfilé", inventory["Kycklingfilé"])
    .add("Cashewnötter", inventory["Cashewnötter"])
    .add("Fetaost", inventory["Fetaost"])
    .add("Sojabönor", inventory["Sojabönor"])
    .add("Ceasardressing", inventory["Ceasardressing"]),
  new Salad()
    .add("Sallad", inventory["Sallad"])
    .add("Marinerad bönmix", inventory["Marinerad bönmix"])
    .add("Avocado", inventory["Avocado"])
    .add("Lime", inventory["Lime"])
    .add("Örtvinägrett", inventory["Örtvinägrett"]),
];

function App() {
  const [cart, setCart] = useState<Salad[]>(initialCart);

  function addSalad(newSalad: Salad){
    setCart([...cart,newSalad]);
  }

  return (
    <div>
      <h1 className="mb-6">
        Min egen salladsbar
      </h1>

      <NavigationMenu className="list-none">

        <NavigationMenuItem>
        <Link to="/" className={navigationMenuTriggerStyle()}>
        Hem 
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Link to="/compose-salad" className={navigationMenuTriggerStyle()}>
          Skapa sallad
        </Link>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <Link to="/view-cart" className={navigationMenuTriggerStyle()}>
          Varukorgen
        </Link>
      </NavigationMenuItem>


      </NavigationMenu>


      <Outlet
      context={{
        inventory,
        cart,
        addSalad,
      } satisfies OutletContextType
    }
    />
    </div>
  );
}

export default App;
