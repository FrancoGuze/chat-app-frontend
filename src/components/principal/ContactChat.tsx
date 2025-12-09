import {
  useContext,
  useEffect,
  type ChangeEventHandler,
} from "react";
import { AppContext } from "../../AppContext";
import type { MessageData } from "../../types";

export const ContactChat = ({
  contact,
  contactMessages,
}: {
  contact: string;
  contactMessages: MessageData[];
}) => {
  const { userName, sendMsg, setMessage, message, setReciever, ws } =
    useContext(AppContext);
  useEffect(() => setReciever(contact), [contact]);
  useEffect(() => {
    console.log("enviando notificacion de actualizacion de etado mensajes");
   setTimeout( () => {
    console.log({"Lee":userName,"De":contact})
     ws?.send(
      JSON.stringify({ type: "status-update", from: userName, to: contact })
    );
   },10)
  }, [contactMessages]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const type = e.target.name;
    const value = e.target.value;
    if (type === "msg") {
      setMessage(value);
      return;
    }
    return;
  };

  return (
    <div className={`bg-gray-300 w-7xl min-h-40 h-auto`}>
      <p>{contact}</p>
      <div className="flex flex-col">
        {contactMessages ? (
          contactMessages.map((msg, i) => (
            <p
              className={`${
                msg.to === userName
                  ? "self-start bg-red-100"
                  : "self-end bg-green-100"
              }`}
              key={i}
            >
              {msg.message},{msg.status}
            </p>
          ))
        ) : (
          <p>Nada</p>
        )}
      </div>
      <form onSubmit={sendMsg} className="bg-white">
        <input
          type="text"
          name="msg"
          id="message_input"
          onChange={handleChange}
          value={message}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
