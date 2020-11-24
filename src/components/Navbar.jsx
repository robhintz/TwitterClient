import React, { useState, useEffect, useContext } from "react";
import { Context } from "../Context.jsx";
import { Link } from "react-router-dom";

function Navbar() {
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
    setDarkMode,
    darkMode,
  } = useContext(Context);
  return (
    <div className="column Navbar">
      <nav className="row">
        <img
          className="teensyImg leftBit"
          style={{ width: "2vw" }}
          src={
            darkMode
              ? "https://i.ibb.co/6Pq9yhP/sun.png"
              : "https://i.ibb.co/zZSVYp3/muslim.png"
          }
          onClick={() => {
            setDarkMode(!darkMode);
          }}
        ></img>
        <Link className="row leftSome heavy" to="/account">
          {username ? `${username}'s Account` : "Sign In"}
        </Link>
        <Link className="row rightSome heavy" to="/">
          Home
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
