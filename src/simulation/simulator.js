import {solveSeriesCircuit} from "./dc-solver.js";
/** Limited series-circuit estimate; not a general-purpose circuit solver. */
export function simulate(project){return solveSeriesCircuit(project);}