import { fetchPopulation, Prefecture } from "./api";

export type Population = {
  code: number;
  name: string;
  population: number[];
};

export async function constructPopulation(
  code: number,
  prefs: Prefecture[]
): Promise<Population> {
  return {
    code,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    name: prefs.find((pref) => pref.prefCode === code)!.prefName,
    population: await fetchPopulation(code),
  };
}
