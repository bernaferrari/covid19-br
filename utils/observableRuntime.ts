import { Runtime } from "@observablehq/runtime";
import { Library } from "@observablehq/stdlib";

export const createRuntime = () => new Runtime(new Library());
