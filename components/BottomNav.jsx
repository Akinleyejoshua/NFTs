import {
  MdOutlineDashboard,
  MdOutlineStore,
  MdOutlineLibraryAdd,
} from "react-icons/md";
import { useRouter } from "next/router";

export const BottomNav = () => {
  const nav = useRouter();

  const go = (path) => {
    nav.push(path);
  };

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
      <button className="btn" onClick={() => go("/create-nft")}>
        <MdOutlineLibraryAdd fontSize={20} className="icon" />
        <p>List NFT</p>
      </button>
    </div>
  );
};
