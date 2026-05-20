function useFetch<T>(_url: string) {
  // TODO: Use AbortController and expose { data, loading, error }.
  return { data: null as T | null, loading: false, error: null as string | null };
}

export default useFetch;