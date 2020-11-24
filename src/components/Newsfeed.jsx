import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context.jsx";
import Tweet from "./Tweet.jsx";

function Newsfeed() {
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
    editTweet,
    setEditTweet,
    tweetToReply,
    setTweetToReply,
    handleDelete,
  } = useContext(Context);
  return (
    <div id="homePageTweets" className="app newsfeed">
      <h2>Welcome to Better Twitter!</h2>
      <h3>Newsfeed:</h3>
      {allTweets.map((tweet) => {
        return <Tweet tweet={tweet} />;
      })}
    </div>
  );
}

export default Newsfeed;
