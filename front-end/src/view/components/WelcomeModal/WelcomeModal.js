import { useCallback, useEffect, useRef, useState } from "react";
import "./WelcomeModal.scss";

const STORAGE_KEY = "buyrsell_welcome_modal_dismissed";

const WelcomeModal = () => {
    const [open, setOpen] = useState(() => {
        try {
            return window.sessionStorage.getItem(STORAGE_KEY) !== "true";
        } catch {
            return true;
        }
    });
    const dialogRef = useRef(null);
    const exploreRef = useRef(null);

    const dismiss = useCallback(() => {
        try {
            window.sessionStorage.setItem(STORAGE_KEY, "true");
        } catch {
            // Keep the dismissal for this render when browser storage is unavailable.
        }
        setOpen(false);
    }, []);

    useEffect(() => {
        if (!open) return undefined;

        const previousOverflow = document.body.style.overflow;
        const previousFocus = document.activeElement;
        document.body.style.overflow = "hidden";
        exploreRef.current?.focus();

        const handleKeyDown = event => {
            if (event.key === "Escape") {
                event.preventDefault();
                dismiss();
                return;
            }

            if (event.key === "Tab") {
                event.preventDefault();
                exploreRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previousFocus instanceof HTMLElement) previousFocus.focus();
        };
    }, [dismiss, open]);

    if (!open) return null;

    return (
        <div className="welcome-modal" role="presentation">
            <section
                className="welcome-modal__card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-modal-title"
                aria-describedby="welcome-modal-description"
                ref={dialogRef}
            >
                <div className="welcome-modal__mark"><img src="/preview.png" alt="buyRsell Mart logo" /></div>
                <p className="welcome-modal__eyebrow">Welcome to buyRsell Mart!</p>
                <h1 id="welcome-modal-title">A marketplace project built to explore.</h1>
                <span className="welcome-modal__label">Personal Development Project</span>
                <p className="welcome-modal__description" id="welcome-modal-description">
                    buyRsell Mart is a personal full-stack marketplace project developed to demonstrate skills in React.js, Node.js, Express.js, and PostgreSQL.
                </p>
                <p className="welcome-modal__note">
                    This platform is created for learning and demonstration purposes and is not an established commercial marketplace.
                </p>
                <p className="welcome-modal__thanks">Thank you for visiting and exploring this project!</p>
                <button className="welcome-modal__action" type="button" onClick={dismiss} ref={exploreRef}>
                    Explore Project
                    <span aria-hidden="true">→</span>
                </button>
            </section>
        </div>
    );
};

export default WelcomeModal;
