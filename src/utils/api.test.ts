import { fetchPrefectures, fetchPopulation } from "./api";

describe("api", () => {
  afterAll(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test("fetchPrefectures", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            message: null,
            result: [
              {
                prefCode: 1,
                prefName: "北海道",
              },
              {
                prefCode: 2,
                prefName: "青森県",
              },
            ],
          }),
      })
    );

    const prefs = await fetchPrefectures();
    expect(prefs).toEqual([
      {
        prefCode: 1,
        prefName: "北海道",
      },
      {
        prefCode: 2,
        prefName: "青森県",
      },
    ]);

    await fetchPrefectures();
    await fetchPrefectures();
    await fetchPrefectures();
    expect(fetch).toBeCalledTimes(1);
  });

  test("fetchPopulation", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            message: null,
            result: {
              boundaryYear: 2015,
              data: [
                {
                  label: "総人口",
                  data: [
                    {
                      year: 1980,
                      value: 12817,
                    },
                    {
                      year: 1985,
                      value: 12707,
                    },
                    {
                      year: 1990,
                      value: 12571,
                    },
                  ],
                },
              ],
            },
          }),
      })
    );

    const population = await fetchPopulation(1);
    expect(population).toEqual([12817, 12707, 12571]);
    expect(fetch).toBeCalledTimes(1);

    await fetchPopulation(1);
    expect(fetch).toBeCalledTimes(1);

    await fetchPopulation(2);
    expect(fetch).toBeCalledTimes(2);

    await fetchPopulation(2);
    expect(fetch).toBeCalledTimes(2);
  });
});
