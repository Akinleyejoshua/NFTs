import { GlobalContext } from "../context/GlobalContext";
import { useContext, useEffect } from "react";
import { AiOutlineUser, AiOutlineWallet } from "react-icons/ai";
import { useRouter } from "next/router";

export const Header = () => {
  const { state, shortenAddress, connectWallet } = useContext(GlobalContext);
  const router = useRouter();
  const { id } = router.query;

  return (
    <header>
      <nav className="flex">
        <div className="section-name">
          <h3>
            {router.pathname !== "/"
              ? router.pathname.replace("/", "").replace("[id]", id)
              : "Dashboard"}
          </h3>
        </div>
        <div className="header-right">
          {state.auth ? <>
          {shortenAddress(state.walletAddress)}
          <div className="profile-img">
                <AiOutlineUser />
              </div>
          </>
           : (
            <button className="btn" onClick={connectWallet}>
              <AiOutlineWallet className="icon" fontSize={20} />
              <p>Connect</p>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
