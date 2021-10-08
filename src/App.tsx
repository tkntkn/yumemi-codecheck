import { ReactElement, useEffect, useState, useCallback } from "react";
import { fetchPopulation, fetchPrefectures, Prefecture } from "./api";
import { CheckboxList } from "./CheckboxList";
import { ResasPopulationTransitionChart } from "./ResasPopulationTransitionChart";

function usePrefectures() {
  const [data, setData] = useState<Prefecture[]>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    fetchPrefectures()
      .then((response) => {
        setData(response);
        setError(undefined);
      })
      .catch((error) => {
        setData(undefined);
        setError(error);
      });
  }, []);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

type Population = {
  code: number;
  name: string;
  population: number[];
};

export function App(): ReactElement {
  const { data: prefList, isLoading, isError } = usePrefectures();
  const [populations, setPopulations] = useState<Population[]>([]);

  const onPrefAdd = useCallback(
    async (key: string) => {
      const population = {
        code: +key,
        name: prefList!.find((pref) => pref.prefCode === +key)!.prefName,
        population: await fetchPopulation(+key),
      };
      setPopulations((populations) => populations.concat(population));
    },
    [prefList]
  );

  const onPrefRemove = useCallback((key: string) => {
    setPopulations((populations) =>
      populations.filter((population) => population.code !== +key)
    );
  }, []);

  if (isError || !prefList) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="App">
      <header className="App__header">
        <h1 className="App__headerTitle">人口推移ビューワー</h1>
      </header>
      <div className="App__prefs">
        <h2 className="App__prefsTitle">都道府県</h2>
        <CheckboxList
          items={prefList.map(({ prefCode, prefName }) => ({
            key: prefCode.toString(),
            label: prefName,
          }))}
          onCheck={onPrefAdd}
          onUncheck={onPrefRemove}
        />
      </div>
      <div className="App__chart">
        <ResasPopulationTransitionChart
          series={populations.map(({ name, code, population }) => ({
            type: "line",
            id: code.toString(),
            name: name,
            data: population,
          }))}
        />
      </div>
    </div>
  );
}
