import 'react-native-gesture-handler';

import {KeyboardProvider} from 'react-native-keyboard-controller';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {ThemeProvider} from '@emotion/react';
import {lightTheme} from './theme/theme';
import RootNavigator from './navigation/RootNavigator/RootNavigator';

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={lightTheme}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider statusBarTranslucent>
            <RootNavigator />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
