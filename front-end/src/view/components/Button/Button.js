


import "./Button.scss";

const Button = ({
    children,
    type = "button",
    className = "primary",
    ...props
}) => {
    return (
        <button
            type={type}
            className={`btn ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;