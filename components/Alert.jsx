import { useContext } from "react"
import {AiOutlineCheckCircle, AiOutlineInfoCircle} from "react-icons/ai"
import { GlobalContext } from "../context/GlobalContext"

export const Alert = ({type, value}) => {
    const {handleStateChange} = useContext(GlobalContext);

    return <div className="alert">
        <div className="content glassmorphism cover" onClick={() => handleStateChange("alert", false)}>
            {type === "d" ? <AiOutlineInfoCircle className={`icon alert-danger`}/>: <AiOutlineCheckCircle className="icon alert-success"/>}
            <p className="value">
                {value}
            </p>
        </div>
    </div>
}