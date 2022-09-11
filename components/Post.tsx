import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { db } from "../firebase";
import {
  commentModalState,
  commentState,
  modalState,
  postIdState,
  postState,
  repliedCommentState,
} from "../atoms/modalAtom";
import AccountMenu from "./Menu";
import { MenuItem } from "@mui/material";
interface Props {
  id: string;
  post: any;
  postPage?: boolean;
  commentPage?: boolean;
}
const Post = ({ id, post, postPage, commentPage }: Props) => {
  console.log(post);
  const { data: session }: any = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [commentID, setCommentID] = useRecoilState(commentState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [post_state, setPostState] = useRecoilState(postState);
  const [repliedComment, setRepliedComment] =
    useRecoilState(repliedCommentState);
  const [isCommentModalOpen, setIsCommentModalOpen] =
    useRecoilState(commentModalState);
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [repliedComments, setRepliedComments] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [retweets, setRetweets] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [liked, setLiked] = useState(false);
  const [repliedliked, setRepliedLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [repliedLikes, setrepliedLikes] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const router = useRouter();
  const { id: postID, commentid }: any = router.query;
  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);
  useEffect(() => {
    if (commentid)
      return onSnapshot(
        query(
          collection(db, "posts", id, "comments", commentid, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setRepliedComments(snapshot.docs);
        }
      );
  }, [db, id, commentid]);
  useEffect(() => {
    if (commentid) {
      return onSnapshot(
        collection(db, "posts", id, "comments", commentid, "likes"),
        (snapshot) => setrepliedLikes(snapshot.docs)
      );
    }
  }, [db, id, commentid]);
  useEffect(() => {
    return onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
      setLikes(snapshot.docs)
    );
  }, [db, id]);
  useEffect(() => {
    return onSnapshot(collection(db, "posts", id, "retweets"), (snapshot) =>
      setRetweets(snapshot.docs)
    );
  }, [db, id]);
  useEffect(() => {
    return setLiked(
      likes.findIndex((like: any) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);
  useEffect(() => {
    return setRepliedLiked(
      repliedLikes.findIndex((like: any) => like.id === session?.user?.uid) !==
        -1
    );
  }, [likes]);
  useEffect(() => {
    return setRetweeted(
      retweets.findIndex(
        (retweet: any) => retweet.id === session?.user?.uid
      ) !== -1
    );
  }, [retweets]);
  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };
  const likeComment = async () => {
    if (repliedliked) {
      await deleteDoc(
        doc(
          db,
          "posts",
          postID,
          "comments",
          commentid,
          "likes",
          session.user.uid
        )
      );
    } else {
      await setDoc(
        doc(
          db,
          "posts",
          postID,
          "comments",
          commentid,
          "likes",
          session.user.uid
        ),
        {
          username: session.user.name,
        }
      );
    }
  };
  const retweetPost = async () => {
    if (retweeted) {
      await deleteDoc(doc(db, "posts", id, "retweets", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "retweets", session.user.uid), {
        username: session.user.name,
      });
    }
  };
  return (
    <div
      onClick={() => {
        router.push(`/${id}`);
        setPostState(post);
      }}
      className="text-white flex gap-2 p-3 cursor-pointer border-b border-gray-700"
    >
      {!postPage && (
        <div className="flex flex-col justify-center items-center">
          <img src={post?.userImg} className="h-11 w-12 rounded-full" />
          <div className="w-[2px] h-full flex-1 my-1 bg-gray-700" />
          <img
            src={post?.userImg}
            className="h-6 w-6 rounded-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={`flex ${!postPage ? "justify-between" : ""}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt=""
              className="h-11 w-11 rounded-full mr-4"
            />
          )}
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                  !postPage && "inline-block"
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}
              >
                @{post?.tag}
              </span>
            </div>{" "}
            .{" "}
            <span className="hover:underline text-sm sm:text-[15px] ml-1">
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5 mb-2">
                {post?.text || post?.comment}
              </p>
            )}
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="icon group flex items-center justify-center flex-shrink-0 ml-auto"
          >
            <AccountMenu
              Trigger={
                <DotsHorizontalIcon className="h-5 self-center text-[#6e767d] group-hover:text-[#1d9bf0]" />
              }
            >
              {post && post?.id === session.user.uid ? (
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    commentPage
                      ? deleteDoc(doc(db, "posts", id, "comments", commentid))
                      : deleteDoc(doc(db, "posts", id));

                    postPage && router.push("/");
                  }}
                  className=" hoverAnimation text-sm text-center w-full"
                >
                  Delete
                </MenuItem>
              ) : (
                <MenuItem className="hoverAnimation text-xs">
                  You do not have permission for this post
                </MenuItem>
              )}
            </AccountMenu>
          </div>
        </div>
        {postPage && (
          <p className="text-[#d9d9d9] mt-0.5 text-xl">
            {post?.text || post?.comment}
          </p>
        )}
        <img
          src={post?.image}
          alt=""
          className="rounded-2xl max-h-[500px] object-cover mt-4 mr-2"
        />
        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              console.log(post, commentid, id);
              e.stopPropagation();
              if (commentPage) {
                setCommentID(commentid);
                setIsCommentModalOpen(true);
                setRepliedComment(post);
              } else {
                setPostId(id);
                setIsOpen(true);
                setPostState(post);
              }
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {commentPage
              ? repliedComments.length > 0 && (
                  <span className="group-hover:text-[#1d9bf0] text-sm">
                    {repliedComments.length}
                  </span>
                )
              : comments.length > 0 && (
                  <span className="group-hover:text-[#1d9bf0] text-sm">
                    {comments.length}
                  </span>
                )}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              retweetPost();
            }}
            className="flex items-center space-x-1 group"
          >
            <div
              className={`icon group-hover:bg-green-500/10 ${
                retweeted && "text-green-500"
              }`}
            >
              <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
            </div>
            {retweets.length > 0 && (
              <span className="group-hover:text-green-500 text-sm">
                {retweets.length}
              </span>
            )}
          </div>

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              commentPage ? likeComment() : likePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked || repliedliked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {commentPage
              ? repliedLikes.length > 0 && (
                  <span
                    className={`group-hover:text-pink-600 text-sm ${
                      repliedliked && "text-pink-600"
                    }`}
                  >
                    {repliedLikes.length}
                  </span>
                )
              : likes.length > 0 && (
                  <span
                    className={`group-hover:text-pink-600 text-sm ${
                      liked && "text-pink-600"
                    }`}
                  >
                    {likes.length}
                  </span>
                )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
