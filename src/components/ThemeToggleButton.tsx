import { useGlobalContext } from "../context/Context";

const ThemeToggleButton = () => {
  const { theme, setTheme } = useGlobalContext();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative inline-flex items-center cursor-pointer focus:outline-none"
    >
      {/* Faixa de fundo */}
      <div
        className={`w-16 h-8 ${theme === "dark" ? "bg-gray-500" : "bg-gray-100"} rounded-full`}
      ></div>

      {/* Indicador (bolinha) com ícone interno */}
      <div
        className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center ${
          theme === "dark" ? "bg-gray-800 translate-x-8" : "bg-white"
        }`}
      >
        {theme === "dark" ? (
          // Ícone da Lua
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
            />
          </svg>
        ) : (
          // Ícone do Sol
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 text-yellow-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggleButton;
