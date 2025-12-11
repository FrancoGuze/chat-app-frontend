import type { FormEvent, ChangeEvent } from "react";

type Props = {
  value: string;
  hasMatches: boolean;
  onChange: (value: string) => void;
  onAdd: (value: string) => void;
};

export const FindAddContactInput = ({
  value,
  hasMatches,
  onChange,
  onAdd,
}: Props) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (hasMatches) return;

    onAdd(value.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full p-2 bg-custom-green-300 border-b border-secondary-700">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Search contacts..."
          className="flex-1 px-3 py-1 rounded border border-secondary-700 text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-600"
        />

        {!hasMatches && value.trim() && (
          <button
            type="submit"
            className="px-4 py-1 bg-primary-600 text-primary-50 rounded font-semibold border-2 border-primary-50"
          >
            Agregar
          </button>
        )}
      </form>
    </div>
  );
};
