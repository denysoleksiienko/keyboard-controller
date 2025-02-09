import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { View, ViewStyle } from 'react-native';
import { NUIPortalManager, INUIPortalManagerHandles } from './NUIPortalManager';
import { useKey } from './hooks/useKey';

enum PortalAction {
  Mount = 'mount',
  Unmount = 'unmount',
  Update = 'update',
}

interface IHostProps {
  children: ReactNode;
  style?: ViewStyle;
}

interface INUIPortalAction {
  type: PortalAction;
  key: string;
  children?: ReactNode;
  isTop?: boolean;
}

export interface IProvider {
  mount(children: ReactNode, isTop?: boolean): string;
  update(key: string, children: ReactNode, isTop?: boolean): void;
  unmount(key: string): void;
}

export const Context = createContext<IProvider | null>(null);

export function NUIPortalHost({ children, style }: IHostProps) {
  const managerRef = useRef<INUIPortalManagerHandles>(null);
  const queueRef = useRef<INUIPortalAction[]>([]);
  const { generateKey, removeKey } = useKey();

  useEffect(() => {
    while (queueRef.current?.length && managerRef.current) {
      const action = queueRef.current?.pop();

      if (action) {
        switch (action.type) {
          case PortalAction.Mount:
            managerRef.current?.mount(
              action.key,
              action.children,
              action.isTop,
            );
            break;
          case PortalAction.Update:
            managerRef.current?.update(
              action.key,
              action.children,
              action.isTop,
            );
            break;
          case PortalAction.Unmount:
            managerRef.current?.unmount(action.key);
            break;
        }
      }
    }
  }, []);

  const mount = useCallback(
    (child: ReactNode, isTop = false): string => {
      const key = generateKey();

      if (managerRef.current) {
        managerRef.current.mount(key, child, isTop);
      } else {
        queueRef.current?.push({
          type: PortalAction.Mount,
          key,
          children: child,
          isTop,
        });
      }

      return key;
    },
    [generateKey],
  );

  const update = (key: string, child: ReactNode, isTop = false): void => {
    if (managerRef.current) {
      managerRef.current.update(key, child, isTop);
    } else if (queueRef.current) {
      const operation = {
        type: PortalAction.Update,
        key,
        children: child,
        isTop,
      };
      const index =
        queueRef.current?.findIndex(
          (o) =>
            (o.type === PortalAction.Mount || o.type === PortalAction.Update) &&
            o.key === key,
        ) ?? -1;

      if (index > -1) {
        queueRef.current[index] = operation;
      } else {
        queueRef.current.push(operation);
      }
    }
  };

  const unmount = useCallback(
    (key: string): void => {
      if (managerRef.current) {
        managerRef.current.unmount(key);
        removeKey(key);
      } else {
        queueRef.current?.push({ type: PortalAction.Unmount, key });
      }
    },
    [removeKey],
  );

  const value = useMemo(() => ({ mount, update, unmount }), [mount, unmount]);

  return (
    <Context.Provider value={value}>
      <View
        collapsable={false}
        pointerEvents="box-none"
        style={[{ flex: 1 }, style]}
      >
        {children}
      </View>

      <NUIPortalManager ref={managerRef} />
    </Context.Provider>
  );
}
