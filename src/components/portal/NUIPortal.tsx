import { ReactNode } from 'react';
import { NUIPortalConsumer } from './NUIPortalConsumer';
import { Context } from './NUIPortalHost';

interface INUIPortalProps {
  children: ReactNode;
  isActive?: boolean;
  isTop?: boolean;
  enabled?: boolean;
}

export function NUIPortal({
  children,
  isActive = true,
  isTop = false,
  enabled = true,
}: INUIPortalProps) {
  if (!isActive) {
    return null;
  }

  if (!enabled) {
    return children;
  }

  return (
    <Context.Consumer>
      {(manager) => (
        <NUIPortalConsumer isTop={isTop} manager={manager}>
          {children}
        </NUIPortalConsumer>
      )}
    </Context.Consumer>
  );
}
