import { useReducer } from 'react';
import styles from './Component.module.css';

type FormState = {
  step: 0 | 1 | 2;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submitted: boolean;
};

type Action =
  | { type: 'update'; field: 'firstName' | 'lastName' | 'email' | 'phone'; value: string }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'submit' };

const initialState: FormState = {
  step: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  submitted: false,
};

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'update':
      return { ...state, [action.field]: action.value, submitted: false };
    case 'next':
      return { ...state, step: Math.min(state.step + 1, 2) as FormState['step'] };
    case 'back':
      return { ...state, step: Math.max(state.step - 1, 0) as FormState['step'] };
    case 'submit':
      return { ...state, submitted: true };
  }
}

function MultiStepForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const canGoNext =
    state.step === 0
      ? state.firstName.trim() !== '' && state.lastName.trim() !== ''
      : state.step === 1
        ? state.email.trim() !== '' && state.phone.trim() !== ''
        : true;

  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a 3-step form (personal info → contact details → review & submit) with back/next
        navigation. Use <code>useReducer</code> with a discriminated union action type to manage
        step transitions and accumulated form data. The review step should display all collected
        values before final submission.
      </p>

      <section className={styles.card}>
        <p className={styles.stepLabel}>Step {state.step + 1} of 3</p>

        {state.step === 0 ? (
          <div className={styles.fields}>
            <label>
              <span>First name</span>
              <input
                value={state.firstName}
                onChange={(event) =>
                  dispatch({ type: 'update', field: 'firstName', value: event.currentTarget.value })
                }
              />
            </label>
            <label>
              <span>Last name</span>
              <input
                value={state.lastName}
                onChange={(event) =>
                  dispatch({ type: 'update', field: 'lastName', value: event.currentTarget.value })
                }
              />
            </label>
          </div>
        ) : null}

        {state.step === 1 ? (
          <div className={styles.fields}>
            <label>
              <span>Email</span>
              <input
                value={state.email}
                onChange={(event) =>
                  dispatch({ type: 'update', field: 'email', value: event.currentTarget.value })
                }
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                value={state.phone}
                onChange={(event) =>
                  dispatch({ type: 'update', field: 'phone', value: event.currentTarget.value })
                }
              />
            </label>
          </div>
        ) : null}

        {state.step === 2 ? (
          <dl className={styles.review}>
            <div>
              <dt>First name</dt>
              <dd>{state.firstName}</dd>
            </div>
            <div>
              <dt>Last name</dt>
              <dd>{state.lastName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{state.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{state.phone}</dd>
            </div>
          </dl>
        ) : null}

        <div className={styles.actions}>
          {state.step > 0 ? (
            <button type="button" className={styles.secondaryButton} onClick={() => dispatch({ type: 'back' })}>
              Back
            </button>
          ) : null}

          {state.step < 2 ? (
            <button type="button" className={styles.primaryButton} disabled={!canGoNext} onClick={() => dispatch({ type: 'next' })}>
              Next
            </button>
          ) : (
            <button type="button" className={styles.primaryButton} onClick={() => dispatch({ type: 'submit' })}>
              Submit
            </button>
          )}
        </div>

        {state.submitted ? <p className={styles.success}>Form submitted successfully.</p> : null}
      </section>
    </section>
  );
}

export default MultiStepForm;
