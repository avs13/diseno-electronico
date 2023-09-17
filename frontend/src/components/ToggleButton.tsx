import { ChangeEventHandler } from "react";

interface Props {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: boolean;
  disabled?: boolean;
}

export const ToggleButton = ({ onChange, value, disabled }: Props) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer mx-2">
      <input
        onChange={onChange}
        checked={value}
        type="checkbox"
        className="sr-only peer"
        disabled={disabled}
      />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-gray-900 peer-disabled:bg-gray-600" />
    </label>
  );
};
