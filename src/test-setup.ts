import '@testing-library/jest-dom';

let store: Record<string, string> = {};

const localStorageMock: Storage = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] ?? null,
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
