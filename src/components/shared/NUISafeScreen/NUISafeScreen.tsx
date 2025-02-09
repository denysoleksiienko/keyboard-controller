import { useMemo, type PropsWithChildren } from 'react';
import { useTheme } from '@emotion/react';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

interface INUISafeScreen {
  safeBottom?: boolean;
  safeTop?: boolean;
}

export function NUISafeScreen({
  children,
  safeBottom = true,
  safeTop = true,
}: PropsWithChildren<INUISafeScreen>) {
  const { colors } = useTheme();
  const edges = useMemo<Edge[]>(() => {
    const edgesArray: Edge[] = [];

    if (safeBottom) {
      edgesArray.push('bottom');
    }
    if (safeTop) {
      edgesArray.push('top');
    }

    return edgesArray;
  }, [safeBottom, safeTop]);

  return (
    <SafeAreaView
      edges={edges}
      style={{ flex: 1, backgroundColor: colors.primary.background }}
    >
      {children}
    </SafeAreaView>
  );
}
