import {
  cleanup,
  render,
  screen,
  act,
  fireEvent,
} from "@testing-library/react";
import { SWRConfig } from "swr";
import { MainScreen } from "./MainScreen";
import * as api from "../utils/api";

describe("MainScreen", () => {
  afterEach(() => {
    cleanup();
  });

  test("render", async () => {
    jest.spyOn(api, "fetchPrefectures").mockImplementation(async () => [
      {
        prefCode: 1,
        prefName: "東京都",
      },
      {
        prefCode: 2,
        prefName: "大阪府",
      },
    ]);

    jest
      .spyOn(api, "fetchPopulation")
      .mockImplementation(async () => [10, 20, 30, 40, 50]);

    let asFragment: () => DocumentFragment;
    const action = act(async () => {
      asFragment = render(
        <SWRConfig value={{ provider: () => new Map() }}>
          <MainScreen />
        </SWRConfig>
      ).asFragment;
    });
    const title = screen.getByText("人口推移ビューワー");
    expect(title).toBeInTheDocument();
    const loadMessage = screen.getByText("都道府県データの取得中...");
    expect(loadMessage).toBeInTheDocument();
    await action;
    const tokyo = screen.getByText("東京都");
    expect(tokyo).toBeInTheDocument();
    await act(async () => void fireEvent.click(tokyo));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(asFragment()).toMatchSnapshot();
  });

  test("render fetchPrefectures error", async () => {
    jest.spyOn(api, "fetchPrefectures").mockImplementation(async () => {
      throw "error mock";
    });

    const action = act(
      async () =>
        void render(
          <SWRConfig value={{ provider: () => new Map() }}>
            <MainScreen />
          </SWRConfig>
        )
    );
    const title = screen.getByText("人口推移ビューワー");
    expect(title).toBeInTheDocument();
    const loadMessage = screen.getByText("都道府県データの取得中...");
    expect(loadMessage).toBeInTheDocument();
    await action;
    const failMessage =
      screen.getByText("都道府県データの取得に失敗しました。");
    expect(failMessage).toBeInTheDocument();
  });

  test("alert fetchPopulation error", async () => {
    jest.spyOn(api, "fetchPrefectures").mockImplementation(async () => [
      {
        prefCode: 1,
        prefName: "東京都",
      },
      {
        prefCode: 2,
        prefName: "大阪府",
      },
    ]);

    jest.spyOn(api, "fetchPopulation").mockImplementation(async () => {
      throw "error mock";
    });

    const alertMock = jest
      .spyOn(window, "alert")
      .mockImplementation(() => void 0);

    const action = act(
      async () =>
        void render(
          <SWRConfig value={{ provider: () => new Map() }}>
            <MainScreen />
          </SWRConfig>
        )
    );
    const title = screen.getByText("人口推移ビューワー");
    expect(title).toBeInTheDocument();
    const loadMessage = screen.getByText("都道府県データの取得中...");
    expect(loadMessage).toBeInTheDocument();
    await action;
    const tokyo = screen.getByText("東京都");
    expect(tokyo).toBeInTheDocument();
    await act(async () => void fireEvent.click(tokyo));
    expect(alertMock).toHaveBeenCalledWith("人口データの取得に失敗しました。");
  });
});
