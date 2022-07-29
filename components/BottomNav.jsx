import {
  MdOutlineDashboard,
  MdOutlineStore,
  MdOutlineLibraryAdd,
} from "react-icons/md";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { AiOutlineWallet } from "react-icons/ai";

export const BottomNav = () => {
  const { state, connectWallet, getUserData } = useContext(GlobalContext);
  const nav = useRouter();

  const go = (path) => {
    nav.push(path);
  };
  useEffect(() => {
    getUserData();
  }, [nav])

  return (
    <div className="bottom-nav">
      <button className="btn" onClick={() => go("/dashboard")}>
        <MdOutlineDashboard fontSize={20} className="icon" />
        <p>Dashboard</p>
      </button>
      <button className="btn" onClick={() => go("/marketplace")}>
        <MdOutlineStore fontSize={20} className="icon" />
        <p>Marketplace</p>
      </button>
      {state.auth ? (
        <button className="btn" onClick={() => go("/create-nft")}>
          <MdOutlineLibraryAdd fontSize={20} className="icon" />
          <p>List NFT</p>
        </button>
      ) : (
        <button className="btn" onClick={connectWallet}>
          <AiOutlineWallet className="icon" fontSize={20} />
          <p>Connect</p>
        </button>
      )}
    </div>
  );
};
