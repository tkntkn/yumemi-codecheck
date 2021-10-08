async function fetchResas(resource: string) {
  const response = await fetch(
    `https://opendata.resas-portal.go.jp${resource}`,
    {
      headers: {
        "X-API-KEY": RESAS_API_KEY,
      },
    }
  );
  return response.json();
}

export type Prefecture = {
  prefCode: number;
  prefName: string;
};

let prefecturesCache: Prefecture[];

export async function fetchPrefectures(): Promise<Prefecture[]> {
  if (!prefecturesCache) {
    const response = (await fetchResas("/api/v1/prefectures")) as any;
    const prefectures = response.result;
    prefecturesCache = prefectures;
  }

  return prefecturesCache;
}

type Population = number[];

const populationCache: { [prefCode in number]: Population } = {};

export async function fetchPopulation(prefCode: number): Promise<Population> {
  if (!populationCache[prefCode]) {
    const response = (await fetchResas(
      `/api/v1/population/composition/perYear?prefCode=${prefCode}&cityCode=-`
    )) as any;
    const population = response.result.data
      .find(({ label }) => label === "総人口")
      .data.map((data) => data.value);
    populationCache[prefCode] = population;
  }

  return populationCache[prefCode];
}
