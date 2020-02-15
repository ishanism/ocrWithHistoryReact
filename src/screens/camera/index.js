import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { observer, inject } from 'mobx-react';
import { Slider } from 'react-native-elements';
import {
    Spinner,
    Button,
    Icon,
    Header,
    Left,
    Body,
    Title,
    Right,
} from 'native-base';
import RNTextDetector from 'react-native-text-detector';
import { Overlay } from 'react-native-elements';
import colors from '../../assets/colors';

class Camera extends Component {
    state = {
        zoomValue: 0,
        flashMode: RNCamera.Constants.FlashMode.off,
        canDetectText: true,
        textBlocks: [],
    };

    static navigationOptions = {
        header: null,
    };

    //////// Begiinning of code from google

    renderTextBlocks = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {this.state.textBlocks.map(this.renderTextBlock)}
        </View>
    );

    renderTextBlock = ({ bounds, value }) => (
        <React.Fragment key={value + bounds.origin.x}>
            <Text
                style={[
                    styles.textBlock,
                    { left: bounds.origin.x, top: bounds.origin.y },
                ]}
            >
                {value}
            </Text>
            <View
                style={[
                    styles.text,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                    },
                ]}
            />
        </React.Fragment>
    );

    textRecognized = object => {
        const { textBlocks } = object;
        console.log('Text Detected', this.state.canDetectText);
        this.setState({ textBlocks });
    };

    ////// end of code from google

    render() {
        const { memoStore } = this.props.store;
        {
            console.log('render method', memoStore.loader);
        }

        return (
            <View style={styles.container}>
                <Header
                    style={{ backgroundColor: colors.primaryColor }}
                    androidStatusBarColor={colors.secondaryColor}
                >
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>OCR by Ishan</Title>
                    </Body>
                    <Right />
                </Header>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={this.state.flashMode}
                    autoFocus={RNCamera.Constants.AutoFocus.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    zoom={this.state.zoomValue}
                    onTextRecognized={
                        this.state.canDetectText ? this.textRecognized : null
                    }
                >
                    {memoStore.loader === true ? (
                        <Overlay
                            isVisible={memoStore.loader}
                            overlayBackgroundColor="white"
                            width="75%"
                            height="25%"
                            onBackdropPress={() => memoStore.loaderFalse()}
                        >
                            <View>
                                <Spinner color={colors.primaryColor} />
                                <Text
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    style={{
                                        alignSelf: 'center',
                                        fontSize: 20,
                                        color: 'black',
                                    }}
                                >
                                    Processing...
                                </Text>
                            </View>
                        </Overlay>
                    ) : null}
                    <View
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                            flex: 0,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                                flex: 1,
                                alignItems: 'stretch',
                                justifyContent: 'center',
                            }}
                        >
                            <Slider
                                minimumValue={0}
                                maximumValue={1}
                                step={0.1}
                                value={this.state.zoomValue}
                                onValueChange={zoomValue =>
                                    this.setState({ zoomValue })
                                }
                                thumbTintColor={colors.primaryColor}
                            />
                        </View>

                        <Icon
                            type="Entypo"
                            onPress={this.takePicture}
                            style={styles.icon}
                            name="instagram"
                        />

                        <Icon
                            type="Entypo"
                            onPress={this.flash}
                            style={styles.icon}
                            name="flash"
                        />
                    </View>.
                    {!!this.state.canDetectText && this.renderTextBlocks()}
                </RNCamera>
            </View>
        );
    }
    flash = () => {
        if (this.state.flashMode === RNCamera.Constants.FlashMode.off) {
            this.setState({ flashMode: RNCamera.Constants.FlashMode.torch });
        } else {
            this.setState({ flashMode: RNCamera.Constants.FlashMode.off });
        }
    };
    takePicture = async () => {
        const { memoStore } = this.props.store;
        try {
            memoStore.loaderTrue();
            console.log('try', memoStore.loader);
            const options = {
                quality: 0.8,
                base64: true,
                skipProcessing: true,
            };
            const { uri } = await this.camera.takePictureAsync(options);
            const visionResp = await RNTextDetector.detectFromUri(uri);
            this.props.store.memoStore.addItem(visionResp);
            console.log('visionResp', visionResp);
        } catch (e) {
            console.warn(e);
        }
        memoStore.loaderFalse();
        let id = memoStore.memoArray.length - 1;
        memoStore.setEditId(parseInt(id));
        this.props.navigation.navigate('MemoView', {
            otherParam: id,
        });
        console.log('try outside', memoStore.loader);
    };
}
export default inject('store')(observer(Camera));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%',
    },
    icon: {
        flex: 0,
        color: 'white',
        fontSize: 40,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    spinnerStyle: {
        flex: 0,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        alignSelf: 'flex-start',
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#F00',
        justifyContent: 'center',
    },
    textBlock: {
        color: '#F00',
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
});
