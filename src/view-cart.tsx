import { Button } from "./components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { CircleCheckIcon } from "lucide-react";
import { useOutletContext, useParams,Outlet } from "react-router";
import type { OutletContextType } from "./App";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function NewSaladInfobox(){

  const {cart} = useOutletContext<OutletContextType>();
  const {uuid} = useParams<{uuid:string }>();

  const salad = cart.find((s) => s.uuid === uuid);

  if(!salad){
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Felaktigt url</AlertTitle>
        <AlertDescription>
          Det finns ingen sallad med id {uuid} i varukorgen.
        </AlertDescription>
      </Alert>
    );
  }


  return(
    <Alert className="mb-4">
      <AlertTitle >
        En ny sallad har lagts till i varukorgen
      </AlertTitle>
      <AlertDescription >
        {Object.keys(salad.ingredients).join(", ")} .Den kostar ({salad.price()} kr).
      </AlertDescription>
    </Alert>
  );
}



//type PropsType = { cart: Salad[] };
function ViewCart() {

  const {cart} = useOutletContext<OutletContextType>();
  const {uuid} = useParams<{uuid:string }>();

  return (
    <>
      <Card className="w-full p-3">
        {cardHead}
        <CardContent>
          <Outlet context={{cart} satisfies Partial<OutletContextType>} />
          <Table>
            {tableHead}
            <TableBody>
              {cart.map((salad,index)=>{
                const info=salad.info();
                const New=salad.uuid==uuid;

                return(
                  <TableRow key={salad.uuid||index}>
                    <TableCell className="font-normal">
                      {Object.keys(salad.ingredients).join(", ")}
                      {New && <Badge variant="default" className="bg-emerald-600">Ny</Badge>}
                    </TableCell>

                    <TableCell>
                      {info.vegan && (
                        <div>
                      <CircleCheckIcon className="m-auto text-primary" />
                      </div>                    )}
                     </TableCell>

                    <TableCell>
                      {info.lactose && (
                        <div>
                      <CircleCheckIcon className="m-auto text-primary" />
                      </div>
                    )}
                    </TableCell>

                    <TableCell>
                    {info.gluten && (
                        <div>
                      <CircleCheckIcon className="m-auto text-primary" />
                      </div>                    )}
                  </TableCell>

                  <TableCell className="text-right font-normal tabular-nums">
                  {salad.price()} kr
                  </TableCell>


                  </TableRow>
                );
              })}
              </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Totalt</TableCell>
                <TableCell className="text-right tabular-nums">
                  {cart.reduce((sum, salad) => sum + salad.price(), 0)} kr
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

/*
 * static content, rendered when the file is loaded.
 */
const orderButton = (
  <AlertDialog>
    <AlertDialogTrigger render={<Button>Skicka beställningen</Button>} />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Under utveckling</AlertDialogTitle>
        <AlertDialogDescription>
          Denna funktion implementeras under labb 4.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
const tableHead = (
  <TableHeader>
    <TableRow>
      <TableHead className="font-semibold">Ingredienser</TableHead>
      <TableHead className="text-center font-semibold">Vegan</TableHead>
      <TableHead className="text-center font-semibold">Lactose</TableHead>
      <TableHead className="text-center font-semibold">Gluten</TableHead>
      <TableHead className="text-right font-semibold">Pris</TableHead>
    </TableRow>
  </TableHeader>
);
const cardHead = (
  <CardHeader>
    <CardTitle>Varukorgen</CardTitle>
    <CardDescription>Här listas alla sallader du skapat.</CardDescription>
    <CardAction>{orderButton}</CardAction>
  </CardHeader>
);
export default ViewCart;
