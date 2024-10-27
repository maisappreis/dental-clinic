import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Dancing_Script } from 'next/font/google';
import styles from "./styles/Footer.module.css";

const dancing = Dancing_Script({ 
  subsets: ["latin"],
});

const fontStyle = {
  color: "red",
  fontSize: "20px"
}

export default function Footer() {
  return (
      <div className={styles.footer}>
        <span className={styles.text}>
          Desenvolvido com <FontAwesomeIcon icon={faHeart} className={styles.red} /> por
          <span className={dancing.className} style={fontStyle}> Maisa</span>.
        </span>
      </div>
  )
}