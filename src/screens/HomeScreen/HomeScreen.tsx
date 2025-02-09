import {NUIText} from '../../components/shared/NUIText/NUIText';
import {NUISafeScreen} from '../../components/shared/NUISafeScreen/NUISafeScreen';
import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from 'react-native';
import {Paths} from '../../enums/Paths';

export function HomeScreen({navigation}) {
  return (
    <NUISafeScreen safeBottom={false}>
      <NUIText>Home</NUIText>

      <Button
        title={'user form'}
        onPress={() => navigation.navigate(Paths.UserNavigator)}
      />
    </NUISafeScreen>
  );
}
