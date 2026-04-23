import { useState } from "react";
import styles from './TextDebounce.module.css';
import useDebounce from './useDebounce';
import ListFilter from './ListFilter';
import { FRUITS } from './fruits';

function TextDebounce() {
  const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  return (
    <div>
      <p className={styles.description}>
        Build the same debounced text filter by extracting the debounce logic into a standalone{' '}
        <code>useDebounce.ts</code>{' '}module. The hook accepts a value and a delay, owns its{' '}
        <code>useEffect</code>{' '}and{' '}<code>clearTimeout</code>{' '}cleanup internally, and
        returns the debounced value. The component file imports and calls it like any other hook
        — it has no knowledge of timers or effects.
      </p>
      <input
				type="text"
				placeholder="Type to search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<p>Search term: {debouncedSearchTerm}</p>
			<ListFilter list={FRUITS} filterTerm={debouncedSearchTerm} />
    </div>
  );
}

export default TextDebounce;
