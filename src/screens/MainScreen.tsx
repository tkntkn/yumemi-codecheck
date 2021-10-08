import { ReactElement, useState, useCallback } from "react";
import useSWR from "swr";
import { fetchPrefectures } from "../utils/api";
import { CheckboxList } from "../components/CheckboxList";
import { constructPopulation, Population } from "../utils/helper";
import { ResasPopulationTransitionChart } from "../components/ResasPopulationTransitionChart";

export function MainScreen(): ReactElement {
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
    <div className="MainScreen">
      <header className="MainScreen__header">
        <h1 className="MainScreen__headerTitle">人口推移ビューワー</h1>
      </header>
      {prefsError ? (
        <div>都道府県データの取得に失敗しました。</div>
      ) : prefs ? (
        <>
          <div className="MainScreen__prefs">
            <h2 className="MainScreen__prefsTitle">都道府県</h2>
            <CheckboxList
              items={prefs.map(({ prefCode, prefName }) => ({
                key: prefCode.toString(),
                label: prefName,
              }))}
              onCheck={onPrefChecked}
              onUncheck={onPrefUnchecked}
            />
          </div>
          <div className="MainScreen__chart">
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
