import { SparklesIcon } from "@heroicons/react/outline";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Input from "./Input";
import LoadingSpinner from "./LoadingSpinner";
import Post from "./Post";

const Feed = () => {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      <div className=" flex items-center opacity-90 blur-xs sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-white text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>
      <Input />
      <div className="pb-72">
        {isLoading ? (
          <div className="mt-8">
            {" "}
            <LoadingSpinner />
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post.id} id={post.id} post={post.data()} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
