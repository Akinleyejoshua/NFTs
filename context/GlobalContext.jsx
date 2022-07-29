import { createContext, useEffect, useState } from "react";
import { GrRotateLeft } from "react-icons/gr";
import { ethers, utils } from "ethers";
import axios from "axios";

import { contract as contractAddress, abi } from "../assets/constants";

const initialState = {
  state: {},
  handleStateChange: () => {},
  shortenAddress: () => {},
  likeNFT: () => {},
  connectWallet: () => {},
  createEthereumContract: () => {},
  logout: () => {},
  getUserData: () => {},
  showAlert: () => {}
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  let token;

  useEffect(() => {
    token = window?.localStorage?.getItem("account");
  }, []);

  const [state, setState] = useState({
    contractAddress: contractAddress,
    walletAddress: "",
    walletBalance: <GrRotateLeft fontSize={20} className="rotat" />,
    earnings: <GrRotateLeft fontSize={20} className="rotat" />,
    noOfNFTs: <GrRotateLeft fontSize={20} className="rotat" />,
    totalNFTsEth: <GrRotateLeft fontSize={20} className="rotat" />,
    myNFTs: [],
    NFTs: [],
    auth: token === null || token === undefined ? false : true,
    msg: "",
    msgType: "",
    alert: false,
    alertType: "",
  });

  const logout = () => {
    setState({
      contractAddress: contractAddress,
      walletAddress: "",
      walletBalance: <GrRotateLeft fontSize={20} className="rotat" />,
      earnings: <GrRotateLeft fontSize={20} className="rotat" />,
      noOfNFTs: <GrRotateLeft fontSize={20} className="rotat" />,
      totalNFTsEth: <GrRotateLeft fontSize={20} className="rotat" />,
      myNFTs: [],
      NFTs: [],
      auth: false,
      msg: "",
      msgType: "",
      loading: false,
    });
  };

  const createEthereumContract = () => {
    // const provider = new ethers.providers.JsonRpcProvider(
    //   "http://127.0.0.1:8545/"
    // );
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    let contractEth = new ethers.Contract(contractAddress, abi, signer);
    return contractEth;
  };

  async function getTokenData(tokenId) {
    const contract = createEthereumContract();
    const trx = await contract.getAllNFTs();
    let sumPrice = 0;
    handleStateChange("noOfNFTs", trx.length);

    if (trx.length === 0) return handleStateChange("totalNFTsEth", sumPrice);

    const items = await Promise.all(
      trx.map(async (items) => {
        const tokenURI = await contract.tokenURI(items.tokenID);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = utils.formatUnits(items.price.toString(), "ether");
        let item = {
          tokenId: items.tokenID.toNumber(),
          seller: items.seller,
          owner: items.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          price: price,
          likes: items.likes.toNumber(),
        };

        sumPrice += Number(price);

        return item;
      })
    );

    handleStateChange("totalNFTsEth", sumPrice.toFixed(2));
    handleStateChange("NFTs", items);
  }

  async function getMyTokens() {
    const contract = createEthereumContract();
    const trx = await contract.getMyNFTs();

    const items = await Promise.all(
      trx.map(async (items) => {
        const tokenURI = await contract.tokenURI(items.tokenID);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = utils.formatUnits(items.price.toString(), "ether");
        let item = {
          tokenId: items.tokenID.toNumber(),
          seller: items.seller,
          owner: items.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          price: price,
          likes: items.likes.toNumber(),
        };

        return item;
      })
    );

    if (items) return handleStateChange("myNFTs", items);
    handleStateChange("myNFTs", "You have no NFT");
  }

  const handleStateChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const showAlert = (type, msg) => {
    handleStateChange("alert", true);
    handleStateChange("alertType", type);
    handleStateChange("msg", msg);
  };

  const shortenAddress = (address) => {
    return (
      <div
        className="shorten-address"
        onClick={() => {
          navigator.clipboard.writeText(address);
          alert("Copied!");
        }}
      >{`${address.slice(0, 5)}...${address.slice(address.length - 4)}`}</div>
    );
  };

  const likeNFT = async (liked, id) => {
    const contract = createEthereumContract();
    const trx = await contract.updateLikes(id, liked);
    // console.log(trx);
  };

  const getBalances = async (wallet) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);

      const balance = await provider.getBalance(wallet);
      balance.toString();
      const eth = ethers.utils.formatEther(balance);
      const amount = parseFloat(Number(eth).toFixed(1) * 1574.81).toFixed(2);
      const bal = Number(eth).toFixed(6);

      handleStateChange("walletBalance", bal);
      handleStateChange("earnings", amount);
    } catch (err) {
      console.log(err);
      null;
    }

    // prints 1.0
  };

  const getUserData = async () => {
    await getMyTokens();
    await getTokenData();
  };

  const checkIfConnected = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      // console.log(accounts);
      if (accounts.length > 0) {
        handleStateChange("auth", true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const addr = await provider.getSigner().getAddress();
        handleStateChange("walletAddress", addr);
        getBalances(addr);
        getUserData();
      }
    } catch (err) {
      // alert("Please install A Wallet");
      showAlert("Plase install a wallet");
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (chainId !== "0x5") {
        //alert('Incorrect network! Switch your metamask network to Rinkeby');
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (typeof window !== undefined) {
        window?.localStorage?.setItem("account", accounts[0]);
      }

      handleStateChange("walletAddress", accounts[0]);
      handleStateChange("auth", true);
      getBalances(state.walletAddress);
      getUserData();
    } catch (error) {
      console.log(error);
      alert("Authentication failed");
    }
  };

  useEffect(() => {
    checkIfConnected();
    console.log(1);
  }, [token]);

  return (
    <GlobalContext.Provider
      value={{
        state,
        getUserData,
        shortenAddress,
        likeNFT,
        createEthereumContract,
        connectWallet,
        logout,
        handleStateChange,
        showAlert
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
