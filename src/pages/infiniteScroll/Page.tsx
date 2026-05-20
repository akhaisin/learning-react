import Component from './Component';

function Page() {
  return (
    <div data-demo-scroll-root="true" style={{ maxHeight: '32rem', overflowY: 'auto', paddingRight: '0.25rem' }}>
      <Component />
    </div>
  );
}

export default Page;
