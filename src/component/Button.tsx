function Button({ children, type = 'button', varient = 'primary', onClick, className = '' }) {

    const baseStyles = "basis-[calc(25%-12px)] flex flex-col justify-center items-center rounded-2xl cursor-pointer p-4 transition-colors duration-200";

    const variants = {
        primary: "bg-primary text-white hover:bg-opacity-90",
        reset: "bg-pink text-white hover:bg-opacity-90"
    };


    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[varient]} ${className}`}
        >
            {children}
        </button>
    )
}

export default Button