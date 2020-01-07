import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
} from 'react-navigation';

import Welcome from './screens/welcome';
import Camera from './screens/camera/index.js';
import MemoView from './screens/memoView/index.js';
import EditView from './screens/editView/index.js';
import LoginForm from './screens/loginForm/index.js';
import LoadingScreen from './screens/loading/index.js';

const LoginStack = createSwitchNavigator({ LoginForm });
const MainStack = createStackNavigator({ Welcome, Camera, MemoView, EditView });

const Routes = createAppContainer(
    createSwitchNavigator(
        {
            LoadingScreen,
            LoginStack,
            MainStack,
        },
        {
            initialRouteName: 'LoadingScreen',
        },
    ),
);

export default Routes;
