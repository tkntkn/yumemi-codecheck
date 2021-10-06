import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Counter } from "./Counter";

describe("Counter", () => {
  afterEach(() => {
    cleanup();
  });

  test("render", () => {
    const { getByText } = render(<Counter />);
    getByText("Count: 0");
  });

  test("click:count", () => {
    render(<Counter />);
    const button = screen.getByText("Count Up");
    fireEvent.click(button);
    fireEvent.click(button);
    screen.getByText("Count: 2");
  });
});
