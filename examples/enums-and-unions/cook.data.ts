import { Cook } from "./cook.type";

export const sampleCooks = [
  createCook({
    name: "Gordon Ramsay",
    yearsOfExperience: 21,
  }),
  createCook({
    name: "Marilyn Monroe",
    yearsOfExperience: 1,
  }),
];

function createCook(cookData: Partial<Cook>): Cook {
  return Object.assign(new Cook(), cookData);
}