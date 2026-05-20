import styles from './Component.module.css';

function FormWithValidation() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a login form with real-time validation — no library. Derive error messages directly
        from the input values (email format check, password minimum length) without extra state.
        Show errors only after a field has been touched. Disable the submit button while the form
        is invalid and show a success message on submit.
      </p>

      <form className={styles.form}>
        {/* TODO: Add controlled inputs, touched tracking, derived errors, and submit state. */}
      </form>
    </section>
  );
}

export default FormWithValidation;