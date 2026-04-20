function MultiStepForm() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a 3-step form (personal info → contact details → review & submit) with back/next
        navigation. Use <code>useReducer</code> with a discriminated union action type to manage
        step transitions and accumulated form data. The review step should display all collected
        values before final submission.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default MultiStepForm;
