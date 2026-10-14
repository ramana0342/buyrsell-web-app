import "./SellerLayout.scss";

import SellerSidebar from "../../components/SellerSidebar/SellerSidebar";
import SellerTopbar from "../../components/SellerTopbar/SellerTopbar";
import { useState } from "react";

const SellerLayout = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className={`seller-layout${menuOpen ? " seller-layout--menu-open" : ""}`}>

            <SellerSidebar onNavigate={() => setMenuOpen(false)} />
            {menuOpen && <button className="seller-layout__scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

            <div className="seller-content">

                <SellerTopbar onMenuClick={() => setMenuOpen(open => !open)} menuOpen={menuOpen} />

                <main>

                    {children}

                </main>

            </div>

        </div>
    );
};

export default SellerLayout;
