import { useState } from 'react';
import styles from './Component.module.css';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function FormWithValidation() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  const emailError = email.length === 0 ? 'Email is required.' : isValidEmail(email) ? '' : 'Enter a valid email.';
  const passwordError =
    password.length === 0 ? 'Password is required.' : password.length >= 8 ? '' : 'Password must be at least 8 characters.';
  const isFormValid = emailError === '' && passwordError === '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid) return;
    setSubmitted(true);
  };

  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a login form with real-time validation — no library. Derive error messages directly
        from the input values (email format check, password minimum length) without extra state.
        Show errors only after a field has been touched. Disable the submit button while the form
        is invalid and show a success message on submit.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
              setSubmitted(false);
            }}
            onBlur={() => setTouched((current) => ({ ...current, email: true }))}
            placeholder="jane@example.com"
          />
        </label>
        {touched.email && emailError ? <p className={styles.error}>{emailError}</p> : null}

        <label className={styles.field}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
              setSubmitted(false);
            }}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            placeholder="At least 8 characters"
          />
        </label>
        {touched.password && passwordError ? <p className={styles.error}>{passwordError}</p> : null}

        <button type="submit" className={styles.submitButton} disabled={!isFormValid}>
          Submit
        </button>

        {submitted ? <p className={styles.success}>Signed in successfully.</p> : null}
      </form>
    </section>
  );
}

export default FormWithValidation;
