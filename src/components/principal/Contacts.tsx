import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../AppContext";
import type { MessageData } from "../../types";
import { FindAddContactInput } from "./FindAddContactInput";
import { ContactChat } from "./ContactChat";
import { Options } from "./Options";

export const Contacts = () => {
  const {
    contacts,
    serverMessages,
    userName,
    ws,
    setServerMessages,
    sendMsg,
    message,
    handleMsgInputChange,
    setReciever,
    setContacts,
  } = useContext(AppContext);

  const [actualContact, setActualContact] = useState<string>();
  const [contactMsgs, setContactMsgs] = useState<MessageData[]>([]);
  const [rows, setRows] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  /* =========================
     SEARCH + FILTER
  ========================= */

  const normalizedSearch = searchInput.trim().toLowerCase();

  const filteredContacts = useMemo(() => {
    if (!normalizedSearch) return contacts;
    return contacts.filter((c) => c.toLowerCase().includes(normalizedSearch));
  }, [contacts, normalizedSearch]);

  /* =========================
     SORT BY UNSEEN MESSAGES
  ========================= */

  const sortedContacts = useMemo(() => {
    const unseenByContact = serverMessages.reduce(
      (acc: Record<string, number>, msg) => {
        if (msg.to === userName && msg.status !== "seen") {
          acc[msg.from] = (acc[msg.from] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    return [...filteredContacts].sort(
      (a, b) => (unseenByContact[b] || 0) - (unseenByContact[a] || 0)
    );
  }, [filteredContacts, serverMessages, userName]);

  /* =========================
     CONTACT SELECTION
  ========================= */

  useEffect(() => {
    if (!actualContact) return;

    setContactMsgs(
      serverMessages.filter(
        (msg) =>
          (msg.from === userName && msg.to === actualContact) ||
          (msg.from === actualContact && msg.to === userName)
      )
    );

    setReciever(actualContact);
  }, [actualContact, serverMessages, userName, setReciever]);

  /* =========================
     MARK AS SEEN
  ========================= */

  useEffect(() => {
    if (!actualContact) return;

    const idsToUpdate = serverMessages
      .filter(
        (msg) =>
          msg.from === actualContact &&
          msg.to === userName &&
          msg.status === "delivered"
      )
      .map((msg) => msg.id);

    if (!idsToUpdate.length) return;

    ws?.send(
      JSON.stringify({
        type: "status-update",
        ids: idsToUpdate,
        status: "seen",
        sender: actualContact,
      })
    );

    setServerMessages((prev) =>
      prev.map((msg) =>
        idsToUpdate.includes(msg.id) ? { ...msg, status: "seen" } : msg
      )
    );
  }, [actualContact, serverMessages, ws, userName, setServerMessages]);

  const commonProps = {
    fill: "none" as const,
    stroke: "#4422200c" as const,
    strokeWidth: 0.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
    filter: "url(#effect)" as const,
  };
  const ellipses = (val: number, amount: number) => {
    return (
      <>
        {" "}
        {Array.from({ length: amount }).map((_, i) => (
          <ellipse rx={i * val} ry={i * val} />
        ))}{" "}
      </>
    );
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="relative w-full h-full">
      {/* justify-items-center */}
      <nav className="bg-primary-800 w-full px-6 py-2 grid grid-cols-3 items-center ">
        <h1 className="text-center text-primary-50 text-xl font-bold col-start-1 col-span-2 justify-self-start">
          App de mensajeria instantánea
        </h1>
        <Options className="justify-self-end" />
      </nav>
      <FindAddContactInput
        value={searchInput}
        hasMatches={filteredContacts.length > 0}
        onChange={setSearchInput}
        onAdd={(value) => {
          const exists = contacts.some(
            (c) => c.toLowerCase() === value.toLowerCase()
          );
          if (exists) return;

          setContacts((prev) => [...prev, value]);
          setSearchInput("");
        }}
      />
      
      <ul className="w-full sm:w-1/3 mx-auto">
        {sortedContacts && contacts ? (
          sortedContacts.map((cnt) => (
            <li
              key={cnt}
              onClick={() => setActualContact(cnt)}
              className=" group flex flex-row items-center cursor-pointer px-2 py-1 hover:bg-primary-hover bg-primary-400 transition-all duration-75 border-b sm:border-0 sm:rounded-full sm:py-1.5 sm:my-1 sm:shadow-[3px_3px_9px_0] shadow-custom-brown-900 "
            >
              <div className="w-7 h-7 rounded-full relative bg-primary-600 group-hover:bg-custom-brown-700 aspect-square mr-2 transition-all duration-75">
                <p className="absolute top-[calc(50%-1.5px)] left-[calc(50%-0.5px)] font-bold -translate-x-1/2 -translate-y-1/2 text-sm text-custom-brown-700 group-hover:text-primary-600 transition-all duration-75">
                  {cnt.slice(0, 1)}
                </p>
              </div>
              {cnt}
            </li>
          ))
        ) : (
          <div className="flex-col gap-4 w-full flex items-center justify-center mt-8">
            <div className="w-22 h-22 border-6 border-transparent text-primary-800 text-4xl animate-spin flex items-center justify-center border-t-primary-800 rounded-full">
              <div className="w-16 h-16 border-6 border-transparent text-primary-hover text-2xl animate-spin flex items-center justify-center border-t-primary-hover rounded-full"></div>
            </div>
          </div>
        )}
      </ul>
      <ContactChat
        actualContact={actualContact}
        contactMsgs={contactMsgs}
        userName={userName}
        rows={rows}
        setRows={setRows}
        message={message}
        sendMsg={sendMsg}
        handleMsgInputChange={handleMsgInputChange}
        setActualContact={setActualContact}
        setContactMsgs={setContactMsgs}
        commonProps={commonProps}
        ellipses={ellipses}
      />
    </div>
  );
};
