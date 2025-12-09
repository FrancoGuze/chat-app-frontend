import {
  createContext,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type ReactNode,
} from "react";
import type { MessageData } from "./types";
import { messageBodyCreator } from "../utils/msgUtils";

type AppContextType = {
  message: string;
  setMessage: Dispatch<React.SetStateAction<string>>;
  serverMessages: MessageData[];
  setServerMessages: Dispatch<React.SetStateAction<MessageData[]>>;
  contacts: string[];
  setContacts: Dispatch<React.SetStateAction<string[]>>;
  userName: string;
  setUsername: Dispatch<React.SetStateAction<string>>;
  userId: string;
  setUserId: Dispatch<React.SetStateAction<string>>;
  reciever: string;
  setReciever: Dispatch<React.SetStateAction<string>>;
  ws: WebSocket | undefined;
  setWs: Dispatch<React.SetStateAction<WebSocket | undefined>>;
  sendMsg: (e: FormEvent) => void;
  handleMsgInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

// Provide sensible defaults so consumers don't need to null-check the context value everywhere.
const noopString = (() => {}) as Dispatch<React.SetStateAction<string>>;
const noopMsgArr = (() => {}) as Dispatch<React.SetStateAction<MessageData[]>>;
const noopStrArr = (() => {}) as Dispatch<React.SetStateAction<string[]>>;
const noopWs = (() => {}) as Dispatch<
  React.SetStateAction<WebSocket | undefined>
>;
const noopMsgInput = (() => {}) as (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
const noopSendMsg = (() => {}) as Dispatch<React.FormEvent>;
export const AppContext = createContext<AppContextType>({
  message: "",
  setMessage: noopString,
  serverMessages: [],
  setServerMessages: noopMsgArr,
  contacts: [],
  setContacts: noopStrArr,
  userName: "",
  setUsername: noopString,
  userId: "",
  setUserId: noopString,
  reciever: "",
  setReciever: noopString,
  ws: undefined,
  setWs: noopWs,
  sendMsg: noopSendMsg,
  handleMsgInputChange: noopMsgInput,
});

export function AppContextProvider({ children }: { children: ReactNode }) {
  // Web Socket Server connnection state
  const [ws, setWs] = useState<WebSocket | undefined>();

  // Main message Data states
  const [message, setMessage] = useState<string>("");
  const [userName, setUsername] = useState<string>("");
  const [reciever, setReciever] = useState<string>("");

  // User info states
  const [serverMessages, setServerMessages] = useState<MessageData[]>([]);
  const [contacts, setContacts] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");

  // Send messafge function used in Forms
  const sendMsg = (e: FormEvent) => {
    // console.log("Funcion de envio de mensaje");
    e.preventDefault();

    if (!ws || !reciever || !message || reciever === "" || message === "") {
      // console.log("Falto una prop")
      // console.log({reciever,message,ws})
      return;
    }
    const msgBody = messageBodyCreator(userName, message, reciever);
    setMessage("");
    // console.log("previo al envio del mensaje: ", msgBody);
    ws.send(JSON.stringify(msgBody));
  };

  const handleMsgInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!e) return;
    const type = e.target.name;
    const value = e.target.value;
    if (type === "msg") {
      setMessage(value);
      return;
    }
    return;
  };

  const contextValue: AppContextType = {
    message,
    setMessage,
    serverMessages,
    setServerMessages,
    contacts,
    setContacts,
    userName,
    setUsername,
    userId,
    setUserId,
    reciever,
    setReciever,
    ws,
    setWs,
    sendMsg,
    handleMsgInputChange,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
