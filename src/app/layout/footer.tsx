import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Dancing_Script } from 'next/font/google';
import style from "./styles/Footer.module.css";

const dancing = Dancing_Script({ 
  subsets: ["latin"],
});

const fontStyle = {
  color: "red",
  fontSize: "25px"
}

export default function Footer() {
  return (
      <div className={style.footer}>
        <span className={style.text}>
          Desenvolvido com <FontAwesomeIcon icon={faHeart} className={style.red} /> por
          <span className={dancing.className} style={fontStyle}> Maisa</span>.
        </span>
      </div>
  )
}