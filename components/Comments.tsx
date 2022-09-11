import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { MenuItem } from "@mui/material";
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
import {
  commentModalState,
  commentState,
  repliedCommentState,
} from "../atoms/modalAtom";
import { db } from "../firebase";
import AccountMenu from "./Menu";
interface Props {
  id: string;
  comment: any;
  commentPage?: boolean;
}
const Comments = ({ id: commentID, comment, commentPage }: Props) => {
  const router = useRouter();
  const [commentid, setCommentID] = useRecoilState(commentState);
  const { data: session }: any = useSession();
  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [repliedComment, setRepliedComment] =
    useRecoilState(repliedCommentState);
 
  const [isOpen, setIsOpen] = useRecoilState(commentModalState);
  const { id, commentid: comment_id }: any = router.query;
  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "posts", id, "comments", commentID, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db, id, commentID]);
  useEffect(() => {
    return onSnapshot(
      collection(db, "posts", id, "comments", commentID, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, id, commentID]);

  useEffect(() => {
    return setLiked(
      likes.findIndex((like: any) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);
  const likeComment = async () => {
    if (liked) {
      await deleteDoc(
        doc(db, "posts", id, "comments", commentID, "likes", session.user.uid)
      );
    } else {
      await setDoc(
        doc(db, "posts", id, "comments", commentID, "likes", session.user.uid),
        {
          username: session.user.name,
        }
      );
    }
  };
  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      onClick={() => {
        !commentPage && router.push(`${id}/comment/${commentID}`);
      }}
    >
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={comment.userImg}
        alt=""
      />
      <div className="flex flex-col space-y-2 w-full">
        <div className="flex justify-between">
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                {comment?.username}
              </h4>
              <span className="ml-1.5 text-sm sm:text-[15px]">
                @{comment?.tag}{" "}
              </span>
            </div>{" "}
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
            <p className="text-[#d9d9d9] mt-0.5 max-w-lg overflow-auto text-[15px] sm:text-base">
              {comment?.comment}
            </p>
          </div>
          <div
            className="icon group flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <AccountMenu
              Trigger={
                <DotsHorizontalIcon className="h-5 self-center text-[#6e767d] group-hover:text-[#1d9bf0]" />
              }
            >
              {comment && comment.tag === session.user.tag ? (
                <MenuItem

                  onClick={(e) => {
                    e.stopPropagation();
                    commentPage
                      ? deleteDoc(
                          doc(
                            db,
                            "posts",
                            id,
                            "comments",
                            comment_id,
                            "comments",
                            commentID
                          )
                        )
                      : deleteDoc(doc(db, "posts", id, "comments", commentID));
                  }}
                  className="hoverAnimation text-sm text-center w-full "
                >
                  Delete
                </MenuItem>
              ) : (
                <MenuItem onClick={() => {}} className="hoverAnimation text-xs">
                  You do not have enough permission to make changes
                </MenuItem>
              )}
            </AccountMenu>
          </div>
        </div>
        <div className="text-[#6e767d] flex justify-between w-10/12">
          <div
            className="icon group flex items-center space-x-2"
            onClick={() => {
              setCommentID(commentID);
              setIsOpen(true);
              setRepliedComment(comment);
            }}
          >
            <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likeComment();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
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

export default Comments;
