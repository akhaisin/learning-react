import { useReducer } from 'react';
import styles from './TodoList.module.css';

type TodoItem = {
  id: number;
  text: string;
  done: boolean;
};

type State = {
  draft: string;
  items: TodoItem[];
};

type Action =
  | { type: 'SET_DRAFT'; draft: string }
  | { type: 'ADD' }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_DRAFT':
      return { ...state, draft: action.draft };

    case 'ADD': {
      const text = state.draft.trim();
      if (!text) return state;
      return {
        draft: '',
        items: [...state.items, { id: Date.now() + Math.random(), text, done: false }],
      };
    }

    case 'TOGGLE':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, done: !item.done } : item,
        ),
      };

    case 'DELETE':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
  }
}

const initialState: State = { draft: '', items: [] };

function TodoList() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <section className={styles.container}>
      <div className={styles.inputRow}>
        <textarea
          className={styles.input}
          value={state.draft}
          onChange={(event) => dispatch({ type: 'SET_DRAFT', draft: event.currentTarget.value })}
          placeholder="Type a todo item"
        />
        <button type="button" className={styles.addButton} onClick={() => dispatch({ type: 'ADD' })}>
          Add item
        </button>
      </div>

      {state.items.length === 0 ? (
        <p className={styles.empty}>No items yet.</p>
      ) : (
        <ul className={styles.items}>
          {state.items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={`${styles.label} ${item.done ? styles.labelDone : ''}`}>{item.text}</span>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => dispatch({ type: 'TOGGLE', id: item.id })}
              >
                {item.done ? 'Undo' : 'Done'}
              </button>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => dispatch({ type: 'DELETE', id: item.id })}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TodoList;
