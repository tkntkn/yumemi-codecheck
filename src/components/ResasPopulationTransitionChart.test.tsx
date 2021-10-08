import { cleanup, render } from "@testing-library/react";
import { ResasPopulationTransitionChart } from "./ResasPopulationTransitionChart";

describe("MainScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("render", async () => {
    const { asFragment } = render(
      <ResasPopulationTransitionChart
        series={[
          {
            type: "line",
            data: [10, 20, 30],
          },
        ]}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
