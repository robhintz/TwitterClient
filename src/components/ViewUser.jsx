import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context.jsx";
import { Link } from "react-router-dom";
import Tweet from "./Tweet";
import sha256 from "crypto-js/sha256";

function ViewUser() {
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
    userEmail,
    setUserEmail,
    yourTweets,
    yourReplies,
    handleDelete,
    viewUserId,
    setViewUserId,
  } = useContext(Context);

  const [viewingUser, setViewingUser] = useState({});

  const [userTweets, setUserTweets] = useState([]);

  const [repliesToUser, setRepliesToUser] = useState([]);

  const [idArray, setIdArray] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3003/users/${viewUserId}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(`viewing user: ${JSON.stringify(json)}`);
        console.log(json._id);
        setViewingUser(json);
      });
  }, [viewUserId]);

  useEffect(() => {
    if (viewingUser) {
      let newArr = [];
      let arr = [];
      let idArr = [];

      allTweets.forEach((i) => {
        idArr.push(i._id.toString());
        if (i.author == viewingUser._id) {
          newArr.push(i);
        }
      });

      setUserTweets(newArr);
      setIdArray(idArr);
    }
  }, [viewingUser]);

  useEffect(() => {
    let newArr = [];
    if (userTweets) {
      allTweets.forEach((i) => {
        if (idArray.includes(i.replyTo)) {
          newArr.push(i);
        }
      });
      setRepliesToUser([...newArr]);
    }
  }, [userTweets, idArray]);

  // have to populate yourtweets and yourreplies
  return (
    <div className="row app">
      <h2>{viewingUser.userName}</h2>
      {viewingUser && viewingUser.userName ? (
        <div>
          <h4>Email: {viewingUser.email}</h4>
          <div className="row">
            <img className="bigPic" src={viewingUser.photoUrl}></img>
          </div>
          <p>{viewingUser.bio ? `${viewingUser.bio}` : ""}</p>
          <div>
            <h5>{viewingUser.userName}'s Tweets</h5>
            <ul>
              {userTweets &&
                userTweets.map((tweet) => {
                  return <Tweet tweet={tweet} />;
                })}
            </ul>
          </div>
          <div>
            <h5>Replies To {viewingUser.userName}</h5>
            <ul>
              {repliesToUser &&
                repliesToUser.map((reply) => {
                  return <Tweet tweet={reply} />;
                })}
            </ul>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default ViewUser;
