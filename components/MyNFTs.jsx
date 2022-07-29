import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";
import Image from "next/image";
import Logo from "../assets/img.jpg";
import { SiEthereum } from "react-icons/si";
import { useRouter } from "next/router";
import { GrRotateLeft } from "react-icons/gr";

export const MyNFTs = () => {
  const { state, likeNFT } = useContext(GlobalContext);
  const nav = useRouter();

  const like = (event, id) => {
    let heart = event.target.firstChild;
    let like = event.target.lastChild;

    if (heart.innerHTML === "favorite") {
      heart.innerHTML = "favorite_border";
      like.innerHTML = parseInt(like.innerHTML) - 1;
      likeNFT(false, id);
    } else {
      heart.innerHTML = "favorite";
      like.innerHTML = parseInt(like.innerHTML) + 1;
      likeNFT(true, id);
    }
  };

  const arr = state?.myNFTs?.map((items, i) => (
    <div className="item glassmorphism" key={i}>
      <div className="img">
        <img src={items.image} />
        <div className="content">
          <div className="flex space-between">
            <p className="name">{items.name}</p>
            <p className="price">
              <SiEthereum />
              {items.price}
            </p>
          </div>

          <div className="like flex space-between w-abs">
            <div>
              {items.liked ? (
                <div
                  className="cover flex"
                  onClick={(event) => like(event, items.tokenId)}
                >
                  <i className="material-icons">favorite</i>
                  <p>{items.likes}</p>
                </div>
              ) : (
                <div
                  className="cover flex"
                  onClick={(event) => like(event, items.tokenId)}
                >
                  <i className="material-icons">favorite_border</i>
                  <p>{items.likes}</p>
                </div>
              )}
            </div>
            <button
              className="btn cover"
              onClick={() => nav.push(`/nft/${items.tokenId}`)}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

  // console.log(state.myNFTs)

  return (
    <section className="my-nfts">
      {state.auth ? (
        <>
          <h1 style={{ marginBottom: "1rem" }}>My NFTs</h1>
          {console.log(state.MyNFTs)}
          {state.loading && <GrRotateLeft className="rotate" fontSize={20}/>}
          {state.myNFTs[0] === "You dont own any NFT" ? (
            <p>You dont own any NFT</p>
          ): <div className="nft-items">{arr}</div>}{" "}


        </>
      ) : (
        <p>Connect Your Wallet!</p>
      )}
    </section>
  );
};
