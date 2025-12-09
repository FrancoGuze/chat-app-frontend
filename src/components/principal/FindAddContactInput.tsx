import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

export const FindAddContactInput = ({
  onInputChange,
  onSubmit,
  contacts,
}: {
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
  contacts: string[];
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onInputChange(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    onSubmit(inputValue);
    setInputValue("");
  };

  return (
    <div className="w-full p-2 bg-custom-green-300 border-b border-custom-brown-700">
      {/* Input-only UI: searching happens in parent; Add button appears only when no matches */}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search contacts..."
            value={inputValue}
            onChange={handleInputChange}
            className="flex-1 px-3 py-1 rounded border border-custom-brown-700 text-custom-brown-700 placeholder:text-custom-brown-700/60 focus:outline-none focus:ring-2 focus:ring-custom-green-600"
          />

          {/* Show Add button only when input is non-empty and there are no matches */}
          {inputValue.trim().length > 0 &&
            contacts.filter((c) =>
              c.toLowerCase().includes(inputValue.trim().toLowerCase())
            ).length === 0 && (
              <button
                type="submit"
                className="px-4 py-1 bg-custom-green-600 text-custom-green-50 rounded font-semibold hover:bg-custom-green-600/85 transition-colors duration-75"
              >
                Add
              </button>
            )}
        </div>
      </form>
    </div>
  );
};
