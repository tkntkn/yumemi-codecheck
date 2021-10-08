import { cleanup, render, fireEvent } from "@testing-library/react";
import { CheckboxList } from "./CheckboxList";

describe("CheckboxList", () => {
  afterEach(() => {
    cleanup();
  });

  test("render", () => {
    const onCheck = jest.fn();
    const onUncheck = jest.fn();

    const { getByText, container } = render(
      <CheckboxList
        items={[
          {
            key: "1",
            label: "東京都",
          },
          {
            key: "2",
            label: "大阪府",
          },
        ]}
        onCheck={onCheck}
        onUncheck={onUncheck}
      />
    );

    const label1 = getByText("東京都");
    const label2 = getByText("大阪府");

    fireEvent.click(label1);
    fireEvent.click(label2);
    fireEvent.click(label1);

    expect(container.firstElementChild!.children).toHaveLength(2);
    expect(onCheck).toHaveBeenNthCalledWith(1, "1");
    expect(onCheck).toHaveBeenNthCalledWith(2, "2");
    expect(onUncheck).toHaveBeenNthCalledWith(1, "1");
  });
});
