import { GlobalContext } from '../context/GlobalContext'
import { useContext } from 'react'
import Head from "next/head";
import { SideBar } from '../components/SideBar';
import { Header } from '../components/Header';
import { Metrics } from '../components/Metrics';
import { MyNFTs } from '../components/MyNFTs';
import { BottomNav } from '../components/BottomNav';
import { Alert } from '../components/Alert';


export default function Dashboard() {
  const { state } = useContext(GlobalContext);

  return (
    <div className='App gradient-4-bg-welcome'>
      <Head>
        <title>NFTs</title>
        <meta name="description" content="NFTs MarketPlace" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" />
      </Head>
      <div className='body flex row'>
        <div className='w-max-content h-mc'>
          <SideBar />
        </div>
        <div className='flex col space-between main w-abs'>
          <Header />
          <main>
            <div className='scrollpage'>
              <Metrics />
              <MyNFTs />
              {state.alert && <Alert value={state.msg} type={state.alertType}/>}

            </div>
          </main>
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
