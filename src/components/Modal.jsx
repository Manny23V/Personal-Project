import Button from "./Button";

// container that sits on top of the page, useful for forms
// without taking the user away from the current page
// onClose should handle removal of the modal
const Modal = ({ className, children, onClose }) => {
  return (
    <div className="z-999 fixed inset-0 bg-black/30 overflow-auto">
      <div
        className={`relative z-999 my-10 mx-auto max-w-lg rounded-sm shadow-md outline outline-gray-300 p-5 bg-white`}
      >
        <button
          className="absolute right-5 text-xs py-1 px-3 cursor-pointer hover:bg-red-50 outline outline-red-500 text-red-500"
          variant="outlined"
          onClick={onClose}
          aria-label="close"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
