import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context.jsx";

function Tweet(props) {
  let tweet = props.tweet;

  let hide = props.hideReplies;

  // {tweet.replies.map((reply) => {
  //     <div className="reply">
  //       <h4>{reply.authorName}</h4>
  //       <h4>{reply.text}</h4>
  //       <h4>{reply.dateCreated}</h4>
  //     </div>;
  //   })}

  const {
    setTweetToReply,
    handleDelete,
    handleLike,
    userObject,
    username,
    allTweets,
    allUsers,
    setViewUserId,
    handleEdit,
  } = useContext(Context);

  const [allReplies, setAllReplies] = useState([]);

  const [hideReplies, setHideReplies] = useState(false);

  useEffect(() => {
    if (hide) {
      setHideReplies(true);
    }
  }, []);

  useEffect(() => {
    let newArr = [];

    allTweets.forEach((i) => {
      if (tweet.replies && tweet.replies.includes(i._id)) {
        newArr.push(i);
      }
    });

    setAllReplies(newArr);
  }, [allTweets]);

  const [userPhoto, setUserPhoto] = useState("");

  useEffect(() => {
    console.log("running effect");
    allUsers.map((user) => {
      console.log(user);
      if (
        tweet.author &&
        user._id &&
        tweet.author.toString() == user._id.toString()
      ) {
        console.log(user);
        setUserPhoto(user.photoUrl);
      }
    });
  }, [hideReplies]);

  const [isLiked, setIsLiked] = useState(false);
  const [likesNumber, setLikesNumber] = useState(0);

  const [loadCounter, setLoadCounter] = useState(0);

  useEffect(() => {
    if (tweet.likes) {
      setLikesNumber(tweet.likes.length);
    }
  }, []);

  function toggleLiked() {
    if (userObject && userObject._id) {
      if (isLiked) {
        setLikesNumber(likesNumber - 1);
      } else {
        setLikesNumber(likesNumber + 1);
      }

      handleLike(tweet._id, !isLiked);
      setIsLiked(!isLiked);
    }
  }

  useEffect(() => {
    if (
      userObject &&
      userObject.likes &&
      userObject.likes.includes(tweet._id)
    ) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [userObject, allTweets]);

  return (
    <div className="column tweetBody">
      <div className="op">
        <div className="row">
          <div className="row spaceAround">
            <img src={`${userPhoto}`} className="tinyPhoto leftBit"></img>
            <Link
              className="leftBit"
              to={`/user/${tweet.author}`}
              onClick={() => {
                setViewUserId(tweet.author);
              }}
            >
              <h3>{tweet.authorName}</h3>
            </Link>
          </div>
          {tweet.createdAt && (
            <p className="rightBit">
              Created: {tweet.createdAt.substring(0, 10)}
            </p>
          )}
        </div>
        <p className="tweetText">
          {props.editing ? `${props.editing}` : tweet.text}
        </p>
        <p>{tweet.dateCreated}</p>
        <span
          className="inline"
          onClick={() => {
            toggleLiked();
          }}
        >
          <img
            className="teensyImg"
            src={`${
              isLiked
                ? "https://i.ibb.co/bRgYpnt/heart-full.png"
                : "https://i.ibb.co/26SJ4Hd/heart.png"
            }`}
          ></img>
          <p className="likeNumber">{likesNumber}</p>
        </span>
        <div
          className="column leftMore"
          style={{
            display: `${
              userObject && userObject._id === tweet.author ? "initial" : "none"
            }`,
          }}
        >
          <button onClick={() => handleDelete(tweet._id)}>Delete</button>
          <Link to="/tweet">
            <button onClick={() => handleEdit(tweet)}>Edit</button>
          </Link>
        </div>
      </div>
      {userObject && userObject._id !== tweet.author && (
        <Link to="/tweet">
          <button type="button" onClick={() => setTweetToReply(tweet)}>
            Reply to Tweet
          </button>
        </Link>
      )}
      <div className="reply">
        <p>Replies:</p>
        {!hideReplies &&
          allReplies.map((reply) => {
            return <Tweet tweet={reply} />;
          })}
      </div>
      <button onClick={() => setHideReplies(!hideReplies)} type="button">
        {hideReplies ? "Show Replies" : "Hide Replies"}
      </button>
    </div>
  );
}

export default Tweet;
