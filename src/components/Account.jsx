import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context.jsx";
import { Link } from "react-router-dom";
import Tweet from "./Tweet";
import sha256 from "crypto-js/sha256";

function Account() {
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
  } = useContext(Context);

  const [showInputs, setShowInputs] = useState(false);
  //
  const [inputUsername, setInputUsername] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  //
  const [displayVal, setDisplayVal] = useState("none");
  //
  const [createAccount, setCreateAccount] = useState(false);
  const [signIn, setSignIn] = useState(true);

  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

  useEffect(() => {
    if (showInputs) {
      setDisplayVal("initial");
    } else {
      setDisplayVal("none");
    }
  }, [showInputs]);

  function handleAccountRequest() {
    console.log("account login or sign up started.");

    let shaPassword = sha256(inputPassword);
    let data = {
      userName: inputUsername,
      email: inputEmail,
      password: shaPassword.toString(),
      photoUrl,
    };

    let dataNoUrl = {
      userName: inputUsername,
      email: inputEmail,
      password: shaPassword.toString(),
    };

    if (createAccount) {
      fetch("http://localhost:3003/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((json) => {
          console.log(json);
          if (!json) {
            console.log("error");
            setUserAlreadyExists(true);
            //
            // User already exists so go to sign in...
          } else {
            console.log("no error");
            // setSignIn(true);

            // setCreateAccount(false);
            setUserObject(json);
            setUserAlreadyExists(false);
          }
        });
    } else if (signIn) {
      fetch("http://localhost:3003/users/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(dataNoUrl),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setUserObject(json[0]);
          setUserAlreadyExists(false);
        });
    }
  }

  // have to populate yourtweets and yourreplies
  return (
    <div className="row app">
      <div className="row">
        <h2>{username ? `${username}'s Account` : ""}</h2>
        {username && (
          <Link to="/account/edit">
            <button>Edit Account</button>
          </Link>
        )}
      </div>
      {userAlreadyExists && <h4>User Already Exists!</h4>}
      {userObject && userObject.userName ? (
        <div>
          <h4>Username: {userObject.userName}</h4>

          <h4>Email: {userObject.email}</h4>
          <div className="row">
            <img className="bigPic" src={userObject.photoUrl}></img>
            {userObject.bio && <p>{userObject.bio}</p>}
            <div className="column">
              <Link to="/tweet">
                <button>Create Tweet</button>
              </Link>
              <button onClick={() => setUserObject({})}>Sign Out</button>
            </div>
          </div>
          <div>
            <h5>Your Tweets</h5>
            <ul>
              {yourTweets &&
                yourTweets.map((tweet) => {
                  return <Tweet tweet={tweet} />;
                })}
            </ul>
          </div>
          <div>
            <h5>Replies To You</h5>
            <ul>
              {yourReplies &&
                yourReplies.map((reply) => {
                  return <Tweet tweet={reply} hideReplies={true} />;
                })}
            </ul>
          </div>
        </div>
      ) : (
        <div id="createAccountScreen">
          <>
            <button
              type="button"
              onClick={() => {
                setCreateAccount(true);
                setSignIn(false);
              }}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setSignIn(true);

                setCreateAccount(false);
              }}
            >
              Sign In
            </button>
          </>
          <div
            style={{
              display: `${createAccount || signIn ? "initial" : "none"}`,
              // borderRadius: "25px",
              // width: "50vw",
              // backgroundColor: "rgb(57, 224, 227, 0.9)",
            }}
          >
            <span className="row">
              <h4 className="leftBit"></h4>
              <button
                className="rightBit"
                onClick={() => {
                  setCreateAccount(false);
                  setSignIn(false);
                }}
              >
                x
              </button>
            </span>
            <br></br>
            <div className="column">
              {!signIn && (
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => {
                    setInputUsername(e.target.value);
                  }}
                  placeholder="Your Name"
                ></input>
              )}
              <input
                type="text"
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                }}
                placeholder="Email"
              ></input>
              <input
                type="text"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                }}
                placeholder="Password"
              ></input>
              {!signIn && (
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                  }}
                  placeholder="Photo URL - It's Required"
                ></input>
              )}
              <br></br>
              <button
                onClick={() => {
                  handleAccountRequest();
                }}
              >
                {signIn ? "Sign In" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
