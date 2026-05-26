// a container with a horizontal scrollbar and mouse grab scroll functionality.
// it relies on a containerClass to access the container in its handler
const ScrollableContainer = ({ children, containerClass }) => {
  if (!containerClass) {
    return (
      <div>
        Provide a containerClass prop to enable scroll functionality (e.g.
        profile-scroll-div).
      </div>
    );
  }

  // left: the container's scrollLeft position
  // x: the user's mouse x position
  const pos = { left: 0, x: 0 };

  // scrolls the container in the user's mouse direction
  const mouseMoveHandler = (e) => {
    const scrollDiv = document.querySelector(`.${containerClass}`);
    const dx = pos.x - e.clientX;
    scrollDiv.scrollLeft = pos.left + dx;
  };

  // activates drag functionality when container is grabbed
  const mouseDownHandler = (e) => {
    pos.left = e.currentTarget.scrollLeft;
    pos.x = e.clientX;
    e.currentTarget.style.userSelect = "none";
    e.currentTarget.style.cursor = "grabbing";
    e.currentTarget.addEventListener("mousemove", mouseMoveHandler);
  };

  // removes drag functionality when container grab is released 
  const mouseUpHandler = (e) => {
    e.currentTarget.style.removeProperty("user-select");
    e.currentTarget.style.cursor = "grab";
    e.currentTarget.removeEventListener("mousemove", mouseMoveHandler);
  };

  return (
    <div
      className={`relative flex gap-3 overflow-x-auto py-2 cursor-grab ${containerClass}`}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseLeave={mouseUpHandler}
    >
      {children}
    </div>
  );
};

export default ScrollableContainer;
