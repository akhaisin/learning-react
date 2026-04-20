import TransferList from './TransferList';

function TransferListDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a transfer list with two multi-select columns and four move buttons: move selected
        left→right, move all left→right, and the reverse. Track selected IDs as separate state
        from item lists and clear selections after each move.
      </p>
      <TransferList
        left={['React', 'Vue', 'Svelte', 'Solid']}
        right={['Angular', 'Ember']}
      />
    </div>
  );
}

export default TransferListDemo;
