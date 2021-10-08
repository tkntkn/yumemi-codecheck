import { ReactElement, useEffect, useState } from "react";
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

export function App(): ReactElement {
  const { data: prefList, isLoading, isError } = usePrefectures();
  const [prefs, setPrefs] = useState<
    Array<{
      code: number;
      name: string;
      population: number[];
    }>
  >([]);

  const onPrefChange = async (keys: string[]) => {
    const prefs = await Promise.all(
      keys.map(async (key) => {
        const code = +key;
        // FIXME: populationをキャッシュしているから問題無いが、毎回選択された全都道府県についてfetchするコードになってしまっている。
        const population = await fetchPopulation(code);
        const name = prefList!.find(
          ({ prefCode }) => prefCode === code
        )!.prefName;
        return { code, name, population };
      })
    );
    setPrefs(prefs);
  };

  if (isError || !prefList) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">人口推移ビューワー</h1>
      </header>
      <div className="prefs">
        <h2 className="prefs__title">都道府県</h2>
        <CheckboxList
          items={prefList.map(({ prefCode, prefName }) => ({
            key: prefCode.toString(),
            label: prefName,
          }))}
          onChange={onPrefChange}
        />
      </div>
      <div className="app__chart">
        <ResasPopulationTransitionChart
          series={prefs.map(({ name, code, population }) => ({
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
