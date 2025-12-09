import { useContext, useEffect } from "react";
import "./App.css";
import { createConnection } from "../utils/WebSocketUtils";
import { AccessPage } from "./components/access/AccessPage";
import { handleWsLogic } from "../utils/msgUtils";
import { Contacts } from "./components/principal/Contacts";
import { AppContext } from "./AppContext";
const url = import.meta.env.VITE_WSS_URL;
function App() {
  const {
    setServerMessages,
    setContacts,
    userName,
    ws,
    setWs,
  } = useContext(AppContext);

  useEffect(() => {
    //This useEffect checks if the userName exists, if it does, it stablish a conection with the ws server

    if (!userName || userName === undefined || userName === "") {
      return;
    }
    url && setWs(createConnection(url));
  }, [userName]);
  useEffect(() => {
    if (!ws) return;

    const handleOpen = () => {
      console.log("Connected:", userName);

      ws.send(
        JSON.stringify({
          type: "auth",
          from: userName,
        })
      );
    };

    const handleMessage = (res: MessageEvent) => {
      handleWsLogic(res, userName, setContacts, setServerMessages, ws);
    };

    const handleClose = () => {
      console.log("WS closed");
      setWs(undefined);
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", handleClose);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("close", handleClose);
      ws.close();
    };
  }, [ws]);

  if (
   !userName || userName === ""
  ) {
    return <AccessPage />;
  } else {
    return (
      <div className="w-screen h-screen relative bg-custom-green-600 overflow-x-hidden">
        <Contacts />
      </div>
    );
  }
}

export default App;

