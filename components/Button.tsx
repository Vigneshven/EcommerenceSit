import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  varient?: "primary" | "reset";
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  className?: string;
  disabled?: boolean;
};

function Button({
  children,
  type = "button",
  varient = "primary",
  onClick,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "basis-[calc(25%-12px)] flex flex-col justify-center items-center rounded-2xl cursor-pointer p-4 transition-colors duration-200";

  const variants = {
    primary: "bg-primary text-on-primary hover:opacity-90",
    reset: "bg-pink text-on-primary hover:opacity-90",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[varient]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
