import React from "react";
export default ({ chats }) => (
  <div>
    {chats.map((chat, i) => {
      return (
        <div key={i}>
              <div className={`chatMessage ${chat.username} ${chat.team}`}>
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