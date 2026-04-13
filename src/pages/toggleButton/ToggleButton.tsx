import useToggle from './useToggle';
import styles from './ToggleButton.module.css';


function ToggleButton() {
  const [isOn, toggle] = useToggle(false);
  
  return (
    <button onClick={toggle} className={`${styles.toggle} ${isOn ? styles.on : styles.off}`}>
      {isOn ? 'ON' : 'OFF'}
    </button>

  );
}


export default ToggleButton;