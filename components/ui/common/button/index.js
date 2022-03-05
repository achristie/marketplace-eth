const SIZE = {
  sm: "p-2 text-sm xs:px-4",
  md: "p-3 text-base xs:px-8",
  lg: "p-3 text-lg xs:px-8",
};
export default function Button({
  children,
  className,
  hoverable = true,
  size = "md",
  variant = "purple",
  ...rest
}) {
  const sizeClass = SIZE[size];
  const variants = {
    purple: `text-white bg-indigo-600 ${hoverable && "hover:bg-indigo-700"}`,
    lightPurple: `text-indigo-700 bg-indigo-100 ${
      hoverable && "hover:bg-indigo-200"
    }`,
    red: `text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
    green: `text-white bg-green-600 ${hoverable && "hover:bg-green-700"}`,
    white: `text-black bg-white`,
  };
  return (
    <button
      className={`disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} border rounded-md text-base font-medium 
      ${className} ${variants[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
