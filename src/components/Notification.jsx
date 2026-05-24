// an error or success notification
const Notification = ({ type, message, className }) => {
  if (!type) {
    return <p>Please provide a valid notification type</p>;
  }

  if (!message) {
    return <p>Please provide a message</p>;
  }

  const sharedClasses = "p-3 outline rounded-sm";
  switch (type) {
    case "error":
      return (
        <div
          className={`${sharedClasses} outline-red-200 bg-red-50 ${className}`}
        >
          {message}
        </div>
      );
    case "success":
      return (
        <div
          className={`${sharedClasses} outline-green-200 bg-green-50 ${className}`}
        >
          {message}
        </div>
      );
  }
};

export default Notification;
