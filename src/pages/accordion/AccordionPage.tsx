import styles from './Accordion.module.css';

function Accordion() {
  return (
    <div>
      <p className={styles.description}>
        Build a collapsible accordion component that renders a list of panels, each with a
        clickable header and a toggleable body. Use <code>useState</code> to track the currently
        open panel by id, and conditionally render each panel's content based on whether its id
        matches the active one. Define a TypeScript interface for the panel data and accept the
        list as a typed prop.
      </p>
      <p className={styles.placeholder}>Not implemented yet.</p>
    </div>
  );
}

export default Accordion;
