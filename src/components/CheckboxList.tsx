import { ChangeEvent, ReactElement } from "react";

type Props = {
  items: Array<{ key: string; label: string }>;
  onCheck(key: string): void;
  onUncheck(key: string): void;
};

export function CheckboxList({
  items,
  onCheck,
  onUncheck,
}: Props): ReactElement {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const key = event.target.value;
    if (event.target.checked) {
      onCheck(key);
    } else {
      onUncheck(key);
    }
  };

  return (
    <div className="CheckboxList">
      {items.map(({ key, label }) => (
        <label key={key} className="CheckboxList__item">
          <input type="checkbox" value={key} onChange={handleOnChange} />
          {label}
        </label>
      ))}
    </div>
  );
}
