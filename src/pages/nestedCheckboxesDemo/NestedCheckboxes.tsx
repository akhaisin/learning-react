import { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './NestedCheckboxes.module.css';

type NestedCheckboxesProps = {
  parent: string;
  children: string[];
};

function NestedCheckboxes({ parent, children }: NestedCheckboxesProps) {
  const baseId = useId();
  const parentCheckboxRef = useRef<HTMLInputElement>(null);

  const [checkedChildren, setCheckedChildren] = useState<boolean[]>(() => children.map(() => false));

  useEffect(() => {
    setCheckedChildren(children.map(() => false));
  }, [children]);

  const checkedCount = useMemo(
    () => checkedChildren.filter(Boolean).length,
    [checkedChildren],
  );

  const allChecked = children.length > 0 && checkedCount === children.length;
  const partiallyChecked = checkedCount > 0 && checkedCount < children.length;

  useEffect(() => {
    if (!parentCheckboxRef.current) return;
    parentCheckboxRef.current.indeterminate = partiallyChecked;
  }, [partiallyChecked]);

  const handleParentChange = (isChecked: boolean) => {
    setCheckedChildren(children.map(() => isChecked));
  };

  const handleChildChange = (index: number, isChecked: boolean) => {
    setCheckedChildren((prev) => {
      const next = [...prev];
      next[index] = isChecked;
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <label className={styles.parentRow}>
        <input
          ref={parentCheckboxRef}
          type="checkbox"
          className={styles.checkbox}
          checked={allChecked}
          onChange={(event) => handleParentChange(event.currentTarget.checked)}
          aria-checked={partiallyChecked ? 'mixed' : allChecked}
        />
        <span>{parent}</span>
      </label>

      <ul className={styles.childrenList}>
        {children.map((label, index) => (
          <li key={`${baseId}-${label}-${index}`}>
            <label className={styles.childRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={checkedChildren[index] ?? false}
                onChange={(event) => handleChildChange(index, event.currentTarget.checked)}
              />
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NestedCheckboxes;
