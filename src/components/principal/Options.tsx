import { useEffect, useState } from "react";
import { HexColorPicker, RgbColorPicker, type RgbColor } from "react-colorful";

export const Options = ({ className = "" }: { className: string }) => {
  const [primary, setPrimary] = useState<RgbColor>({ r: 128, g: 152, b: 72 });

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const root = document.documentElement;
  useEffect(() => {
    const { r, g, b } = primary;
    root.style.setProperty("--primary-color", `rgb(${r},${g},${b})`);
    console.log({ primary });
  }, [primary]);
  useEffect(() => {
    const { r, g, b } = primary;
    if (r + g + b < 210) {
      const rgbCol = `rgb(${r + 90},${g + 90},${b + 90})`;

      root.style.setProperty("--secondary-color", rgbCol);
    } else {
      const rgbCol = `rgb(${r - 40},${g - 40},${b - 40})`;
      root.style.setProperty("--secondary-color", rgbCol || "rgb(68, 34, 32)");
      console.log(rgbCol);
    }
  }, [primary]);
  return (
    <>
      <div className={className}>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="bg-primary-400 rounded-full py-1 h-8 aspect-square hover:bg-primary-hover "
        >
          <svg className="w-6 h-6 mx-auto" viewBox="0 0 30 30">
            <path
              d="M15 5 L15 5 M15 15 L15 15 M15 25 L 15 25"
              stroke="black"
              strokeLinecap="round"
              strokeWidth={5}
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          className={`max-w-40 w-3xl z-50 ${
            showOptions ? " h-30" : "h-0"
          } absolute -right-4 top-10 overflow-y-hidden transition-all duration-300 `}
        >
          <ul className="h-fit max-w-40 w-full">
            <li className="border-b bg-primary-100 hover:bg-primary-hover transition-all duration-75 ">
              <button
                onClick={() => {
                  setShowColorPicker(true);
                  setShowOptions(false);
                }}
                className="w-full h-full flex flex-row items-center justify-start gap-2 px-1 py-0.5 cursor-pointer "
              >
                <svg className="w-7 h-7" viewBox="0 0 640 640">
                  <path d="M576 320C576 320.9 576 321.8 576 322.7C575.6 359.2 542.4 384 505.9 384L408 384C381.5 384 360 405.5 360 432C360 435.4 360.4 438.7 361 441.9C363.1 452.1 367.5 461.9 371.8 471.8C377.9 485.6 383.9 499.3 383.9 513.8C383.9 545.6 362.3 574.5 330.5 575.8C327 575.9 323.5 576 319.9 576C178.5 576 63.9 461.4 63.9 320C63.9 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320zM192 352C192 334.3 177.7 320 160 320C142.3 320 128 334.3 128 352C128 369.7 142.3 384 160 384C177.7 384 192 369.7 192 352zM192 256C209.7 256 224 241.7 224 224C224 206.3 209.7 192 192 192C174.3 192 160 206.3 160 224C160 241.7 174.3 256 192 256zM352 160C352 142.3 337.7 128 320 128C302.3 128 288 142.3 288 160C288 177.7 302.3 192 320 192C337.7 192 352 177.7 352 160zM448 256C465.7 256 480 241.7 480 224C480 206.3 465.7 192 448 192C430.3 192 416 206.3 416 224C416 241.7 430.3 256 448 256z" />
                </svg>
                Colores
              </button>
            </li>
            {/* <li className="border-b">
            <button className="w-full h-full flex flex-row items-center justify-start gap-2 px-1 py-0.5">
              Otro
            </button>
          </li>
          <li className="border-b">
            <button className="w-full h-full flex flex-row items-center justify-start gap-2 px-1 py-0.5">
              Test
            </button>
          </li> */}
          </ul>
        </div>
      </div>
      <div
        className={`absolute inset-0 w-fit h-fit bg-primary-600 px-1 py-1.5 border z-60 ${
          showColorPicker ? "block" : "hidden"
        }`}
      >
        <button onClick={() => setShowColorPicker(false)}>
          <svg
            className="stroke-black w-6 h-6 fill-secondary-900 rounded-full hover:fill-primary-hover transition-colors duration-75"
            viewBox="0 0 640 640"
          >
            <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C221.6 240.4 221.6 255.6 231 264.9L286 319.9L231 374.9C221.6 384.3 221.6 399.5 231 408.8C240.4 418.1 255.6 418.2 264.9 408.8L319.9 353.8L374.9 408.8C384.3 418.2 399.5 418.2 408.8 408.8C418.1 399.4 418.2 384.2 408.8 374.9L353.8 319.9L408.8 264.9C418.2 255.5 418.2 240.3 408.8 231C399.4 221.7 384.2 221.6 374.9 231L319.9 286L264.9 231C255.5 221.6 240.3 221.6 231 231z" />
          </svg>
        </button>
        <RgbColorPicker color={primary} onChange={setPrimary} />
      </div>
    </>
  );
};
