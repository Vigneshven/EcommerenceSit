import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  children?: ReactNode;
  varient?: "primary" | "reset";
  className?: string;
};

function Button({
  children,
  type: buttonType = "button",
  varient = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "basis-[calc(25%-12px)] flex flex-col justify-center items-center rounded-2xl cursor-pointer p-4 transition-colors duration-200";

  const variants = {
    primary: "bg-primary text-on-primary hover:opacity-90",
    reset: "bg-pink text-on-primary hover:opacity-90",
  };

  return (
    <button
      {...props}
      type={buttonType}
      className={`${baseStyles} ${variants[varient]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
