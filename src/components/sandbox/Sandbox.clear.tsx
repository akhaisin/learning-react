import { useState } from 'react';
import styles from './Sandbox.module.css';

function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((prev) => !prev);

  return [value, toggle];
}

function Sandbox() {
  const [isOn, toggle] = useToggle(false);

  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Use Sandbox for exploring ideas.
      </p>
      <button onClick={toggle} className={`${styles.toggle} ${isOn ? styles.on : styles.off}`}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

export default Sandbox;
