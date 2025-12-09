import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import type { MessageData } from "../../types";
import { FindAddContactInput } from "./FindAddContactInput";

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
  const [contactMsgs, setContactMsgs] = useState<MessageData[]>([]);
  const [actualContact, setActualContact] = useState<string>();
  const [rows, setRows] = useState<number>(1);
  const [sortedContacts, setSortedContacts] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<string[]>([]);

  // Effect to filter contacts based on search input
  useEffect(() => {
    if (!searchInput.trim()) {
      setFilteredResults([]);
      return;
    }

    const filtered = contacts.filter((contact) =>
      contact.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchInput, contacts]);

  useEffect(() => {
    const contactNewMesages = serverMessages.filter(
      (msg) =>
        msg.to === userName && msg.status !== "seen" && msg.from !== userName
    );

    // console.log({ contactNewMesages });
    const unseenCountByContact = contactNewMesages.reduce(
      (acc: { [key: string]: number }, msg) => {
        acc[msg.from] = (acc[msg.from] || 0) + 1;
        return acc;
      },
      {}
    );

    // Filter contacts based on search input when displaying
    let contactsToSort = searchInput.trim() ? filteredResults : contacts;

    const newContacts = [...contactsToSort].sort((a, b) => {
      const cntA = unseenCountByContact[a] || 0;
      const cntB = unseenCountByContact[b] || 0;
      return cntB - cntA;
    });
    setSortedContacts(newContacts);
    // console.log({ unseenCountByContact, newContacts });
  }, [contacts, serverMessages, searchInput, filteredResults]);
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
    // console.log(
    //   "Envio de actaulizacion de estado a: ",
    //   actualContact,
    //   idsToUpdate
    // );
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
        msg.from === actualContact &&
        msg.to === userName &&
        msg.status === "delivered"
          ? { ...msg, status: "seen" }
          : msg
      )
    );
  }, [actualContact, serverMessages]);
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
  }, [actualContact, serverMessages]);

  const scrollHelper = () => {
    const chat = document.getElementById("chat-msgs");
    if (!chat) return;
    const chatEnd = chat.scrollHeight;
    chat.scrollTop = chatEnd;
  };
  useEffect(() => {
    scrollHelper();
  }, [contactMsgs]);

  // chat background props
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
        {Array.from({ length: amount }).map((_, i) => (
          <ellipse rx={i * val} ry={i * val} />
        ))}
      </>
    );
  };
  if (
    !sortedContacts.length ||
    sortedContacts.length === 0 ||
    !serverMessages ||
    serverMessages.length === 0
  ) {
    return (
      <>
        <nav className="bg-custom-green-800 flex flex-col">
          <h1 className=" text-center text-custom-green-50 text-xl font-bold row-end-1 col-start-1 col-span-2">
            App de mensajeria instantánea
          </h1>
        </nav>

        <div className="flex-col gap-4 w-full flex items-center justify-center mt-10">
          <div className="w-20 h-20 border-4 border-transparent text-custom-hover text-4xl animate-spin flex items-center justify-center border-t-custom-hover rounded-full">
            <div className="w-16 h-16 border-4 border-transparent text-custom-green-800 text-2xl animate-spin flex items-center justify-center border-t-custom-green-800 rounded-full"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative w-full h-full">
      <nav className="bg-custom-green-800 flex flex-col">
        <h1 className=" text-center text-custom-green-50 text-xl font-bold row-end-1 col-start-1 col-span-2">
          App de mensajeria instantánea
        </h1>
      </nav>

      <FindAddContactInput
        onInputChange={setSearchInput}
        onSubmit={(value) => {
          // Parent-level add: avoid duplicates (case-insensitive)
          const exists = contacts.some(
            (c) => c.toLowerCase() === value.toLowerCase()
          );
          if (exists) {
            alert(`Contact "${value}" is already added!`);
            setSearchInput("");
            return;
          }

          setContacts((prev) => [...prev, value]);
          setSearchInput("");
          // console.log("Added contact:", value);
          // Optionally notify backend here
        }}
        contacts={contacts}
      />

      <ul className="w-full sm:w-1/3 sm:ml-0 mx-auto h-auto flex items-strech flex-col">
        {(sortedContacts ? sortedContacts : contacts).map((cnt, i) => {
          return (
            <li
              onClick={() => {
                setActualContact(cnt);
              }}
              key={cnt + i}
              className="cursor-pointer text-left bg-custom-green-400 hover:bg-custom-green-400/85 transition-colors duration-75 flex flex-row items-center px-2 py-1 border-b text-custom-brown-700"
            >
              <div className="w-8 h-8 rounded-full relative bg-custom-green-600 aspect-square mr-2">
                <p className="absolute top-[calc(50%-1.5px)] left-[calc(50%-1px)] font-bold -translate-x-1/2 -translate-y-1/2 text-sm text-custom-brown-700">
                  {cnt.slice(0, 1)}
                </p>
              </div>

              {cnt}

              {serverMessages.filter(
                (msg) => msg.from === cnt && msg.status !== "seen"
              ).length > 0 && (
                <span className="bg-custom-green-600/50 ml-auto mr-3 rounded-full h-6 text-center aspect-square ">
                  {
                    serverMessages.filter(
                      (msg) => msg.from === cnt && msg.status !== "seen"
                    ).length
                  }
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {contactMsgs && (
        <main
          className={`flex flex-col w-full max-h-screen h-full absolute top-0 transition-all duration-100 ease-in-out overflow-hidden ${
            actualContact ? "left-0" : "left-full"
          }`}
        >
          <svg
            viewBox="-100 -100 200 200"
            className="absolute w-full h-full z-0"
          >
            <defs>
              <filter id="effect" x="-50%" y="-50%" width="200%" height="200%">
                {/* 1️⃣ Ruido suave, continuo */}
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.006"
                  numOctaves="3"
                  seed={
                    (actualContact?.charCodeAt(0) || 1) +
                    (actualContact?.charCodeAt(actualContact.length - 1) || 0)
                  }
                  result="noise"
                />

                {/* 2️⃣ Deformación más contenida */}
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="30"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="displaced"
                />

                {/* 3️⃣ Micro-suavizado REAL (no blur) */}
                <feMorphology
                  in="displaced"
                  operator="dilate"
                  radius="0.15"
                  result="smoothed"
                />

                {/* 4️⃣ Blur casi imperceptible SOLO para anti-aliasing */}
                <feGaussianBlur
                  in="smoothed"
                  stdDeviation="0.15"
                  result="final"
                />
              </filter>
            </defs>

            <g transform="translate(-100,-100)" {...commonProps}>
              {ellipses(8, 14)}
            </g>
            <g transform="translate(-70,80)" {...commonProps}>
              {ellipses(10, 8)}
            </g>
            <g transform="translate(100,70)" {...commonProps}>
              {ellipses(10, 13)}
            </g>
          </svg>
          {/* HEADER */}
          <nav className="relative flex h-1/14 max-h-1/14 items-center bg-custom-green-600">
            <button
              className="flex items-center justify-center rounded-full bg-custom-green-800 p-0.5 ml-2 hover:bg-custom-green-400/30 transition duration-100"
              onClick={() => {
                setActualContact("");
                setContactMsgs([]);
              }}
            >
              <svg width={30} height={30} viewBox="0 0 28 28">
                <path
                  d="M16 6 L8 14 L16 22"
                  strokeWidth={3}
                  stroke="black"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <h3 className="absolute left-1/2 -translate-x-1/2 text-center text-2xl text-custom-brown-900">
              {actualContact}
            </h3>
          </nav>

          {/* CONTENEDOR DEL CHAT */}
          <section
            className={`flex flex-col ${
              rows === 1 ? "h-12/14 max-h-12/14" : "h-11/14 max-h-11/14"
            }  bg-custom-green-400`}
          >
            {/* LISTA DE MENSAJES (ESTO DEBE CRECER) */}
            <ul
              id="chat-msgs"
              className="max-h-full overflow-y-auto flex flex-col px-2 py-3 chat-msgs"
            >
              {contactMsgs.map((msg, i) => (
                <li
                  key={i}
                  className={`my-1 z-20 rounded-full px-2 py-0.5 ${
                    msg.from === userName
                      ? "self-end bg-custom-green-100"
                      : "self-start bg-custom-green-50"
                  }`}
                >
                  {msg.message}
                  {msg.from === userName && (
                    <span className="text-xs opacity-60 ml-2">
                      {msg.status}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* FORM — YA NO ABSOLUTE */}
          <form
            onSubmit={sendMsg}
            className={`bg-custom-green-600 h-full ${
              rows === 1 ? "max-h-1/14" : "max-h-2/14"
            } flex flex-row items-center w-full px-6  gap-4 z-20`}
          >
            <textarea
              wrap="soft"
              rows={rows}
              name="msg"
              placeholder="Mensaje"
              id="message-input"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMsg(e);
                }
              }}
              onChange={(e) => {
                const maxWidth = Math.floor(e.target.scrollWidth / 8.1) - 1;
                const chars = e.target.value.length;
                const calc = Math.floor(chars / maxWidth);
                if (calc <= 1) {
                  setRows(calc === 0 ? 1 : calc + 1);
                }
                handleMsgInputChange(e);
              }}
              value={message}
              className="grow bg-custom-green-400/40 rounded-xl px-1.5 py-1 resize-none overflow-y-hidden outline-0 border-2 border-custom-brown-700 focus:border-custom-brown-900 focus:bg-custom-green-400/50 transition-all duration-75"
            />
            <button
              type="submit"
              className="bg-custom-green-400/30 rounded-full p-0.5"
            >
              <svg width={30} height={30} viewBox="0 0 28 28">
                <path
                  d="M10 6 L20 14 L10 22"
                  strokeWidth={3}
                  stroke="black"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </main>
      )}
    </div>
  );
};
