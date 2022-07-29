import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";
import Image from "next/image";
import Logo from "../assets/img.jpg";
import { SiEthereum } from "react-icons/si";
import { useRouter } from "next/router";

export const NFTs = () => {
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

  const arr = state.NFTs.map((items, i) => (
    <div
      className="item glassmorphism"
      key={i}
    >
      <div className="img" >
      
      <img src={items.image}/>

        <div className="content">
          <div className="flex space-between">
            <p className="name">{items.name}</p>
            <p className="price">
              <SiEthereum />
              {items.price}
            </p>
          </div>
          {/* <div className="flex space-between">
              <p className="description">{items.description}</p>
            </div> */}
           <div className="like flex w-abs w-abs space-between">
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
              <button className="btn cover" onClick={() => nav.push(`/nft/${items.tokenId}`)}>View</button>
            </div>
        </div>
      </div>
    </div>
  ));

  const trending = state.NFTs.map((items, i) =>
    items?.likes >= 2 && (
      <div
        className="item glassmorphism"
        key={i}
      >
        <div className="img">
          {/* <Image src={items.image} height={250} width={40}/> */}

          <img src={items.image}/>

          <div className="content">
            <div className="flex space-between">
              <p className="name">{items.name}</p>
              <p className="price">
                <SiEthereum />
                {items.price}
              </p>
            </div>
            {/* <div className="flex space-between">
              <p className="description">{items.description}</p>
            </div> */}
            <div className="like flex w-abs w-abs space-between">
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
              <button className="btn cover" onClick={() => nav.push(`/nft/${items.tokenId}`)}>View</button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <section className="nfts">
      {state.auth ?  <>
      <h1 style={{ marginBottom: "1rem" }}>NFTs</h1>
      <h4 style={{ marginBottom: "1rem" }}>Trending</h4>

      <div className="slide">
        {state.NFTs.length === 0 ? (
          <h2>No Trending NFT int the Markey</h2>
        ) : trending
        
        }
      </div>

      <h4 style={{ marginBottom: "1rem" }}>Market</h4>

      {state.NFTs.length === 0 ? (
        <h2>No NFT in the market</h2>
      ) : (
        <div className="nft-items">{arr}</div>
      )}
      </>
     : <p>Connect your wallet!</p>}
     
    </section>
  );
};
