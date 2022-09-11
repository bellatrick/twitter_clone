import { DocumentData } from "firebase/firestore";
import { atom, RecoilState } from "recoil";

export const modalState = atom({
  key: "myModalState",
  default: false,
});
export const commentModalState = atom({
  key: "myCommentModalState",
  default: false,
});
export const postIdState = atom({
  key: "myPostIdState",
  default: "",
});
export const postState= atom({
  key: "myPostState",
  default: "",
});
export const commentState= atom({
  key: "myCommentState",
  default: "",
});
export const repliedCommentState= atom({
  key: "myRepliedCommentState",
  default: "",
});