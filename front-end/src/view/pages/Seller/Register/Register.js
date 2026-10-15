import AuthLayout from "../../../components/AuthLayout/AuthLayout";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sellerRegister } from "../../../../network/sellerApiService/sellerAuthService";
import "./Register.scss";
import { useDispatch } from "react-redux";
import { registerSuccess } from "../../../../features/seller/sellerSlice";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {

        register,

        watch,

        handleSubmit,

        formState: {
            errors,
            isSubmitting
        }

    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {

        try {

            delete data.confirmPassword;

            const response = await sellerRegister(data);

            dispatch(
                registerSuccess(response.response.seller)
            );

            navigate("/seller/registration-success");

        } catch (error) {

            alert(

                error.response?.data?.status?.message ||

                "Registration Failed"

            );

        }

    };

    return (

        <AuthLayout
            title="Become a Seller"
            subtitle="Create your seller account to start selling on buyRsell Mart."
        >
            <div className="seller-register-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Input

                        id="businessName"

                        label="Business Name"

                        placeholder="Enter business name"

                        required

                        error={errors.businessName?.message}

                        {...register(

                            "businessName",

                            {

                                required: "Business Name is required"

                            }

                        )}

                    />
                    <Input

                        id="fullName"

                        label="Full Name"

                        placeholder="Enter full name"

                        required

                        error={errors.fullName?.message}

                        {...register(

                            "fullName",

                            {

                                required: "Full Name is required"

                            }

                        )}

                    />

                    <Input

                        id="email"

                        type="email"

                        label="Email Address"

                        placeholder="Enter email"

                        required

                        error={errors.email?.message}

                        {...register(

                            "email",

                            {

                                required: "Email is required",

                                pattern: {

                                    value: /^\S+@\S+\.\S+$/,

                                    message: "Invalid email"

                                }

                            }

                        )}

                    />

                    <Input

                        id="phone"

                        label="Phone Number"

                        placeholder="Enter phone number"

                        required

                        error={errors.phone?.message}

                        {...register(

                            "phone",

                            {

                                required: "Phone Number is required",

                                pattern: {

                                    value: /^[6-9]\d{9}$/,

                                    message: "Invalid phone number"

                                }

                            }

                        )}

                    />

                    <Input

                        id="password"

                        label="Password"

                        type="password"

                        placeholder="Enter password"

                        required

                        error={errors.password?.message}

                        {...register(

                            "password",

                            {

                                required: "Password is required",

                                minLength: {

                                    value: 8,

                                    message: "Minimum 8 characters"

                                }

                            }

                        )}

                    />

                    <Input

                        id="confirmPassword"

                        label="Confirm Password"

                        type="password"

                        placeholder="Confirm Password"

                        required

                        error={errors.confirmPassword?.message}

                        {...register(

                            "confirmPassword",

                            {

                                required: "Confirm Password is required",

                                validate: (value) =>

                                    value === password ||

                                    "Passwords do not match"

                            }

                        )}

                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >

                        {

                            isSubmitting

                                ?

                                "Creating..."

                                :

                                "Create Seller Account"

                        }

                    </Button>

                </form>
            </div>

            <div className="auth-footer">
                Already have an account?
                <Link to="/seller/login"> Login</Link>
            </div>

        </AuthLayout>

    );
};

export default Register;