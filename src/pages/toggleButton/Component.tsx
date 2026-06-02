import useToggle from './utils';
import styles from './Component.module.css';


function ToggleButton() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <button onClick={toggle} className={`${styles.toggle} ${isOn ? styles.on : styles.off}`}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}


export default ToggleButton;
