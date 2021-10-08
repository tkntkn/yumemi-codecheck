import { ReactElement } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const defaultOptions = {
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
      1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015,
      2020, 2025, 2030, 2035, 2040, 2045,
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
};

type Props = {
  series: Highcharts.SeriesOptionsType[];
};

export function ResasPopulationTransitionChart({
  series,
}: Props): ReactElement {
  const options = { ...defaultOptions, series };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
