import { useEffect, useMemo, useState } from 'react';
import styles from './Component.module.css';
import { getMatchingSuggestions } from './utils';

type AutocompleteProps = {
  debounceMs?: number;
};

function useLocalDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (delay <= 0) {
      setDebouncedValue(value);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return delay <= 0 ? value : debouncedValue;
}

function Autocomplete({ debounceMs = 250 }: AutocompleteProps) {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useLocalDebouncedValue(query, debounceMs);
  const items = useMemo(() => getMatchingSuggestions(debouncedQuery), [debouncedQuery]);

  const handleSelect = (value: string) => {
    setQuery(value);
    setIsOpen(false);
  };

  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build an autocomplete input that fetches suggestions after a debounced delay, renders a
        dropdown list, and supports keyboard navigation (↑/↓ to move, Enter to select, Escape to
        close). Use the debounce pattern from the TextDebounce exercise and manage open/closed,
        highlighted index, and suggestion list as separate state.
      </p>

      <div className={styles.field}>
        <input
          value={query}
          placeholder="Search fruit"
          onChange={(event) => {
            const nextValue = event.currentTarget.value;
            setQuery(nextValue);
            setHighlightedIndex(0);
            setIsOpen(nextValue.trim() !== '');
          }}
          onKeyDown={(event) => {
            if (items.length === 0) {
              if (event.key === 'Escape') setIsOpen(false);
              return;
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setIsOpen(true);
              setHighlightedIndex((currentIndex) => (currentIndex + 1) % items.length);
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setIsOpen(true);
              setHighlightedIndex((currentIndex) => (currentIndex - 1 + items.length) % items.length);
            }

            if (event.key === 'Enter' && isOpen) {
              event.preventDefault();
              handleSelect(items[highlightedIndex]);
            }

            if (event.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        />

        {isOpen ? (
          <ul className={styles.menu}>
            {items.map((item, index) => (
              <li
                key={item}
                className={`${styles.item} ${index === highlightedIndex ? styles.active : ''}`}
                onMouseDown={() => handleSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export default Autocomplete;
