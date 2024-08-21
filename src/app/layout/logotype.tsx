import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTooth } from '@fortawesome/free-solid-svg-icons';

export default function Logotype() {
  return (
    <div className="flex justify-center mt-5 mb-3">
      <FontAwesomeIcon icon={faTooth} style={{color: "#86cafe", zoom: 4}} />
    </div>
  )
}