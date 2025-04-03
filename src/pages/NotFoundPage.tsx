import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-[var(--background-color)] px-4">
      <h1 className="text-5xl text-center font-bold text-[var(--primary-color)] mb-6">
        404 - Page Not Found
      </h1>
      <Link to="/home">
        <button className="px-6 py-3 bg-[var(--primary-color)] text-[var(--text-invert)] font-semibold rounded shadow hover:bg-[var(--primary-light)] transition duration-200 cursor-pointer">
          Go To Home
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
