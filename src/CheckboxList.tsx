import { ChangeEvent, ReactElement, useState } from "react";

type Props = {
  items: Array<{ key: string; label: string }>;
  onChange(keys: string[]): void;
};

export function CheckboxList({ items, onChange }: Props): ReactElement {
  const [checked, setChecked] = useState<string[]>([]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newKey = event.target.value;
    const newChecked = event.target.checked
      ? checked.concat(newKey)
      : checked.filter((key) => key !== newKey);
    setChecked(newChecked);
    onChange(newChecked);
  };

  return (
    <div className="prefs__items">
      {items.map(({ key, label }) => (
        <label key={key} className="prefs__item">
          <input
            type="checkbox"
            value={key}
            onChange={handleOnChange}
            // FIXME: checkされたitemsが多い時にはパフォーマンス課題がある
            checked={checked.includes(key)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
