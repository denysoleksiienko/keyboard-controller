import {createStackNavigator} from '@react-navigation/stack';
import {Paths} from '../../enums/Paths';
import {UserFormScreen} from '../../screens/UserFormScreen/UserFormScreen';

const Stack = createStackNavigator();

const UserNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={Paths.UserForm}>
      <Stack.Screen
        component={UserFormScreen}
        name={Paths.UserForm}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
