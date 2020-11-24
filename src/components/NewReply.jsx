import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context.jsx";

function NewReply() {
  const {
    username,
    setUsername,
    photoUrl,
    setPhotoUrl,
    userObject,
    setUserObject,
    anonUser,
    setAnonUser,
    allTweets,
    handleLike,
    tweetToReply,
    userEmail,
  } = useContext(Context);

  const [replyText, setReplyText] = useState("");

  function publishReply() {
    fetch("https://localhost:3003/replies", {
      method: "POST",
      "Content-type": "application/json",
      body: JSON.stringify({
        replyText,
        userEmail,
        tweetToReply,
      }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  return (
    <div className="row app">
      <div className="tweet">
        <h4>Replying To {`${tweetToReply.author}`}</h4>
        <p>{tweetToReply.text}</p>
      </div>
      <input
        type="textarea"
        value={replyText}
        onChange={(e) => {
          setReplyText(e.target.value);
        }}
        placeholder="Your Name"
      ></input>
      <button
        type="button"
        disabled={!username}
        onClick={() => {
          publishReply();
        }}
      >
        Post Tweet
      </button>
    </div>
  );
}

export default NewReply;
