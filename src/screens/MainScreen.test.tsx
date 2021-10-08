import { cleanup, render } from "@testing-library/react";
import { MainScreen } from "./MainScreen";

describe("MainScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("render", () => {
    const { getByText } = render(<MainScreen />);
    getByText("都道府県データのロード中...");
  });
});
