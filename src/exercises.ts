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

export type Variation = {
  id: string;
  label: string;
  solution: boolean;
};

export type Exercise = {
  id: string;
  label: string;
  solution: boolean;
  tags: Tag[];
  variations?: Variation[];
};

export const exercises: Exercise[] = [
  // Foundations
  { id: 'toggleButton',         label: 'Toggle Button',       solution: true,  tags: [Tag.State, Tag.Hooks] },
  { id: 'starRating',           label: 'Star Rating',         solution: true,  tags: [Tag.State] },
  { id: 'progressBar',          label: 'Progress Bar',        solution: true,  tags: [Tag.State, Tag.Effects] },
  { id: 'stopWatch',            label: 'Stop Watch',          solution: false, tags: [Tag.State, Tag.Effects, Tag.Refs, Tag.Hooks] },
  { id: 'phoneInput',           label: 'Phone Input',         solution: true,  tags: [Tag.State, Tag.Refs, Tag.Forms] },

  // State patterns
  { id: 'todoList',             label: 'Todo List',           solution: true,  tags: [Tag.State, Tag.Forms],
    variations: [
      { id: 'useState',   label: 'useState',   solution: true  },
      { id: 'useReducer', label: 'useReducer', solution: false },
    ],
  },
  { id: 'nestedCheckboxesDemo', label: 'Nested Checkboxes',  solution: true,  tags: [Tag.State, Tag.Refs, Tag.Forms] },
  { id: 'transferList',         label: 'Transfer List',       solution: true,  tags: [Tag.State, Tag.Forms] },

  // Filtering & data
  { id: 'textFilter',           label: 'Text Filter',         solution: true,  tags: [Tag.State, Tag.Forms] },
  { id: 'textDebounce',         label: 'Text Debounce',       solution: true,  tags: [Tag.State, Tag.Hooks, Tag.Performance],
    variations: [
      { id: 'inlineRef',     label: 'inlineRef',       solution: true  },
      { id: 'useDebounce',   label: 'useDebounce hook', solution: true },
    ],
  },

  // Composition
  { id: 'modalDialogDemo',      label: 'Modal Dialog',        solution: true,  tags: [Tag.State, Tag.Forms] },
  { id: 'tikTakToe',            label: 'Tic-Tac-Toe',         solution: true,  tags: [Tag.State, Tag.TypeScript] },
  { id: 'accordion',            label: 'Accordion',           solution: false, tags: [Tag.State, Tag.TypeScript] },

  // Intermediate hooks
  { id: 'formWithValidation',   label: 'Form With Validation', solution: false, tags: [Tag.State, Tag.Forms, Tag.TypeScript] },
  { id: 'multiStepForm',        label: 'Multi-Step Form',     solution: false, tags: [Tag.State, Tag.Reducer, Tag.Forms] },
  { id: 'useLocalStorage',      label: 'useLocalStorage',     solution: true, tags: [Tag.Hooks, Tag.Effects, Tag.TypeScript] },

  // Context & state machines
  { id: 'themeContext',         label: 'Theme Context',       solution: false, tags: [Tag.Context, Tag.Hooks] },
  { id: 'toastNotifications',  label: 'Toast Notifications', solution: false, tags: [Tag.Context, Tag.Reducer, Tag.Hooks] },

  // DOM & interaction
  { id: 'flipBox',              label: 'Flip Box',            solution: true,  tags: [Tag.State, Tag.DOM],
    variations: [
      { id: 'hover', label: 'Flip on Hover', solution: true },
      { id: 'click', label: 'Flip on Click', solution: true },
    ],
  },
  { id: 'dragAndDrop',          label: 'Drag And Drop',       solution: false, tags: [Tag.State, Tag.DOM, Tag.DragDrop] },
  { id: 'autocomplete',         label: 'Autocomplete',        solution: false, tags: [Tag.State, Tag.Hooks, Tag.Async, Tag.Forms] },

  // Async
  { id: 'useFetch',             label: 'useFetch',            solution: false, tags: [Tag.Hooks, Tag.Effects, Tag.Async] },
  { id: 'infiniteScroll',       label: 'Infinite Scroll',     solution: false, tags: [Tag.Refs, Tag.Effects, Tag.Async, Tag.DOM] },

  // Advanced
  { id: 'useUndo',              label: 'useUndo',             solution: false, tags: [Tag.Hooks, Tag.State, Tag.TypeScript] },
  { id: 'virtualList',          label: 'Virtual List',        solution: false, tags: [Tag.Refs, Tag.DOM, Tag.Performance] },
];
