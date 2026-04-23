import TodoList from './TodoList';

function TodoListDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build the same todo list using <code>useReducer</code>. Model all state — the draft input
        and the item list — as a single reducer with typed actions. Each action describes an intent
        (<code>ADD</code>, <code>TOGGLE</code>, <code>DELETE</code>, <code>SET_DRAFT</code>);
        the reducer is the only place that mutates state.
      </p>
      <TodoList />
    </div>
  );
}

export default TodoListDemo;
