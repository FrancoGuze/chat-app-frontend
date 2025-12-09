import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { AppContext } from "../../AppContext";

export const AddNewContact = () => {
  const { setContacts } = useContext(AppContext);
  const [show, setShow] = useState<boolean>(false);
  const [newContact, setNewContact] = useState<string>();
  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewContact(value);
  };
  const addContact = (e: FormEvent) => {
    e.preventDefault();
    // console.log(contacts)
    if (!newContact || newContact === "") return;
    setContacts((prev) =>
      prev.includes(newContact) ? prev : [...prev, newContact]
    );
  };
  return (
    <div className="row-start-2">
      <button onClick={() => setShow(true)} className="bg-custom-green-100 grid content-center rounded-full p-0.5">
          <svg width={22} height={22} viewBox="0 0 28 28">
            <path
              d="M14 2 L14 26 M2 14 L26 14 "
              strokeWidth={4}
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            ></path>
          </svg>
        </button>
      {show && (
        <div className="absolute inset-0 grid place-content-center w-screen h-screen bg-red-500/50">
          <form
            onSubmit={(e) => {
              addContact(e);
              setShow(false);
            }}
          >
            <input
              type="text"
              name="new-contact"
              id="new-contact-input"
              className="bg-white"
              onChange={inputHandler}
            />
            <button type="submit"> Agregar contacto</button>
          </form>
        </div>
      )}
    </div>
  );
};
