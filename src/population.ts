import { v4 as uuidv4 } from "uuid";
import Papa from 'papaparse';
import csv from "./RS_befolkningsprognos.csv?raw";


const data = Papa.parse(csv, {
  header: true,          // converts rows into JS objects using column names as keys
  dynamicTyping: true,   // converts numbersfrom string to number
  skipEmptyLines: true
});

let parsedData: Record<string, any>[] = [];


class Population {
 
  readonly uuid: string;
  readonly filters: Record<string,any>;

  constructor(filters:Record<string,any> ={}, uuid?:string ){
    this.filters={...filters};
    this.uuid=uuid ? uuid:uuidv4();
  }


  /**
   * add filter rule
   */
  add(key: string, value: any): Population {
    return new Population({
      ...this.filters,
      [key]: value
    }, this.uuid);
  }

  /**
   * remove filter rule.
   */
  remove(key: string): Population {
    const next={...this.filters};
    delete next[key];
    return new Population(next, this.uuid);

  }

  /**
   * Calcualtes total population for current active filters
   */
  population(): number {
    return (data.data as Record<string, any>[])
    .filter((row: Record<string,any>)=>Object.entries(this.filters).every(([k,v]) =>row[k]===v))
    .reduce((sum:number,row: Record<string,any>) => sum+(row.Folkmängd||0),0);
  }


  /**
   * @param json is a JSON string with an array of Population objects
   * @returns an array of Population objects.
   * @throws if json is not an array, or any of the objects do not
   * have the filters attribute
   */
  /*static parse(json: string): Population[] {
    const list = JSON.parse(json);
    if (!Array.isArray(list)) {
      throw new Error("not an array");
    }
    return list.map((obj) => {
      if (!obj.filters) {
        throw new Error("missing");
      }
      return new Population(obj.filters, obj.uuid);
    });
  }*/
}


/*
* Extracts every unique value under a given coloum
*/

export function getUniqueValues(key:string): string[] {
    const values= parsedData
    .map((row: Record<string,any>)=>row[key])
    .filter((val)=>val!==undefined && val !==null);


    return Array.from(new Set(values)).sort((a,b) =>
      String(a).localeCompare(String(b),'sv')
    );
}


export async function LoadDataset(): Promise<void> {
  const response = await fetch("/RS_befolkningsprognos.csv");
  const csvText= await response.text();

  if (!response.ok) {
    throw new Error(`Failed to fetch dataset: ${response.statusText}`);
  }

  const parsed = Papa.parse(csvText, {
     header: true,          // converts rows into JS objects using column names as keys
     dynamicTyping: true,   // converts numbersfrom string to number
    skipEmptyLines: true
  });

  parsedData = parsed.data as Record<string, any>[];

  // LOG LOADED DATA & COLUMNS
  console.log("Loaded rows count:", parsedData.length);
  console.log("Sample row:", parsedData[0]);
  
}

export { Population };
