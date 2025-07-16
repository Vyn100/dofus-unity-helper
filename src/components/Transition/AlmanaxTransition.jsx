import "./AlmanaxTransition.css";
import AlmanaxIcon from "../../assets/Almanax.png";


const AlmanaxTransition = ({ active }) => {
  return (
    active && (
      <div className="almanax-transition">
        <img src={AlmanaxIcon} alt="Transition vers Almanax" />
      </div>
    )
  );
};

export default AlmanaxTransition;
