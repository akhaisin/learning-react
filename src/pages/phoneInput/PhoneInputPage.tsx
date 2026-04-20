import PhoneNumberInput from "./PhoneNumberInput";
import styles from './PhoneInput.module.css';


function PhoneInput() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a phone number input that auto-formats to (123) 456-7890 as the user types.
        Use a ref to track and restore cursor position correctly through each formatting change.
      </p>
      <span className={styles['phone-number-label']}>Phone:</span>
      <PhoneNumberInput maxLength={10}/>
    </div>
  );
}


export default PhoneInput;
