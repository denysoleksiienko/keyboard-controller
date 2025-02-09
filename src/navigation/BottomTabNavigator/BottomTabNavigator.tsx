import {FC} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Paths} from '../../enums/Paths';
import {HomeScreen} from '../../screens/HomeScreen/HomeScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: FC = () => {
  return (
    <Tab.Navigator initialRouteName={Paths.Home}>
      <Tab.Screen
        name={Paths.Home}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'home',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
