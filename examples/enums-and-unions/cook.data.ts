import { Cook } from "./cook.type";

function createCook(cookData: Partial<Cook>): Cook {
  return Object.assign(new Cook(), cookData);
}

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
