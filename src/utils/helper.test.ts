import { constructPopulation } from "./helper";

describe("helper", () => {
  afterAll(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test("constructPopulation", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            result: {
              data: [
                {
                  label: "総人口",
                  data: [
                    {
                      year: 1995,
                      value: 10,
                    },
                    {
                      year: 2000,
                      value: 20,
                    },
                    {
                      year: 2005,
                      value: 30,
                    },
                  ],
                },
              ],
            },
          }),
      })
    );

    const population = await constructPopulation(1, [
      {
        prefCode: 1,
        prefName: "東京都",
      },
      {
        prefCode: 2,
        prefName: "大阪府",
      },
    ]);

    expect(population.code).toBe(1);
    expect(population.name).toBe("東京都");
    expect(population.population).toEqual([10, 20, 30]);
  });
});
