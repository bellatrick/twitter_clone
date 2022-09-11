import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import React, { ChangeEvent, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { signOut, useSession } from "next-auth/react";
const Input = () => {
  const [input, setInput] = useState("");
  const { data: session }: any = useSession();
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const filePickerRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const addImageToPost = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent?.target?.result);
    };
  };

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };
  const sendPost = async () => {
    if (loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      id: session?.user?.uid,
      username: session?.user?.name,
      userImg: session?.user?.image,
      tag: session?.user?.tag,
      text: input,
      timestamp: serverTimestamp(),
    });
    const imageRef = ref(storage, `posts/${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const download_url = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: download_url,
        });
      });
    }
    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setShowEmojis(false);
  };
  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-auto ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={session?.user?.image}
        alt="dp"
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="w-full divide-y divide-gray-700">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            rows={2}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent min-h-[50px] resize-none w-full  outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide"
            placeholder="What's happening?"
          />
          {selectedFile && (
            <div className="relative">
              <div
                onClick={() => setSelectedFile(false)}
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-xl max-h-80 object-contain "
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon "
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                <input
                  type="file"
                  hidden
                  onChange={addImageToPost}
                  ref={filePickerRef}
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div
                className="icon"
                onClick={() => {
                  setShowEmojis(!showEmojis);
                }}
              >
                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              <div className="icon">
                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              {showEmojis && (
                <div className={`absolute top-52`}>
                  <div className="relative">
                    <div
                      onClick={() => setShowEmojis(false)}
                      className="absolute z-100  w-8 h-8 bg-[#FFC83D] rounded-xs flex items-center justify-center -top-1 right-1 cursor-pointer"
                    >
                      <XIcon className="text-[#272c26] h-5" />
                    </div>
                    <img
                      src={selectedFile}
                      alt=""
                      className="rounded-xl max-h-80 object-contain "
                    />
                    <p>Emoji mart</p>
                  </div>
                  <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
                </div>
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
