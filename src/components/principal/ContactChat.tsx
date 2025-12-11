import { useEffect, useState, type JSX } from "react";
import type { MessageData } from "../../types";

type Props = {
  actualContact: string | undefined;
  contactMsgs: MessageData[];
  userName: string;
  rows: number;
  setRows: (val: number) => void;
  message: string;
  sendMsg: (e: any) => void;
  handleMsgInputChange: (e: any) => void;
  setActualContact: (val: string) => void;
  setContactMsgs: (val: MessageData[]) => void;
  commonProps: any;
  ellipses: (val: number, amount: number) => JSX.Element;
};

export const ContactChat = ({
  actualContact,
  contactMsgs,
  userName,
  rows,
  setRows,
  message,
  sendMsg,
  handleMsgInputChange,
  setActualContact,
  setContactMsgs,
  commonProps,
  ellipses,
}: Props) => {
  const [randomNum, setRandoNum] = useState<number[]>([0, 1]);
  useEffect(() => setRandoNum([Math.random(), Math.random()]), []);
  const scrollHelper = () => {
    const chat = document.getElementById("chat-msgs");
    if (!chat) return;
    const chatEnd = chat.scrollHeight;
    chat.scrollTop = chatEnd;
  };
  useEffect(() => {
    scrollHelper();
    setRows(1);
  }, [contactMsgs]);

  if (!contactMsgs) return null;

  return (
    <main
      className={`flex flex-col w-full max-h-screen h-full absolute top-0 transition-all duration-100 ease-in-out overflow-hidden bg-primary-400 z-80 ${
        actualContact ? "left-0" : "left-full"
      }`}
    >
      <svg viewBox="-100 -100 200 200" className="absolute w-full h-full z-0">
        <defs>
          <filter id="effect" x="-50%" y="-50%" width="200%" height="200%">
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

            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            <feMorphology
              in="displaced"
              operator="dilate"
              radius="0.15"
              result="smoothed"
            />

            <feGaussianBlur in="smoothed" stdDeviation="0.15" result="final" />
          </filter>
        </defs>

        <g
          transform={`translate(${Math.ceil(randomNum[0] * 200) - 100},${
            Math.ceil(
             randomNum[1] * 200 - (actualContact?.charCodeAt(0) || 1)
            ) - 50
          })`}
          {...commonProps}
        >
          {ellipses(10, 13)}
        </g>
      </svg>

      <nav className="relative flex h-1/14 max-h-1/14 items-center bg-primary-600">
        <button
          className="flex items-center justify-center rounded-full bg-primary-800 p-0.5 ml-2 hover:bg-primary-400/30 transition duration-100"
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

        <h3 className="absolute left-1/2 -translate-x-1/2 text-center text-2xl text-secondary-900">
          {actualContact}
        </h3>
      </nav>

      <section
        className={`flex flex-col z-10 ${
          rows === 1 ? "h-12/14 max-h-12/14" : "h-11/14 max-h-11/14"
        } `}
      >
        <ul
          id="chat-msgs"
          className="max-h-full overflow-y-auto flex flex-col px-2 py-3 chat-msgs"
        >
          {contactMsgs.map((msg, i) => (
            <li
              key={i}
              className={`my-1 z-20 rounded-2xl px-2 py-0.5 ${
                msg.from === userName
                  ? "self-end bg-primary-100"
                  : "self-start bg-primary-50"
              }`}
            >
              {msg.message}
              {msg.from === userName && (
                <span className="text-xs opacity-60 ml-2">{msg.status}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <form
        onSubmit={(e) => {
          sendMsg(e);
          setRows(1);
        }}
        className={`bg-primary-600 h-full ${
          rows === 1 ? "max-h-1/14" : "max-h-2/14"
        } flex flex-row items-center w-full px-6 gap-4 z-20`}
      >
        <textarea
          wrap="soft"
          rows={rows}
          placeholder="Mensaje"
          name="msg"
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
          className="grow bg-primary-400/40 rounded-xl px-1.5 py-1 resize-none overflow-y-hidden outline-0 border-2 border-secondary-700 focus:border-secondary-900 focus:bg-primary-400/50 transition-all duration-75"
        />

        <button type="submit" className="bg-primary-400/30 rounded-full p-0.5">
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
  );
};
