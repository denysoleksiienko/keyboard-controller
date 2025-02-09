import { forwardRef, ReactNode, useImperativeHandle, useState } from 'react';
import { View, StyleSheet } from 'react-native';

export interface INUIPortalManagerHandles {
  mount(key: string, children: ReactNode, isTop?: boolean): void;
  update(key: string, children: ReactNode, isTop?: boolean): void;
  unmount(key: string): void;
}

export const NUIPortalManager = forwardRef((_, ref): any => {
  const [portals, setPortals] = useState<
    { key: string; children: ReactNode; isTop: boolean }[]
  >([]);

  useImperativeHandle(
    ref,
    (): INUIPortalManagerHandles => ({
      mount(key: string, children: ReactNode, isTop = false): void {
        setPortals((prev) => [...prev, { key, children, isTop }]);
      },

      update(key: string, children: ReactNode, isTop = false): void {
        setPortals((prev) =>
          prev.map((item) => {
            if (item.key === key) {
              return { ...item, children, isTop };
            }
            return item;
          }),
        );
      },

      unmount(key: string): void {
        setPortals((prev) => prev.filter((item) => item.key !== key));
      },
    }),
  );

  const sortedPortals = [...portals].sort((a, b) => {
    if (a.isTop === b.isTop) return 0;
    return a.isTop ? 1 : -1;
  });

  return sortedPortals.map(({ key, children }) => (
    <View
      key={`portalize-${key}`}
      collapsable={false}
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
    >
      {children}
    </View>
  ));
});

NUIPortalManager.displayName = 'NUIPortalManager';
