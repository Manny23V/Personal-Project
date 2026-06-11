import LoadingSpinner from "./LoadingSpinner.jsx";

const LoadingDiv = ({ text }) => {
  return (
    <div className="mt-24 flex flex-col items-center">
      <LoadingSpinner />
      <p className="mt-4">{text}</p>
    </div>
  );
};

export default LoadingDiv;
