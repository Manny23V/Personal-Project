// a responsive image with src and optional alt text
// The classname can be used to style its container div
const ImageFluid = ({ src, alt = "", className = "" }) => {
  return (
    <div className={className}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};

export default ImageFluid;
