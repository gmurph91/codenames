import React from "react";
export default ({ text, username, handleTextChange }) => (
  <div>
      <div className="chatInput">
          <input
            type="text"
            placeholder="chat here..."
            className="form-control"
            onChange={handleTextChange}
            onKeyDown={handleTextChange}
          />
      </div>
</div>
);