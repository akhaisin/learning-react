export type Exercise = {
  id: string;
  label: string;
  done: boolean;
};

export const exercises: Exercise[] = [
  // Foundations
  { id: 'aSandbox',             label: 'Sandbox',              done: true  },
  { id: 'toggleButton',         label: 'Toggle Button',        done: true  },
  { id: 'starRating',           label: 'Star Rating',          done: true  },
  { id: 'progressBar',          label: 'Progress Bar',         done: true  },
  { id: 'stopWatch',            label: 'Stop Watch',           done: true  },
  { id: 'phoneInput',           label: 'Phone Input',          done: true  },

  // State patterns
  { id: 'todoList',             label: 'Todo List',            done: true  },
  { id: 'nestedCheckboxesDemo', label: 'Nested Checkboxes',   done: true  },
  { id: 'transferList',         label: 'Transfer List',        done: true  },

  // Filtering & data
  { id: 'textFilter',           label: 'Text Filter',          done: true  },
  { id: 'textDebounce',         label: 'Text Debounce',        done: true  },

  // Composition
  { id: 'modalDialogDemo',      label: 'Modal Dialog',         done: true  },
  { id: 'tikTakToe',            label: 'Tic-Tac-Toe',          done: true  },

  // Intermediate hooks
  { id: 'formWithValidation',   label: 'Form With Validation', done: false },
  { id: 'multiStepForm',        label: 'Multi-Step Form',      done: false },
  { id: 'useLocalStorage',      label: 'useLocalStorage',      done: false },

  // Context & state machines
  { id: 'themeContext',         label: 'Theme Context',        done: false },

  // DOM & interaction
  { id: 'dragAndDrop',          label: 'Drag And Drop',        done: false },
  { id: 'autocomplete',         label: 'Autocomplete',         done: false },

  // Async
  { id: 'useFetch',             label: 'useFetch',             done: false },
  { id: 'infiniteScroll',       label: 'Infinite Scroll',      done: false },

  // Advanced
  { id: 'useUndo',              label: 'useUndo',              done: false },
  { id: 'virtualList',          label: 'Virtual List',         done: false },
];
