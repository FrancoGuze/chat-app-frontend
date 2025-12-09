import { useState, useContext } from "react";
import { AppContext } from "../../AppContext";

export const AccessPage = () => {
  const { setUsername } = useContext(AppContext);
  const [ACUserName, setACUserName] = useState<string>("");
  const handleInputChange = (e: { target: { value: string } }) => {
    setACUserName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ACUserName || ACUserName === "") {
      // console.log("Nombre inválido");
      alert("Nombre inválido");
      return;
    }
    setUsername(ACUserName.trim());
  };
  return (
    <div className="bg-custom-green-600 w-screen h-screen grid place-content-center">
      <div className="bg-custom-green-100 rounded-2xl min-h-36 px-5 py-6 flex flex-col items-center">
        <h1 className="text-2xl mb-6">App de mensajeria instantánea</h1>
        <form onSubmit={handleSubmit} className="flex flex-row gap-4">
          <input
            className="bg-custom-green-400 focus:bg-custom-green-400/50 border-2 border-custom-brown-700 focus:border-custom-brown-900 outline-0 rounded-xl px-1 py-0.5 transition-all duration-75"
            type="text"
            name="username"
            maxLength={30}
            id="username-input"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-custom-green-400 hover:bg-custom-green-400/50 border-2 border-custom-brown-700 hover:border-custom-brown-900 rounded-xl py-0.5 px-1 transtion-all duration-75"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
