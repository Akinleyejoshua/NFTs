import {
  MdOutlineDashboard,
  MdOutlineStore,
  MdOutlineLogout,
  MdOutlineLibraryAdd
} from "react-icons/md";

import {useRouter} from "next/router";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";

export const SideBar = () => {
  const nav = useRouter();
  
  const go = (path) => {
    nav.push(path);
  }

  const {logout, state, getUserData} = useContext(GlobalContext);

  useEffect(() => {
    getUserData();
  }, [nav])

  return <div className="sidebar flex col">
    <div className="navbrand">
      <h2>NFTs</h2>
    </div>

    <div className="actions">
      <button className="btn" onClick={() => go("/dashboard")}>
        <MdOutlineDashboard fontSize={20} className="icon"/>
        <p>Dashboard</p>
      </button>
      <button className="btn" onClick={() => go("/marketplace")}>
        <MdOutlineStore fontSize={20} className="icon"/>
        <p>Marketplace</p>
      </button>
      {state.auth &&  <button className="btn" onClick={() => go("/create-nft")}>
        <MdOutlineLibraryAdd fontSize={20} className="icon"/>
        <p>List NFT</p>
      </button>}
     
    </div>

    <div className="footer">
      {state.auth ?  <button className="btn" onClick={logout}>
        <MdOutlineLogout fontSize={20} className="icon"/>
        <p>Logout</p>
      </button>: <p>Disconnected</p>}
     
    </div>
  </div>
}
