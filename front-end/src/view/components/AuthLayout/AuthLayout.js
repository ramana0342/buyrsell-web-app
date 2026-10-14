import "./AuthLayout.scss";
import Header from "../Header/Header";

const AuthLayout = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <>
            <Header />

            <section className="auth-layout">
                <div className="auth-container">

                    <div className="auth-left">

                        <h1>buyRsell Mart</h1>

                        <h2>{title}</h2>

                        <p>{subtitle}</p>

                    </div>

                    <div className="auth-right">

                        {children}

                    </div>

                </div>
            </section>
        </>
    );
};

export default AuthLayout;