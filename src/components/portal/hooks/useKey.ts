import { useRef } from 'react';

interface IUseKey {
  generateKey(): string;
  removeKey(key: string): void;
}

// Generates a random key
const keyGenerator = (): string => {
  const randomStr = () => Math.random().toString(36).slice(2, 18);
  return `portalize_${randomStr()}-${randomStr()}-${randomStr()}`;
};

export const useKey = (): IUseKey => {
  const usedKeys = useRef<Set<string>>(new Set());

  const generateKey = (): string => {
    const newKey = keyGenerator();
    usedKeys.current.add(newKey);
    return newKey;
  };

  const removeKey = (key: string): void => {
    usedKeys.current.delete(key);
  };

  return { generateKey, removeKey };
};
