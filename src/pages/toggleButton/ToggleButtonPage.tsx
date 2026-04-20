import useToggle from './useToggle';
import styles from './ToggleButton.module.css';


function ToggleButton() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a custom useToggle hook that encapsulates a boolean state and a toggle function.
        Return them as a typed tuple. Consume the hook in a button that changes its label and
        CSS class based on the active state.
      </p>
      <button onClick={toggle} className={`${styles.toggle} ${isOn ? styles.on : styles.off}`}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}


export default ToggleButton;
