import React from "react";
export default ({ chats }) => (
  <div>
    {chats.map(chat => {
      return (
        <div>
              <div className={`chatMessage ${chat.username}`}>
                <div key={chat.id} className="box">
                  <p className={chat.username}>
                    <strong>{chat.username}:</strong>
                  </p>
                  <p>{chat.message}</p>
                </div>
              </div>
        </div>
      );
    })}
  </div>
);