import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import styles from './PhoneNumberInput.module.css';


function PhoneNumberInput({ maxLength = 10}) {
  const [input, changeInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const positionRef = useRef(0);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const selectionStart = e.target.selectionStart;

    const numbers = value.replace(/[^0-9]/g, "");
    const length = numbers.length;

    if (length > maxLength) return;

    const formatted = [];

    for (let idx = 0; idx < length; idx++) {

      if(length > 3 && idx === 0) {
        formatted.push("(");
      }

      formatted.push(numbers[idx]);

      if (length > 6 && idx === 5){
        formatted.push("-");
      }

      if (length > 3 && idx === 2){
        formatted.push(")");
      }

    }

    const lengthDiff = formatted.length - value.length;
    if (selectionStart) {
      positionRef.current = selectionStart + lengthDiff;
    }

    changeInput(formatted.join(""));
  };

  useEffect(
    () => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(
          positionRef.current,
          positionRef.current
        );
      }
    }, [input]);

  return (
    <input
      value={input}
      onChange={onChange}
      className={styles['phone-number']}
      ref={inputRef}
    />
  );
}


export default PhoneNumberInput;
