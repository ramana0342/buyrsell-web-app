import React from "react";

import "./AIHeader.scss";

const AIHeader = ({ onClose }) => {
    return (
        <div className="ai-header">
            <div>
                <h3>AI Assistant</h3>
                {/* <span>Online</span> */}
            </div>

            <button onClick={() => { onClose() }}>✕</button>
        </div>
    );
};

export default AIHeader;