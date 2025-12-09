import { type Dispatch, type SetStateAction } from "react";
import type { MessageData } from "../src/types";

export const messageBodyCreator = (
  from: string,
  message: string,
  to: string
) => {
  type msgBody = {
    type: "msg";
    id: string;
    from: string;
    message: string;
    date: Date;
    status: "sent" | "delivered" | "seen";
    to?: string;
  };
  if (!from || !message || message === "" || from === "") {
    return;
  }
  // console.log("Funcion de armado del cuerpo del mensaje");

  // Modify this when testing with .to is done
  const F1 = from.slice(0, 1);
  const F2 = from.slice(-1, 1) || F1;
  const T1 = to.slice(0, 1);
  const T2 = to.slice(-1, 1) || T1;
  const customid = `${F1}${F2}${T1}${T2}_${crypto.randomUUID()}`;
  // console.log("CustomId: ", customid);
  const body: msgBody = {
    type: "msg",
    id: customid,
    from: from,
    message: message,
    date: new Date(),
    status: "sent",
  };
  if (to || to !== "") {
    body.to = to;
  }
  // console.log(`Cuerpo del mensaje: ${body}`);

  return body;
};

export const handleWsLogic = (
  res: MessageEvent,
  user: string,
  setContacts: Dispatch<SetStateAction<string[]>>,
  setServerMessages: Dispatch<SetStateAction<MessageData[]>>,
  ws: WebSocket
) => {
  const wsData = JSON.parse(res.data);
  // console.log(
  //   wsData.type
  //     ? `Tipo de mensaje recibido:  ${wsData.type}`
  //     : `Mensaje recibido: ${wsData}`
  // );
  switch (wsData.type) {
    case "auth":
      // console.log("Auth message: ", { wsData });
      // setUserId(messages.id)
      setContacts(wsData.contacts || []);
      return;

    case "new-contact":
      setContacts((prev) =>
        !prev.includes(wsData.contact) ? [...prev, wsData.contact] : prev
      );
      return;
    case "message-history":
      let usersUpdate: string[] = [];

      const ids = wsData.messages
        .filter(
          (msg: MessageData) =>
            msg.to === user && msg.from !== user && msg.status === "sent"
        )
        .map((msg: MessageData) => {
          usersUpdate.push(msg.from);

          return msg.id;
        });
      // console.log("Ids to update", { ids });
      const messages = wsData.messages.map((msg: MessageData) =>
        msg.status === "sent" ? { ...msg, status: "delivered" } : msg
      );

      // console.log({ usersUpdate });
      setServerMessages(messages);
      if (!ids || !ids.length) {
        // console.log("Ids es falso. finalizando accion de envio update");
        return;
      }
      // console.log("Status update presending");
      usersUpdate.forEach((user) => {
        ws.send(
          JSON.stringify({
            type: "status-update",
            ids: ids,
            status: "delivered",
            sender: user,
          })
        );
      });

      return;
    case "status-update":
      // console.log("\n\n", wsData, "\n\n");
      const updateIds = wsData.ids;
      const status = wsData.status;
      // console.log("status: ", status);
      setServerMessages((prev) =>
        prev.map((msg) =>
          updateIds.includes(msg.id) ? { ...msg, status } : msg
        )
      );
      return;
    case "new-msg":
      const msg = wsData.message;
      // console.log("Esto es importante: ", { msg });
      if (msg.to === user) {
        ws.send(
          JSON.stringify({
            type: "status-update",
            ids: [msg.id],
            status: "delivered",
            sender: msg.from,
          })
        );
        setServerMessages((prev) => [...prev, { ...msg, status: "delivered" }]);
      } else {
        setServerMessages((prev) => [...prev, msg]);
      }
      return;
  }
};
