import { useCallback, useEffect, useState } from 'react';

const useKeyPressedListener = (targetKey = 'CONTROL') => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  const downHandler = useCallback(({ key }) => {
    if (key.toUpperCase() === targetKey.toUpperCase()) {
      setKeyPressed(true);
    }
  }, [targetKey]);

  const upHandler = useCallback(({ key }) => {
    if (key.toUpperCase() === targetKey.toUpperCase()) {
      setKeyPressed(false);
    }
  }, [targetKey]);

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [downHandler, upHandler]);

  return keyPressed;
};

export default useKeyPressedListener;
