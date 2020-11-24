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
    queryUsers,
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

  function editAccount() {
    fetch("http://localhost:3003/users/edit", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ uid: userObject._id.toString(), newBio, newUrl }),
    })
      .then((response) => response.json())
      .then((json) => setUserObject(json));

    fetch(`http://localhost:3003/users/${userObject._id}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((json) => {
        setUserObject(json);
        return json;
      });

    queryUsers();
  }

  const [newUrl, setNewUrl] = useState("");
  const [newBio, setNewBio] = useState("");
  // have to populate yourtweets and yourreplies
  return (
    <div className="row app">
      <h2>{username}: Edit Your Account</h2>
      {username ? (
        <div>
          <h4>Email: {userObject.email}</h4>
          <div className="column">
            <img className="bigPic" src={userObject.photoUrl}></img>
            <div className="row">
              <h4>Change Photo: </h4>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={`${userObject.photoUrl}`}
              ></input>
            </div>
          </div>
          <div>
            <h4>Change Bio:</h4>
            <input
              className="textBox"
              type="text"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder={`${userObject.bio}`}
            ></input>
          </div>
          <Link to="/account">
            <button type="button" onClick={() => editAccount()}>
              Change It Up
            </button>
          </Link>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default ViewUser;
