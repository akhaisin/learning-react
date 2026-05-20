function useUndo<T>(initialValue: T) {
  // TODO: Keep past, present, and future values in state.
  return [initialValue, (_value: T) => undefined, () => undefined, () => undefined, false, false] as const;
}

export default useUndo;