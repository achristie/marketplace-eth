const SIZES = {
  sm: "w-3 h-3",
  md: "w-8 h-8",
  lg: "w-12, h-12",
};
export default function Loader({ size = "md" }) {
  return (
    <div className={`lds-default ${SIZES[size]}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div className={`t${i + 1}`} key={`dot-${i}`} />
      ))}
    </div>
  );
}
