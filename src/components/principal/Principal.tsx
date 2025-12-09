import { type ChangeEventHandler, type FormEvent, useContext } from "react";
import { AppContext } from "../../AppContext";

export const Principal = ({ msgSender }: { msgSender: (e: FormEvent) => void }) => {
  const { userName, userId, message, reciever, setMessage, setReciever } = useContext(AppContext);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const type = e.target.name;
    const value = e.target.value;
    if (type === "msg") {
      setMessage(value);
    } else if (type === "reciever") {
      setReciever(value);
    }
  };

  return (
    <>
      <p>your code: {userId}</p>
      <p>Your name: {userName}</p>

    </>
  );
};
   {/* <form onSubmit={msgSender}>
        <input className="bg-gray-300 border mx-2" placeholder="mensaje"
          type="text"
          name="msg"
          id="msg-input"
          value={message}
          onChange={handleChange} required
        />
        <input className="bg-gray-300 border mx-2" placeholder="codigo destinatario" type="text" name="reciever" id="reciever-input" value={reciever} onChange={handleChange} required />
        <button type="submit">Enviar</button>
         <select name="reciever" id="reciever_select">
          <option value="null">Opcion vacia</option>
          <option value="null">Opcion vacia</option>
          <option value="null">Opcion vacia</option>
          <option value="null">Opcion vacia</option>
        </select> 
      </form> */}