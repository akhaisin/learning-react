import TodoList from './TodoList';

function TodoListDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a todo list. Add items via a textarea, mark them done with strikethrough, and delete
        them. Manage a list of typed objects in state; use functional updates to avoid stale closures.
      </p>
      <TodoList />
    </div>
  );
}

export default TodoListDemo;
