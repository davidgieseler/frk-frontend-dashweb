import { useState, useRef, useEffect } from "react";

type DropdownButtonProps<T> = {
  label?: string;
  labelPosition?: "top" | "left";
  selected: T;
  options: T[];
  onSelect: (option: T) => void;
  getLabel: (option: T) => string;
  className?: string;
};

function DropdownButton<T>({
  label,
  labelPosition = "top",
  selected,
  options,
  onSelect,
  getLabel,
  className = "",
}: DropdownButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderLabel = label && (
    <label className="text-[var(--text-color)] text-sm font-semibold mb-2 whitespace-nowrap">
      {label}
    </label>
  );

  return (
    <div className={`mb-4 w-full ${className}`} ref={dropdownRef}>
      {labelPosition === "top" ? (
        <>
          {renderLabel}
          <DropdownCore />
        </>
      ) : (
        <div className="flex items-center gap-2">
          {renderLabel}
          <div className="flex-1">
            <DropdownCore />
          </div>
        </div>
      )}
    </div>
  );

  function DropdownCore() {
    return (
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex justify-between items-center px-4 py-2 border border-[var(--primary-color)] bg-[var(--background-alt)] text-[var(--text-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] cursor-pointer"
        >
          {getLabel(selected)}
          <svg
            className={`w-4 h-4 ml-2 transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && (
          <ul className="absolute left-0 w-full bg-[var(--surface-color)] border border-[var(--primary-color)] rounded-lg shadow-lg z-10">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-[var(--primary-light)] hover:text-[var(--text-invert)] transition duration-200 whitespace-nowrap"
              >
                {getLabel(option)}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default DropdownButton;
