import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
//import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

//import { Checkbox } from "@/components/ui/checkbox";
//import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Population,getUniqueValues, LoadDataset } from "./population";

import { useOutletContext, useNavigate } from "react-router";
//import type { OutletContextType } from "./App";
import { useId,useEffect, useState } from "react";
//import { Vault } from "lucide-react";


type SelectOption = {
  label: string;
  value: string;

};
  
  
//map unique values into SelectOption array
function makeOptions(
  fieldKey: string
): SelectOption[] {
  return getUniqueValues(fieldKey).map((val) =>({
    label: String(val),
    value: String (val),

  }));
}

function Search() {

  const navigate =useNavigate();

  const [kommun, setKommun] = useState<SelectOption | null>(null);
  const [gender, setGender] = useState<SelectOption | null>(null);
  const [ageGroup, setAgeGroup] = useState<SelectOption | null>(null);
  const [year, setYear] = useState<SelectOption | null>(null);

  const [showError, setShowError] = useState(false);
  const [resultPopulation, setResultPopulation] = useState<number | null>(null);
  
  const kommunOptions = makeOptions("Kommun");
  const genderOptions = makeOptions("Kön_klartext");
  const ageGroupOptions = makeOptions("Åldersgrupp_klartext");
  const yearOptions = makeOptions("År");

  const isInvalid = showError;

  const [isLoading, setIsLoading] =useState(true);

  useEffect(() => {
    LoadDataset().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full p-6 text-center">
        <p>Laddar befolkningsdata...</p>
      </Card>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    let pop = new Population(); 

    if(!year){
      setShowError(true);
      return;
    }else {
      pop = pop.add("År", year.value);
    }

    if (kommun) {
      pop = pop.add("Kommun", kommun.value);
    }

    if (gender) {
      pop = pop.add("Kön_klartext", gender.value);
    }

    if (ageGroup) {
      pop = pop.add("Åldersgrupp_klartext", ageGroup.value);
    }

    const total =pop.population();

    setResultPopulation(total);

    setShowError(false);

    //navigate(`/view-cart/new/${newSalad.uuid}`);

}

  return (

    <Card className="w-full p-3">
      <form onSubmit={handleSubmit} noValidate>
      <CardHeader>
        <CardTitle>Sök Befolkningsprognos</CardTitle>
        <CardDescription>
          Välj de parametrar för att beräkna den sammanlagda folkmängden.
        </CardDescription>
      </CardHeader>

      <CardContent>
          <SelectFilter
              label="Välj kommun"
              value={kommun}
              options={kommunOptions}
              onValueChange={setKommun}
              showError={false}
              />
            vald kommun: {kommun?.label}
      </CardContent>

      <CardContent>
          <SelectFilter
              label="Välj Kön"
              value={gender}
              options={genderOptions}
              onValueChange={setGender}
              showError={false}
              />
            valt kön: {gender?.label}
      </CardContent>

       <CardContent>
          <SelectFilter
              label="Välj Åldersgrupp"
              value={ageGroup}
              options={ageGroupOptions}
              onValueChange={setAgeGroup}
              showError={false}
              />
            vald åldersgrupp: {ageGroup?.label}
      </CardContent>

       <CardContent>
          <SelectFilter
              label="Välj År"
              value={year}
              options={yearOptions}
              onValueChange={setYear}
              showError={showError}
              />
            valt År: {year?.label}
      </CardContent>

      <div className="flex justify-end p-6 pt-0">
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-black border border-black">
        Sök
      </Button>
    </div>
    
    </form>
    </Card>
      
  );
}

type SelectFilterProps = {
  label: string;
  value: SelectOption | null;
  onValueChange: (value: SelectOption | null) => void;
  options: SelectOption[];
  showError: boolean;
};
function SelectFilter({
  label,
  value,
  onValueChange,
  options,
  showError,
}: SelectFilterProps) {
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
          <SelectValue placeholder="Du måste välja ett år">
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
      {invalid && <FieldError>Du måste välja ett år.</FieldError>}
    </Field>
  );
}

export default Search;
