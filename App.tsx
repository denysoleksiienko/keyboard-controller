import 'react-native-gesture-handler';

import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {Platform, StyleSheet, TextInput} from 'react-native';
import {useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  const [_, setText] = useState('');

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView style={styles.root}>
        <KeyboardProvider statusBarTranslucent>
          <KeyboardAwareScrollView
            bottomOffset={50}
            contentContainerStyle={styles.container}
            disableScrollOnKeyboardHide
            testID="aware_scroll_view_container">
            {new Array(30).fill(0).map((_, i) => (
              <TextInput
                key={i}
                contextMenuHidden={i === 4 && Platform.OS === 'ios'}
                keyboardType={i % 2 === 0 ? 'numeric' : 'default'}
                placeholder={`TextInput#${i}`}
                onChangeText={setText}
                style={styles.input}
              />
            ))}
          </KeyboardAwareScrollView>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    gap: 10
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
});
