import { useEffect, useState, type ReactNode } from "react";

function PhoneInput() {
  const [text, setText] = useState("");


  return (
    <div>
        <input onChange={(e) => setText(e.target.value)}>
            
        </input>
    </div>
  );
}


export default PhoneInput;