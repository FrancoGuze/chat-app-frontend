import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";

export const AccessPage = () => {
  const { setUsername } = useContext(AppContext);
  const [ACUserName, setACUserName] = useState<string>("");
  const [cordsVal, setCordsVal] = useState<number[]>([1, 1, 1]);
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
  const NoiseFilter = ({ id, seed }: { id: string; seed: number }) => (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.006"
        numOctaves="3"
        seed={seed}
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
  );
  const commonProps = {
    fill: "none" as const,
    stroke: "#4422200c" as const,
    strokeWidth: 0.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
    // filter: "url(#effect)" as const,
  };
  const ellipses = (val: number, amount: number) => {
    return (
      <>
        {Array.from({ length: amount }).map((_, i) => (
          <ellipse key={i} rx={(i + 1) * val} ry={(i + 1) * val} />
        ))}
      </>
    );
  };
  useEffect(
    () =>
      setCordsVal([
        Math.round(Math.random() * 6) || 1,
        Math.ceil(Math.random() * 4) + 6,
        Math.ceil(Math.random() * 9) + 2,
      ]),
    []
  );
  type cords = { [key: number]: [number[], number[], number[]] };
  return (
    <div className="bg-linear-160 from-primary-400 via-primary-600 to-primary-800 w-screen h-screen grid place-content-center z-10">
      <svg viewBox="-100 -100 200 200" className=" absolute w-screen h-screen ">
        <defs>
          {Array.from({ length: 3 }).map((_, i) => (
            <NoiseFilter key={i} id={`effect-${i}`} seed={3 + i * 7} />
          ))}
        </defs>

        {Array.from({ length: 3 }).map((_, i) => {
          const cords: cords = {
            1: [
              [-85, -40],
              [10, 60],
              [90, -20],
            ],
            2: [
              [-60, 80],
              [40, -70],
              [95, 30],
            ],
            3: [
              [-100, 10],
              [-30, -90],
              [70, 60],
            ],
            4: [
              [-40, -100],
              [60, 20],
              [100, 90],
            ],
            5: [
              [-90, 50],
              [20, -30],
              [80, -100],
            ],
            6: [
              [-70, -70],
              [50, 90],
              [-10, 40],
            ],
          };

          return (
            <g
              key={i}
              transform={`translate(${cords[cordsVal[0]][i][0]}, ${
                cords[cordsVal[0]][i][1]
              })`}
              {...commonProps}
              filter={`url(#effect-${i})`}
            >
              {/* cordsVal[1], cordsVal[2] */}
              {ellipses(i % 2 === 1 ? cordsVal[1] : cordsVal[2], i % 2 === 1 ? cordsVal[2] : cordsVal[1])}
            </g>
          );
        })}
      </svg>
      <div className="bg-primary-100 rounded-2xl min-h-36 px-5 py-6 flex flex-col items-center z-20">
        <h1 className="text-2xl mb-6">App de mensajeria instantánea</h1>

        <form onSubmit={handleSubmit} className="flex flex-row gap-4">
          <input
            className="bg-primary-400 focus:bg-primary-400/50 border-2 border-secondary-700 focus:border-secondary-900 outline-0 rounded-xl px-1 py-0.5 transition-all duration-75"
            type="text"
            name="username"
            maxLength={30}
            id="username-input"
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="bg-primary-400 hover:bg-primary-400/50 border-2 border-secondary-700 hover:border-secondary-900 rounded-xl py-0.5 px-1 transtion-all duration-75"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
