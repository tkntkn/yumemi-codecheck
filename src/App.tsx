import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

function usePrefectures() {
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    fetchResas("/api/v1/prefectures")
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

const populationCache: { [key in number]: any } = {};

async function fetchPopulation(prefCode: number) {
  populationCache[prefCode] =
    populationCache[prefCode] ||
    (await fetchResas(
      `/api/v1/population/composition/perYear?prefCode=${prefCode}&cityCode=-`
    ));
  return populationCache[prefCode];
}

type PrefData = {
  prefCode: number;
  prefName: string;
};

export function App(): ReactElement {
  const { data: prefData, isLoading, isError } = usePrefectures();
  const [prefs, setPrefs] = useState<{ [key in string]: any }>({});

  const onPrefChange = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    const prefCode = +event.target.dataset.code!;
    const prefName = event.target.dataset.name!;
    if (event.target.checked) {
      const population = await fetchPopulation(prefCode);
      setPrefs(({ ...prefs }) => ({
        ...prefs,
        [prefCode]: population,
      }));
    } else {
      setPrefs(({ [prefCode]: population, ...prefs }) => ({
        ...prefs,
      }));
    }
  };

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">人口推移ビューワー</h1>
      </header>
      <div className="prefs">
        <h2 className="prefs__title">都道府県</h2>
        <div className="prefs__items">
          {prefData.result.map(({ prefCode, prefName }: PrefData) => (
            <label key={prefCode} className="prefs__item">
              <input
                type="checkbox"
                data-code={prefCode}
                data-name={prefName}
                onChange={onPrefChange}
                checked={!!prefs[prefCode]}
              />
              {prefName}
            </label>
          ))}
        </div>
      </div>
      <div className="app__chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            title: {
              text: "人口推移",
            },
            legend: {
              layout: "vertical",
              align: "right",
              verticalAlign: "top",
            },
            xAxis: {
              title: {
                text: "年度",
                align: "high",
                offset: 10,
                x: 20,
              },
              categories: [
                1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005,
                2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045,
              ],
            },
            yAxis: {
              min: 0,
              labels: {
                format: "{value}",
              },
              title: {
                align: "high",
                offset: 0,
                text: "人口数",
                rotation: 0,
                y: -10,
              },
            },
            series: Object.entries(prefs).map(([key, data]) => ({
              type: "line",
              name: (prefData.result as PrefData[]).find(
                ({ prefCode }) => prefCode === +key
              )?.prefName,
              id: key,
              data: data.result.data
                .find((data) => data.label === "総人口")
                .data.map((data) => data.value),
            })),
          }}
        />
      </div>
    </div>
  );
}
