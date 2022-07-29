import { GlobalContext } from "../context/GlobalContext";
import { useContext, useState } from "react";
import Head from "next/head";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { MdOutlineImage, MdOutlineInput } from "react-icons/md";
import { SiAddthis, SiEthereum } from "react-icons/si";
import { BottomNav } from "../components/BottomNav";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../utils/pinata";
import Image from "next/image";
import { GrRotateLeft } from "react-icons/gr";
import { ethers } from "ethers";
import { Alert } from "../components/Alert";

export default function ListNFT() {
  const { state, handleStateChange, createEthereumContract, showAlert, getUserData } = useContext(GlobalContext);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    img: "",
  });
  const [fileURL, setFileURL] = useState(null);

  // function encodeImageFileAsURL(e) {
  //   var file = e.target.files[0];
  //   setForm({ ...form, img: URL.createObjectURL(file) });

  //   var reader = new FileReader();
  //   reader.onloadend = function() {
  //     console.log('RESULT', reader.result)
  //   }
  //   reader.readAsDataURL(file);
  //   console.log(reader)
  // }

  async function onChangeFile(e) {
    var file = e.target.files[0];
    handleStateChange("loading", true)

    setForm({ ...form, img: <GrRotateLeft fontSize={20} className="rotate" /> });

    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        handleStateChange("loading", false)
        setForm({ ...form, img: URL.createObjectURL(file) });
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);

      } else {
        setForm({ ...form, img: "upload failed" });
      }
    } catch (e) {
      console.log("Error during file upload", e);
      // setForm({ ...form, img: "error" });
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price } = form;
    //Make sure that none of the fields are empty

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  async function listNFT(e) {
    e.preventDefault();
    handleStateChange("msg", "")
    const { name, description, price } = form;

    if (!name || !description || !price || !fileURL) return handleStateChange("msg", "All fields are required");

    if (!Number(price)) return handleStateChange("msg", "Invalid Eth Price");

    const metadataURL = await uploadMetadataToIPFS();

    const contract = createEthereumContract();
    const priceEth = ethers.utils.parseUnits(form.price, 'ether')
    let listingPrice = await contract.getListPrice()
    listingPrice = listingPrice.toString()
    console.log(contract)

    //actually create the NFT
    let transaction = await contract.createToken(metadataURL, priceEth, { value: listingPrice });
    showAlert("s", "Please wait!");

    await transaction.wait()

    showAlert("s", "Successfully listed your NFT!");
    getUserData();
    // setForm({ name: '', description: '', price: '', img: ""});

  }

  return (
    <div className="App gradient-4-bg-welcome">
      <Head>
        <title>NFTs</title>
        <meta name="description" content="NFTs MarketPlace" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" />
      </Head>
      <div className="body flex w-abs">
        <div className="w-max-content h-mc">
          <SideBar />
        </div>
        <div className="flex col space-between main w-abs">
          <Header />
          {state.alert && <Alert value={state.msg} type={state.alertType}/>}

          <main>
            <div className="scrollpage">
              <div className="create-nft">
                <div className="input-file">
                  {form.img === "" ? (
                    <MdOutlineImage />
                  ) : (
                    <>
                      {state.loading ? form.img : <Image src={form.img} layout="fill" />}
                    </>
                  )}

                  <input type="file" onChange={onChangeFile} />
                </div>
                <div className="input-bar">
                  <MdOutlineInput />
                  <input placeholder="NFT Name" onChange={event => setForm({ ...form, name: event.target.value })} />
                </div>
                <div className="input-bar">
                  <MdOutlineInput />
                  <input placeholder="NFT Descriptions" onChange={event => setForm({ ...form, description: event.target.value })} />
                </div>
                <div className="input-bar">
                  <SiEthereum />
                  <input placeholder="NFT Price 0.0001" onChange={event => setForm({ ...form, price: event.target.value })} />
                </div>
                <div className={`msg ${state.msgType}`}>{state.msg}</div>
                <button className="btn" onClick={event => listNFT(event)}>
                  <SiAddthis />
                  <p>Add</p>
                </button>
              </div>
            </div>
          </main>
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
