import { useState } from "react";

export const Options = ({ className = "" }: { className: string }) => {
    const [colors,setColors] = useState<Record<'primary' | 'secondary', string>>({primary:"#809848",secondary:"#442220"})
  return (
    <div className={className}>
      <button className="bg-primary-400 rounded-full py-1 h-8 aspect-square hover:bg-primary-hover ">
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
    </div>
  );
};
