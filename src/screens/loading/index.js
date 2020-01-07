/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Container, Content, Spinner } from 'native-base';
import { firebase } from '@react-native-firebase/auth';
import colors from '../../assets/colors';
class LoadingScreen extends Component {
    // check if user is already logged in
    componentDidMount() {
        console.log(firebase.auth.onAuthStateChanged);

        firebase.auth().onAuthStateChanged(user => {
            // this.props.navigation.navigate('MainStack');
            this.props.navigation.navigate(user ? 'MainStack' : 'LoginStack');
        });
    }

    render() {
        return (
            <Container
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Spinner color={colors.primaryColor} />
            </Container>
        );
    }
}

export default LoadingScreen;
