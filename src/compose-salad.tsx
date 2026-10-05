import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IngredientType, PartialInventory } from "@/inventory";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Salad } from "./salad";

import { useOutletContext, useNavigate } from "react-router";
import type { OutletContextType } from "./App";
import { useId } from "react";


type SelectOption = {
  label: string;
  value: string;
};
/**
 * @returns an array with all names of ingridients with the given @type
 */
function makeOptions(
  type: IngredientType,
  inventory: OutletContextType["inventory"]
): SelectOption[] {
  return Object.keys(inventory)
    .filter((name) => inventory[name].type === type)
    .map((name) => ({
      value: name,
      label: `${name}, ${inventory[name].price} kr`,
    }));
}

function ComposeSalad() {

  const { inventory, addSalad } = useOutletContext<OutletContextType>();
  const navigate =useNavigate();

  const [foundation, setFoundation] = useState<SelectOption | null>(null);
  const [protein, setProtein] = useState<SelectOption | null>(null);
  const [extra, setExtra] = useState<PartialInventory>({});
  const [dressing, setDressing] = useState<SelectOption | null>(null);

  const [showError, setShowError] = useState(false);

  const foundationOptions = makeOptions("foundation", inventory);
  const proteinOptions = makeOptions("protein", inventory);
  const extraOptions = makeOptions("extra", inventory);
  const dressingOptions = makeOptions("dressing", inventory);

  const extraCount = Object.keys(extra).length;
  const isExtraInvalid = showError && extraCount <2;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setShowError(true);

    let newSalad = new Salad(); 

    if(!foundation || !protein || extraCount<2 ||!dressing){
      return;
    }

    if (foundation) {
      newSalad = newSalad.add(foundation.value, inventory[foundation.value]);
    }
    if (protein) {
      newSalad = newSalad.add(protein.value, inventory[protein.value]);
    }

    Object.keys(extra).forEach((key) => {
      newSalad = newSalad.add(key, extra[key]);
    });

    if (dressing) {
      newSalad = newSalad.add(dressing.value, inventory[dressing.value]);
    }

    addSalad(newSalad);

    console.log("Sumbitting salad",newSalad)

    setFoundation(null);
    setProtein(null);
    setExtra({});
    setDressing(null);
    setShowError(false);

    navigate(`/view-cart/new/${newSalad.uuid}`);

}

  return (

    <Card className="w-full p-3">
      <form onSubmit={handleSubmit} noValidate>
      <CardHeader>
        <CardTitle>Komponera en sallad</CardTitle>
        <CardDescription>
          Välj de ingredienser som ingår i salladen.
        </CardDescription>
      </CardHeader>

      <CardContent>
          <SelectIngredient
              label="Välj bas"
              value={foundation}
              options={foundationOptions}
              onValueChange={setFoundation}
              showError={showError}
              />
            vald bas: {foundation?.label}
      </CardContent>

      <CardContent>
          <SelectIngredient
              label="Välj protein"
              value={protein}
              options={proteinOptions}
              onValueChange={setProtein}
              showError={showError}
              />
            vald protein: {protein?.label}
      </CardContent>

      <fieldset className="mb-3 border border-border p-3 rounded-md">
        <legend className="text-base font-semibold px-1">
          Välj minst 2 extra ingredisenser
        </legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
        {extraOptions.map((option)=>(

          <div key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
            id={option.value}
            checked={!!extra[option.value]}
            onCheckedChange={(checked) => {
              if (checked) {
                setExtra({
                  ...extra,
                  [option.value]: inventory[option.value],
                });
              } else {
                const newExtra = { ...extra };
                delete newExtra[option.value];
                setExtra(newExtra);
              }
            }}
        />
        <Label
          htmlFor={option.value}
          className="text-sm front-normal cursor-pointer"
        >
          {option.label}
        </Label>
        </div>
        ))}
        </div>

        {isExtraInvalid && (
            <Alert variant="destructive" className="mt-3">
              <AlertTitle>För få extra ingredienser</AlertTitle>
              <AlertDescription>Välj minst två extra ingredienser</AlertDescription>
            </Alert>
          )}

      
      </fieldset>
      <CardContent>
          <SelectIngredient
              label="Välj dressing"
              value={dressing}
              options={dressingOptions}
              onValueChange={setDressing}
              showError={showError}
              />
            vald dressing: {dressing?.label}
      </CardContent>

      <div className="flex justify-end p-6 pt-0">
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-black border border-black">
        Lägg till i varukorgen
      </Button>
    </div>
    
    </form>
    </Card>
      
  );
}

type SelectIngredientType = {
  label: string;
  value: SelectOption | null;
  onValueChange: (value: SelectOption | null) => void;
  options: SelectOption[];
  showError: boolean;
};
function SelectIngredient({
  label,
  value,
  onValueChange,
  options,
  showError,
}: SelectIngredientType) {
  const invalid = showError && !value;
  const selectId = useId();
  return (

    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={selectId} className="text-base font-semibold">
        {label}
      </FieldLabel>
      <Select
        value={value?.value || ""}
        onValueChange={(val) => {
          const selected = options.find((o) => o.value === val) || null;
          onValueChange(selected);
        }}
      >
        <SelectTrigger id ={selectId} aria-invalid={invalid} className="w-full!">
          <SelectValue placeholder="gör ett val">
            {value ? value.label : null}
          </SelectValue>
          
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {invalid && <FieldError>Gör ett val.</FieldError>}
    </Field>
  );
}

export default ComposeSalad;
