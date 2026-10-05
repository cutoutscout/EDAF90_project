import { type IngredientInfo, type PartialInventory } from "./inventory.js";
import { v4 as uuidv4 } from "uuid";

type SaladInfo = {
  vegan: boolean;
  gluten: boolean;
  lactose: boolean;
};

class Salad {
  protected static instanceCounter = 1;
  readonly ingredients: PartialInventory;
  readonly uuid: string;

  constructor(init?: PartialInventory, uuid?: string) {
    //this.ingredients = init || {};
    //    this.uuid = "salad_" + "1"; //Salad.instanceCounter++;
    // this.uuid = "salad_" + Salad.instanceCounter++;

    this.ingredients = init ? { ...init } : {};

    //if parse gives a uuied reuse it else create new
    //this.uuid = uuid ? uuid : "salad_" + Salad.instanceCounter++;
    this.uuid = uuid ? uuid : uuidv4();
  }

  /**
   * @returns a new salad object with the ingredient @name added.
   */
  add(name: string, info: IngredientInfo): Salad {
    //spread operator. created new obj with all objetcs from this
    const new_ingredient = {
      ...this.ingredients, //copy existing
      [name]: info, //add new ingrident
    };
    return new Salad(new_ingredient, this.uuid);
  }

  /**
   * @returns a new salad object with the ingredient @name removed.
   */
  remove(name: string): Salad {
    const removed_ingredient = { ...this.ingredients };
    delete removed_ingredient[name];
    return new Salad(removed_ingredient, this.uuid);
  }

  /**
   * @returns the price of this salad.
   */
  price(): number {
    //turns ingridents obj into an array of igridence info obj. reduce sums upp the prices
    return Object.values(this.ingredients).reduce((sum, ingredients) => {
      return sum + ingredients.price;
    }, 0);
  }

  /**
   * @returns the aggregated info of of all ingredients.
   * vegan is true if all ingredients are vegan.
   * lactose and gluten is true if any of the ingredients contain the allergenic
   */
  info(): SaladInfo {
    return Object.values(this.ingredients).reduce<SaladInfo>(
      (res, ingredients) => {
        return {
          vegan: res.vegan && !!ingredients.vegan,
          gluten: res.gluten || !!ingredients.gluten,
          lactose: res.lactose || !!ingredients.lactose,
        };
      },
      {
        vegan: true,
        gluten: false,
        lactose: false,
      },
    );
  }

  /**
   * @param json is a JSON string with an array of Salad objects
   * @returns an array of Salad objects.
   * @throws if json is not an array, or any of the objects do not
   * have the ingredients attribute
   */
  static parse(json: string): Salad[] {
    const list = JSON.parse(json);
    if (!Array.isArray(list)) {
      throw new Error("not an array");
    }
    return list.map((obj) => {
      if (!obj.ingredients) {
        throw new Error("missing");
      }
      return new Salad(obj.ingredients, obj.uuid);
    });
  }
}

export { Salad };
