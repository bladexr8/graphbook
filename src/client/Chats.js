import React, { useState } from 'react';

const chats = [
            {
                "id": 1,
                "lastMessage": {
                  "text": "This is a third test message."
                },
                "users": [
                    {
                        "avatar": "/uploads/avatar1.png",
                        "username": "TestUser"
                    },
                    {
                        "avatar": "/uploads/avatar2.png",
                        "username": "TestUser2"
                    }
                ]
            }]

const usernamesToString = (users)  => {
  const userList = users.slice(1);
  var usernamesString = '';
  for(var i = 0; i < userList.length; i++) {
    usernamesString += userList[i].username;
    if(i - 1 === userList.length) {
      usernamesString += ', ';
    }
  }
  return usernamesString;
}
const shorten = (text) => {
  if (text.length > 12) {
    return text.substring(0, text.length - 9) + '...';
  }
  return text;
}
const Chats = () => {
  return (
    <div className="chats">
      {chats.map((chat, i) =>
        <div key={chat.id} className="chat">
          <div className="header">
            <img src={(chat.users.length > 2 ?
             '/public/group.png' : 
               chat.users[1].avatar)} />
            <div>
              <h2>{shorten(usernamesToString
                 (chat.users))}</h2>
              <span>{chat?.lastMessage?.text}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Chats