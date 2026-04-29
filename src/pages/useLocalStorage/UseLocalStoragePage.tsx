import useLocalStorage from './useLocalStorage.ts'
import styles from './UseLocalStoragePage.module.css'

function UseLocalStorage() {
  const [input1, setInput1] = useLocalStorage("learning-react.v1.useLocalStorage.input1", "")
  const [input2, setInput2] = useLocalStorage("learning-react.v1.useLocalStorage.input2", "")
  const [input3, setInput3] = useLocalStorage("learning-react.v1.useLocalStorage.input3", "")

  return (
    <div className={styles.page}>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a generic <code>useLocalStorage&lt;T&gt;(key, initialValue)</code> custom hook that
        reads from and writes to localStorage, serializing values as JSON. It should return a
        [value, setter] tuple identical to useState. Demonstrate it with a form whose fields
        survive a page refresh.
      </p>

      <form onSubmit={(e) => e.preventDefault()}>
        <ul className={styles.list}>
          <li>
            <label>Input 1:
              <input
                type='text'
                name='input1'
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
              />
            </label>
          </li>
          <li>
            <label>Input 2:
              <input
                type='text'
                name='input2'
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
              />
            </label>
          </li>
          <li>
            <label>Input 3:
              <input
                type='text'
                name='input3'
                value={input3}
                onChange={(e) => setInput3(e.target.value)}
              />
            </label>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default UseLocalStorage;
