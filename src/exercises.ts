export const Tag = {
  State:       'state',
  Hooks:       'hooks',
  Effects:     'effects',
  Refs:        'refs',
  Context:     'context',
  Reducer:     'reducer',
  Forms:       'forms',
  Async:       'async',
  DOM:         'dom',
  DragDrop:    'drag & drop',
  Performance: 'performance',
  TypeScript:  'typescript',
} as const;

export type Tag = typeof Tag[keyof typeof Tag];

export type Exercise = {
  id: string;
  label: string;
  done: boolean;
  tags: Tag[];
};

export const exercises: Exercise[] = [
  // Foundations
{ id: 'toggleButton',         label: 'Toggle Button',       done: true,  tags: [Tag.State, Tag.Hooks] },
  { id: 'starRating',           label: 'Star Rating',         done: true,  tags: [Tag.State] },
  { id: 'progressBar',          label: 'Progress Bar',        done: true,  tags: [Tag.State, Tag.Effects] },
  { id: 'stopWatch',            label: 'Stop Watch',          done: false, tags: [Tag.State, Tag.Effects, Tag.Refs, Tag.Hooks] },
  { id: 'phoneInput',           label: 'Phone Input',         done: true,  tags: [Tag.State, Tag.Refs, Tag.Forms] },

  // State patterns
  { id: 'todoList',             label: 'Todo List',           done: true,  tags: [Tag.State, Tag.Forms] },
  { id: 'nestedCheckboxesDemo', label: 'Nested Checkboxes',  done: true,  tags: [Tag.State, Tag.Refs, Tag.Forms] },
  { id: 'transferList',         label: 'Transfer List',       done: true,  tags: [Tag.State, Tag.Forms] },

  // Filtering & data
  { id: 'textFilter',           label: 'Text Filter',         done: true,  tags: [Tag.State, Tag.Forms] },
  { id: 'textDebounce',         label: 'Text Debounce',       done: true,  tags: [Tag.State, Tag.Hooks, Tag.Performance] },

  // Composition
  { id: 'modalDialogDemo',      label: 'Modal Dialog',        done: true,  tags: [Tag.State, Tag.Forms] },
  { id: 'tikTakToe',            label: 'Tic-Tac-Toe',         done: true,  tags: [Tag.State, Tag.TypeScript] },
  { id: 'accordion',            label: 'Accordion',           done: false, tags: [Tag.State, Tag.TypeScript] },

  // Intermediate hooks
  { id: 'formWithValidation',   label: 'Form With Validation', done: false, tags: [Tag.State, Tag.Forms, Tag.TypeScript] },
  { id: 'multiStepForm',        label: 'Multi-Step Form',     done: false, tags: [Tag.State, Tag.Reducer, Tag.Forms] },
  { id: 'useLocalStorage',      label: 'useLocalStorage',     done: false, tags: [Tag.Hooks, Tag.Effects, Tag.TypeScript] },

  // Context & state machines
  { id: 'themeContext',         label: 'Theme Context',       done: false, tags: [Tag.Context, Tag.Hooks] },
  { id: 'toastNotifications',  label: 'Toast Notifications', done: false, tags: [Tag.Context, Tag.Reducer, Tag.Hooks] },

  // DOM & interaction
  { id: 'dragAndDrop',          label: 'Drag And Drop',       done: false, tags: [Tag.State, Tag.DOM, Tag.DragDrop] },
  { id: 'autocomplete',         label: 'Autocomplete',        done: false, tags: [Tag.State, Tag.Hooks, Tag.Async, Tag.Forms] },

  // Async
  { id: 'useFetch',             label: 'useFetch',            done: false, tags: [Tag.Hooks, Tag.Effects, Tag.Async] },
  { id: 'infiniteScroll',       label: 'Infinite Scroll',     done: false, tags: [Tag.Refs, Tag.Effects, Tag.Async, Tag.DOM] },

  // Advanced
  { id: 'useUndo',              label: 'useUndo',             done: false, tags: [Tag.Hooks, Tag.State, Tag.TypeScript] },
  { id: 'virtualList',          label: 'Virtual List',        done: false, tags: [Tag.Refs, Tag.DOM, Tag.Performance] },
];
