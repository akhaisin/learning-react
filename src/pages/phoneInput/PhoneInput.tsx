import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import styles from './PhoneInput.module.css';


function PhoneInput() {

  return (
    <div>
      <span className={styles['phone-number-label']}>Phone:</span>
      <PhoneNumberInput maxLength={10}/>
    </div>
  );
}


export default PhoneInput;