import { ReactElement, useState, useCallback } from "react";
import useSWR from "swr";
import { fetchPrefectures } from "./api";
import { CheckboxList } from "./CheckboxList";
import { constructPopulation, Population } from "./helper";
import { ResasPopulationTransitionChart } from "./ResasPopulationTransitionChart";

export function App(): ReactElement {
  const { data: prefs, error: prefsError } = useSWR("PREFS", fetchPrefectures);

  const [populations, setPopulations] = useState<Population[]>([]);

  const onPrefChecked = useCallback(
    async (key: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const population = await constructPopulation(+key, prefs!);
        setPopulations((pops) => pops.concat(population));
      } catch {
        // TODO: アラートUIを作る
        alert("人口データの取得に失敗しました。");
      }
    },
    [prefs]
  );

  const onPrefUnchecked = useCallback((key: string) => {
    setPopulations((pops) => pops.filter((pop) => pop.code !== +key));
  }, []);

  return (
    <div className="App">
      <header className="App__header">
        <h1 className="App__headerTitle">人口推移ビューワー</h1>
      </header>
      {prefsError ? (
        <div>都道府県データの取得に失敗しました。</div>
      ) : prefs ? (
        <>
          <div className="App__prefs">
            <h2 className="App__prefsTitle">都道府県</h2>
            <CheckboxList
              items={prefs.map(({ prefCode, prefName }) => ({
                key: prefCode.toString(),
                label: prefName,
              }))}
              onCheck={onPrefChecked}
              onUncheck={onPrefUnchecked}
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
        </>
      ) : (
        <div>都道府県データの取得中...</div>
      )}
    </div>
  );
}
