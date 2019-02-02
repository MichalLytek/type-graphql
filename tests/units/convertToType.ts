import { convertToType } from "../../src/helpers/types";

describe("convertToType", () => {
  let globalCounter = 0;

  class SampleTarget {
    constructor(public test: number) {
      globalCounter++;
    }
  }

  beforeEach(() => {
    globalCounter = 0;
  });

  it("should properly convert a object to the defined target", async () => {
    const testObject = {
      test: 4,
    };

    const convertedObject = convertToType(SampleTarget, testObject);
    expect(convertedObject).toBeDefined();
    expect(convertedObject).toHaveProperty("test");
    expect(globalCounter).toBe(1);
  });

  it("should not convert a object to the defined target if it is already instance of that Target", async () => {
    const testObject = new SampleTarget(4);

    const convertedObject = convertToType(SampleTarget, testObject);
    expect(convertedObject).toBeDefined();
    expect(convertedObject).toHaveProperty("test");
    expect(globalCounter).toBe(1);
  });
});
