import { useEffect, useState } from 'react';
import styles from './TransferList.module.css';

type TransferListProps = {
  left: string[];
  right: string[];
};

type Item = {
  id: string;
  label: string;
};

const toItems = (items: string[], side: 'left' | 'right'): Item[] =>
  items.map((label, index) => ({
    id: `${side}-${index}-${label}`,
    label,
  }));

function TransferList({ left, right }: TransferListProps) {
  const [leftItems, setLeftItems] = useState<Item[]>(() => toItems(left, 'left'));
  const [rightItems, setRightItems] = useState<Item[]>(() => toItems(right, 'right'));

  const [selectedLeftIds, setSelectedLeftIds] = useState<string[]>([]);
  const [selectedRightIds, setSelectedRightIds] = useState<string[]>([]);

  useEffect(() => {
    setLeftItems(toItems(left, 'left'));
    setRightItems(toItems(right, 'right'));
    setSelectedLeftIds([]);
    setSelectedRightIds([]);
  }, [left, right]);

  const moveAllLeftToRight = () => {
    setRightItems((prev) => [...prev, ...leftItems]);
    setLeftItems([]);
    setSelectedLeftIds([]);
  };

  const moveSelectedLeftToRight = () => {
    if (selectedLeftIds.length === 0) return;

    const selectedSet = new Set(selectedLeftIds);
    const moving = leftItems.filter((item) => selectedSet.has(item.id));
    const staying = leftItems.filter((item) => !selectedSet.has(item.id));

    setRightItems((prev) => [...prev, ...moving]);
    setLeftItems(staying);
    setSelectedLeftIds([]);
  };

  const moveSelectedRightToLeft = () => {
    if (selectedRightIds.length === 0) return;

    const selectedSet = new Set(selectedRightIds);
    const moving = rightItems.filter((item) => selectedSet.has(item.id));
    const staying = rightItems.filter((item) => !selectedSet.has(item.id));

    setLeftItems((prev) => [...prev, ...moving]);
    setRightItems(staying);
    setSelectedRightIds([]);
  };

  const moveAllRightToLeft = () => {
    setLeftItems((prev) => [...prev, ...rightItems]);
    setRightItems([]);
    setSelectedRightIds([]);
  };

  const handleLeftSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(event.currentTarget.selectedOptions, (option) => option.value);
    setSelectedLeftIds(values);
  };

  const handleRightSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(event.currentTarget.selectedOptions, (option) => option.value);
    setSelectedRightIds(values);
  };

  return (
    <section className={styles.container}>
      <div className={styles.column}>
        <span className={styles.title}>Left</span>
        <select
          className={styles.list}
          multiple
          value={selectedLeftIds}
          onChange={handleLeftSelection}
          aria-label="Left list"
        >
          {leftItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={moveAllLeftToRight}
          disabled={leftItems.length === 0}
        >
          {'>>'}
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={moveSelectedLeftToRight}
          disabled={selectedLeftIds.length === 0}
        >
          {'>'}
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={moveSelectedRightToLeft}
          disabled={selectedRightIds.length === 0}
        >
          {'<'}
        </button>
        <button
          type="button"
          className={styles.controlButton}
          onClick={moveAllRightToLeft}
          disabled={rightItems.length === 0}
        >
          {'<<'}
        </button>
      </div>

      <div className={styles.column}>
        <span className={styles.title}>Right</span>
        <select
          className={styles.list}
          multiple
          value={selectedRightIds}
          onChange={handleRightSelection}
          aria-label="Right list"
        >
          {rightItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default TransferList;
