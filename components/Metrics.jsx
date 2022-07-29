import { GlobalContext } from '../context/GlobalContext'
import { useContext } from 'react'
import { MdOutlineGeneratingTokens } from "react-icons/md";
import { SiEthereum } from "react-icons/si";
import { AiOutlineDollarCircle } from 'react-icons/ai';

export const Metrics = () => {
  const { state } = useContext(GlobalContext);

    return  <section className='metrics'>
    <div className='items'>
      <div className='item flex glassmorphism'>
        <div className="left">
          <SiEthereum fontSize={50} />
        </div>
        <div className='right'>
          <h2>Eth</h2>
          <p>{state.walletBalance}ETH</p>
        </div>
      </div>
      <div className='item flex glassmorphism'>
        <div className="left">
          <AiOutlineDollarCircle fontSize={50} />
        </div>
        <div className='right'>
          <h2>Balance</h2>
          <p>${state.earnings}</p>
        </div>
      </div>
      <div className='item flex glassmorphism'>
        <div className="left">
          <MdOutlineGeneratingTokens fontSize={50} />
        </div>
        <div className='right'>
          <h2>NFTs</h2>
          <p>{state.noOfNFTs}({state.totalNFTsEth}ETH)</p>
        </div>
      </div>
    </div>
  </section>
}