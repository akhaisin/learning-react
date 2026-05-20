import styles from './Component.module.css';

function MultiStepForm() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a 3-step form (personal info → contact details → review & submit) with back/next
        navigation. Use <code>useReducer</code> with a discriminated union action type to manage
        step transitions and accumulated form data. The review step should display all collected
        values before final submission.
      </p>

      <section className={styles.card}>
        {/* TODO: Add reducer-driven step navigation and a review step. */}
      </section>
    </section>
  );
}

export default MultiStepForm;