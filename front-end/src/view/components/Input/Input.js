import { forwardRef } from "react";
import "./Input.scss";

const Input = forwardRef(({

    id,

    label,

    type = "text",

    name,

    placeholder,

    value,

    onChange,

    onBlur,

    required = false,

    error,

    className = "",

    ...rest

}, ref) => {

    return (

        <div className={`form-group${className ? ` ${className}` : ""}`}>

            {label && (

                <label htmlFor={id}>

                    {label}

                    {required && <span>*</span>}

                </label>

            )}

            <input

                ref={ref}

                id={id}

                type={type}

                name={name}

                placeholder={placeholder}

                value={value}

                onChange={onChange}

                onBlur={onBlur}

                required={required}

                {...rest}

            />

            {

                error && (

                    <small className="input-error">

                        {error}

                    </small>

                )

            }

        </div>

    );

});

Input.displayName = "Input";

export default Input;