import NestedCheckboxes from './NestedCheckboxes';

function NestedCheckboxesDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a parent/children checkbox group. Checking the parent selects all children;
        unchecking it deselects all. When only some children are checked, the parent should
        show a native indeterminate state set via a ref.
      </p>
      <NestedCheckboxes
        parent="Fruits"
        children={['Apple', 'Banana', 'Mango', 'Orange']}
      />
    </div>
  );
}

export default NestedCheckboxesDemo;
