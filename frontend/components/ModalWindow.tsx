import React, { useEffect } from "react";

type ModalWindowProps = {
  onClose: () => void;
  show: boolean;
  edit_method: string;
};

const ModalWindow: React.FC<ModalWindowProps> = ({
  onClose,
  show,
  edit_method,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={`bg-opacity-50 backdrop-blur-sm absolute w-full h-full bg-black items-center justify-center flex transition-all ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-slate-600 p-3 rounded-xl relative max-w-[20vw] items-center flex flex-col gap-5 transform transition-transform duration-200 ${
          show ? "scale-100" : "scale-0"
        }`}
      >
        <div>
          <h1 className="font-bold">{edit_method}</h1>
          Use the form below to a a new task and choose a context as well as a
          difficulty
        </div>
        <div className="flex px-5">
          <div>
            <input type="text" />
          </div>
          <div>
            <input type="text" />
          </div>
        </div>

        <div>
          <button
            onClick={onClose}
            className="bg-red-500 p-2 rounded-xl shadow-md shadow-slate-500"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
