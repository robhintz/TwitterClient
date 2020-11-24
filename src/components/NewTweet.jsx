import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context.jsx";
import { Link } from "react-router-dom";
import Tweet from "./Tweet.jsx";

function NewTweet() {
  const {
    username,
    userEmail,
    setUsername,
    photoUrl,
    setPhotoUrl,
    userObject,
    setUserObject,
    anonUser,
    setAnonUser,
    allTweets,
    handleLike,
    editTweet,
    setEditTweet,
    setTweetToEdit,
    handleEdit,
    tweetToEdit,
    queryTweets,
    tweetToReply,
    setTweetToReply,
  } = useContext(Context);

  const [tweetText, setTweetText] = useState("");

  function publishTweet() {
    let thisTweetId;
    if (editTweet) {
      let date = new Date().toString().split(" ");
      date.pop();
      date.pop();
      date.pop();
      date.pop();
      let newDate = date.join(" ");

      fetch("http://localhost:3003/tweets/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          tweetText: `${tweetText} (edited ${newDate})`,
          tweetId: tweetToEdit._id.toString(),
        }),
      });
      setTweetToEdit({});
      setEditTweet(false);
      queryTweets();
    } else {
      console.log("publish tweet clicked");
      fetch("http://localhost:3003/tweets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          author: userObject._id.toString(),
          userEmail,
          text: tweetText,
          authorName: username,
          replyTo: tweetToReply._id || "",
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          console.log(json);
          let id = json._id;

          if (tweetToReply._id) {
            fetch("http://localhost:3003/tweets/reply", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              mode: "cors",
              body: JSON.stringify({
                originalId: tweetToReply._id.toString(),
                replyId: json._id.toString(),
              }),
            })
              .then((response) => response.json())
              .then((json) => console.log(json));
          }
          fetch(`http://localhost:3003/users/newPost/${userObject._id}/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
          })
            .then((response) => response.json())
            .then((json) => console.log(json));
          setTweetToReply({});
          queryTweets();
        });
    }
  }

  return (
    <div className="row app">
      {tweetToReply._id && (
        <div>
          <h4>Replying to this tweet:</h4>
          <Tweet tweet={tweetToReply} hideReplies={true} />
        </div>
      )}
      {editTweet && tweetToEdit._id && (
        <div>
          <h4>Editing this tweet:</h4>
          <Tweet
            editing={tweetToEdit.text}
            tweet={tweetToReply}
            hideReplies={true}
          />
        </div>
      )}
      <br></br>
      <input
        className="textBox"
        type="textarea"
        value={tweetText}
        onChange={(e) => {
          setTweetText(e.target.value);
        }}
        placeholder={`${
          editTweet ? `${tweetToEdit.text}` : "What would you like to say?"
        }`}
      ></input>
      <Link to="/account">
        <button
          type="button"
          disabled={!username}
          onClick={() => {
            publishTweet();
          }}
        >
          {editTweet ? "Edit Tweet" : "Post Tweet"}
        </button>
      </Link>
      {tweetToReply._id && (
        <button onClick={() => setTweetToReply({})}>Cancel Reply</button>
      )}
      {editTweet && (
        <Link to="/account">
          <button
            onClick={() => {
              setTweetToEdit({});
              setEditTweet(false);
            }}
          >
            Cancel Edit
          </button>
        </Link>
      )}
      <br></br>
    </div>
  );
}

export default NewTweet;
