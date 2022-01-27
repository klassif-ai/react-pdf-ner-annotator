import { useCallback, useEffect, useState } from 'react';

const useKeyPressedListener = (targetKey = 'CONTROL') => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  const getTargetKeys = useCallback(() => {
    if (targetKey.toUpperCase() === 'CONTROL' || targetKey.toUpperCase() === 'META') {
      return ['CONTROL', 'META'];
    }

    return [targetKey.toUpperCase()]
  }, [targetKey]);

  const downHandler = useCallback(({ key }) => {
    if (getTargetKeys().includes(key.toUpperCase())) {
      setKeyPressed(true);
    }
  }, [getTargetKeys]);

  const upHandler = useCallback(({ key }) => {
    if (getTargetKeys().includes(key.toUpperCase())) {
      setKeyPressed(false);
    }
  }, [getTargetKeys]);

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
