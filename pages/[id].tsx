import {
  addDoc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  QueryDocumentSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilState } from "recoil";
import { commentState, modalState, postState } from "../atoms/modalAtom";
import Modal from "../components/Modal";
import CommentModal from "../components/CommentModal";
import Sidebar from "../components/Sidebar";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  GetSessionParams,
  useSession,
} from "next-auth/react";
import { useEffect, useState } from "react";
import Widgets from "../components/Widgets";
import Post from "../components/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Login from "../components/Login";
import Comments from "../components/Comments";
import LoadingSpinner from "../components/LoadingSpinner";

import MobileNav from "../components/MobileNav";

interface Props {
  trendingResults: any;
  followResults: any;
  providers:
    | { [s: string]: ClientSafeProvider }
    | ArrayLike<ClientSafeProvider>;
}
const SinglePost = ({ providers }: Props) => {
  const router = useRouter();

  const { data: session }: any = useSession();
  const [comments, setComments] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("Yayyyy");
  const [commentid] = useRecoilState(commentState);
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [post, setPost] = useState<DocumentData | undefined>();
  const { id }: any = router.query;
  const handleGetPost = async () => {
    setLoading(true);
    const postRef = doc(db, "posts", id);
    await getDoc(postRef).then((postData) => setPost(postData.data()));
    setLoading(false);
  };
  useEffect(() => {
    handleGetPost();
  }, []);
  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    );
  }, [db, id]);

  if (!session) return <Login providers={providers} />;
  return (
    <div className="">
      <Head>
        <title>
          {post?.username} on Twitter: '{post?.text}'
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black min-h-screen flex  max-w-[1500px] mx-auto">
        <Sidebar />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          {loading ? (
            <div className="mt-16">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="flex items-center px-1.5 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 bg-black py-1">
                <div
                  onClick={() => router.push("/")}
                  className="hoverAnimation flex items-center justify-center h-9 w-9 xl:px-0"
                >
                  <ArrowLeftIcon className="h-5 text-white" />
                </div>
                <div>Tweet</div>
              </div>
              <Post id={id} post={post} postPage />
              {comments.length > 0 && (
                <div className="pb-72">
                  {comments.map((comment) => (
                    <Comments
                      key={comment.id}
                      id={comment.id}
                      comment={comment.data()}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <Widgets />
        <MobileNav />
        <Modal />
        <CommentModal />
      </main>
    </div>
  );
};

export default SinglePost;
export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const trendingResults = ["results"];
  const followResults = ["results"];
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}
