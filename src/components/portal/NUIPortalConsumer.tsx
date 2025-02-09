import { ReactNode, useEffect, useRef } from 'react';
import { IProvider } from './NUIPortalHost';

interface INUIPortalConsumerProps {
  children: ReactNode;
  manager: IProvider | null;
  isTop?: boolean;
}

export function NUIPortalConsumer({
  children,
  manager,
  isTop = false,
}: INUIPortalConsumerProps) {
  const key = useRef<string | undefined>(undefined);

  const checkManager = () => {
    if (!manager) {
      throw new Error('No portal manager defined');
    }
  };

  const handleInit = () => {
    checkManager();
    key.current = manager?.mount(children, isTop);
  };

  useEffect(() => {
    checkManager();
    manager?.update(key.current!, children, isTop);
  }, [children, manager, isTop]);

  useEffect(() => {
    handleInit();

    return () => {
      checkManager();
      manager?.unmount(key.current!);
    };
  }, []);

  return null;
}
