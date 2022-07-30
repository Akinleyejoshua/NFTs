import { GlobalContext } from '../../context/GlobalContext'
import { useContext, useEffect, useState } from 'react'
import Head from "next/head";
import { SideBar } from '../../components/SideBar';
import { Header } from '../../components/Header';
import { SiEthereum } from 'react-icons/si';
import { BottomNav } from '../../components/BottomNav';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import axios from 'axios';

import { AiOutlineTransaction, AiOutlineUser } from 'react-icons/ai';
import { GrRotateLeft } from 'react-icons/gr';
import { Alert } from '../../components/Alert';

export default function MarketPlace() {
  const { state, createEthereumContract, showAlert, likeNFT } = useContext(GlobalContext);

  const [nft, setNFT] = useState({
    tokenId: "",
    seller: "",
    owner: "",
    image: "",
    name: "",
    description: "",
    price: "",
    likes: ""
  })

  const router = useRouter();

  const { id } = router.query;

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

  async function loadNFTData(id) {
    try {
      const items = state.NFTs.filter(items => items.tokenId == id).map(items => {
        let item = {
          tokenId: items.tokenId,
          seller: items.seller,
          owner: items.owner,
          image: items.image,
          name: items.name,
          description: items.description,
          price: items.price,
          likes: items.likes,
          liked: items.liked,
        };

        setNFT(item);
      });

      if (items.length !== 0) return;

      const contract = createEthereumContract();
      const tokenURI = await contract.tokenURI(id);
      const listedToken = await contract.getListedTokenForId(id);
      let meta = await axios.get(tokenURI);
      meta = meta.data;
      // console.log(listedToken);

      let item = {
        price: meta.price,
        tokenId: id,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
      }

      setNFT(item);
    } catch (err) {
      console.log(err)
    }

  }

  async function buyNFT(tokenId) {
    if (!state.auth) showAlert("d", "Connect Wallet");
    if (!state.auth) return;
    try {
      const contract = createEthereumContract();
      const salePrice = ethers.utils.parseUnits(nft.price, 'ether')
      showAlert("s", "Buying the NFT... Please Wait (Upto 5 mins)")
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, { value: salePrice });
      await transaction.wait();

      showAlert("s", 'You successfully bought the NFT!');
    }
    catch (e) {
      showAlert("d", "You dont have enough Eth")
    }
  }
  useEffect(() => {
    loadNFTData(id);
  }, [id])


  return (
    <div className='App gradient-4-bg-welcome'>
      <Head>
        <title>NFTs</title>
        <meta name="description" content="NFTs MarketPlace" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" />
      </Head>
      <div className='body flex w-abs'>
        <div className='w-max-content h-mc'>
          <SideBar />
        </div>
        <div className='flex col space-between main w-abs view-nft'>
          <Header />
          {state.alert && <Alert value={state.msg} type={state.alertType}/>}

          <main>
            <div className='scrollpage'>
              <div className='nfts nft-view'>
                <div className="item glassmorphism">
                  <div className="img">
                    {/* <Image src={Logo} /> */}
                    {/* <img src={nft.image} /> */}
                    {nft.tokenId === "" ? <GrRotateLeft fontSize={20} className="rotate" /> : <img src={nft.image} />}
                    <div className="content">
                      <div className="flex space-between">
                        <p className="name">{nft.name}</p>
                        <p className="price">
                          <SiEthereum />
                          {nft.price}
                        </p>
                      </div>
                      <div className="flex space-between">
                        <p className="description">{nft.description}</p>
                      </div>
                      <div className="like flex space-between w-abs">
                        <div>
                          {nft.liked ? (
                            <div className="cover flex" onClick={(event) => like(event, 1)}>
                              <i className="material-icons">
                                favorite
                              </i>
                              <p>{nft.likes}</p>
                            </div>
                          ) : (
                            <div className="cover flex" onClick={(event) => like(event, 1)}>
                              <i className="material-icons">
                                favorite_border
                              </i>
                              <p>{nft.likes}</p>
                            </div>
                          )}
                        </div>

                        {state.walletAddress === nft.seller ? <button className='btn cover'>

                          <AiOutlineUser fontSize={20} />
                          <p>Owner</p>
                        </button> : <button className='btn cover' onClick={() => buyNFT(nft.tokenId)}>

                          <AiOutlineTransaction fontSize={20} />
                          <p>Buy</p>
                        </button>}

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <BottomNav />

        </div>
      </div>
    </div>
  )
}
