import { ReactElement, useState } from "react";

export function Counter(): ReactElement {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <div className="app__count">Count: {count}</div>
      <button
        className="app__countButton"
        onClick={() => setCount((count) => ++count)}
      >
        Count Up
      </button>
    </div>
  );
}
