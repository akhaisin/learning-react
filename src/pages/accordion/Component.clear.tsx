import styles from './Component.module.css';

function Accordion() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a collapsible accordion component that renders a list of panels, each with a
        clickable header and a toggleable body. Use <code>useState</code> to track the currently
        open panel by id, and conditionally render each panel's content based on whether its id
        matches the active one. Define a TypeScript interface for the panel data and accept the
        list as a typed prop.
      </p>

      <div className={styles.accordion}>
        {/* TODO: Render the panel list and keep the active panel id in state. */}
      </div>
    </section>
  );
}

export default Accordion;