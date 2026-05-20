// a responsive image with src and optional alt text
// The classname can be used to style its container div
const ImageFluid = ({ src, alt = "", className = "" }) => {
  return (
    <div className={`${className} overflow-hidden`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" draggable={false}/>
    </div>
  );
};

export default ImageFluid;
