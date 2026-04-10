import NestedCheckboxes from '../../components/nestedCheckboxes/NestedCheckboxes';

function NestedCheckboxesDemo() {
  return (
    <NestedCheckboxes
      parent="Fruits"
      children={['Apple', 'Banana', 'Mango', 'Orange']}
    />
  );
}

export default NestedCheckboxesDemo;
