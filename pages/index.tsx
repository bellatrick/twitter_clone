
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  GetSessionParams,
  useSession,
} from "next-auth/react";
import Head from "next/head";
import Feed from "../components/Feed";
import Login from "../components/Login";
import MobileNav from "../components/MobileNav";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";

interface Props {
  trendingResults: any;
  followResults: any;
  providers:
    | { [s: string]: ClientSafeProvider }
    | ArrayLike<ClientSafeProvider>;
}
export default function Home({ providers }: Props) {
  const { data: session } = useSession();
  if (!session) return <Login providers={providers} />;
  return (
    <div className="">
      <Head>
        <title>Twitter </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black relative min-h-screen flex  max-w-[1500px] mx-auto">
        <Sidebar />
        <Feed />
        <Widgets />
        <Modal />
        <MobileNav />
      </main>
    </div>
  );
}

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
