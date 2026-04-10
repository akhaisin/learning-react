import TransferList from '../../components/transferList/TransferList';

function TransferListDemo() {
  return (
    <TransferList
      left={['React', 'Vue', 'Svelte', 'Solid']}
      right={['Angular', 'Ember']}
    />
  );
}

export default TransferListDemo;
