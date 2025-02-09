import {useTheme} from '@emotion/react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Paths} from '../../enums/Paths';

import UserNavigator from '../UserNavigator/UserNavigator';
import {isAndroid, statusBarHeight} from '../../utils/native-utils';
import {StatusBar} from 'react-native';
import BottomTabNavigator from '../BottomTabNavigator/BottomTabNavigator';
import {NUIPortalHost} from '../../components/portal';

const RootStack = createStackNavigator();

const headerStyle = {
  height: isAndroid ? 50 + statusBarHeight : 72,
  elevation: 1,
};

const RootNavigator = () => {
  const {navigationTheme} = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <NUIPortalHost>
        <StatusBar translucent animated />
        <RootStack.Navigator initialRouteName={Paths.Root}>
          <RootStack.Screen
            component={BottomTabNavigator}
            name={Paths.Root}
            options={{headerShown: false}}
          />
          <RootStack.Screen
            component={UserNavigator}
            name={Paths.UserNavigator}
            options={{headerShown: false}}
          />
        </RootStack.Navigator>
      </NUIPortalHost>
    </NavigationContainer>
  );
};

export default RootNavigator;
