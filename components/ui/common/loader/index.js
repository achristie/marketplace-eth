const SIZES = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12, h-12",
};
export default function Loader({ size = "md" }) {
  return (
    <div class={`lds-default ${SIZES[size]}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div className={`t${i + 1}`} key={`dot-${i}`} />
      ))}
    </div>
  );
}
