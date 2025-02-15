import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ClassroomsScreen } from '../screens/ClassroomsScreen';
import { SchedulesScreen } from '../screens/SchedulesScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

export function MyClassroomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Classrooms') {
            return <Icon name='graduation-cap' type='font-awesome' size={size} color={color} />;
          } else if (route.name === 'Activities') {
            return <Icon name='book' type='font-awesome' size={size} color={color} />;
          } else if (route.name === 'Schedule') {
            return <Icon name='calendar' type='font-awesome' size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#7dace3',
        tabBarStyle: {
          height: 60,
          backgroundColor: '#4a90e2'
        },
        headerShown: false,
        tabBarShowLabel: false
      })}
    >
      <Tab.Screen name='Classrooms' component={ClassroomsScreen} options={{unmountOnBlur: true}} />
      <Tab.Screen name='Activities' component={ActivitiesScreen} options={{unmountOnBlur: true}} />
      <Tab.Screen name='Schedule' component={SchedulesScreen} options={{unmountOnBlur: true}} />
    </Tab.Navigator>
  );
}