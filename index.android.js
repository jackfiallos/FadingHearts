/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    StatusBar,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';

const {
    width: deviceWidth,
    height: deviceHeight
} = Dimensions.get('window');

const ANIMATION_END_Y = Math.ceil(deviceHeight * .5);
const NEGATIVE_END_Y = ANIMATION_END_Y * -1;
const startCount = 1;

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

class Heart extends Component {
    render() {
        return (
            <View {...this.props} style={[styles.heart, this.props.style]}>
                <View style={[styles.leftHeart, styles.heartShape]} />
                <View style={[styles.rightHeart, styles.heartShape]} />
            </View>
        )
    }
}

class AnimatedHeart extends Component {
    constructor(props) {
        super(props);
        this.state = {position: new Animated.Value(0)};

        this.getHeartAnimationStyle = this.getHeartAnimationStyle.bind(this);
    }

    componentWillMount() {
        this._yAnimation = this.state.position.interpolate({
            inputRange: [NEGATIVE_END_Y, 0],
            outputRange: [ANIMATION_END_Y, 0]
        });

        this._opacityAnimation = this._yAnimation.interpolate({
            inputRange: [0, ANIMATION_END_Y],
            outputRange: [1, 0]
        });

        this._scaleAnimation = this._yAnimation.interpolate({
            inputRange: [0, 15, 30],
            outputRange: [0, 1.2, 1],
            extrapolate: 'clamp'
        });

        this._xAnimation = this._yAnimation.interpolate({
            inputRange: [0, ANIMATION_END_Y/2, ANIMATION_END_Y],
            outputRange: [0, 15, 0]
        })

        this._rotateAnimation = this._yAnimation.interpolate({
            inputRange: [0, ANIMATION_END_Y/4, ANIMATION_END_Y/3, ANIMATION_END_Y/2, ANIMATION_END_Y],
            outputRange: ['0deg', '-2deg', '0deg', '2deg', '0deg']
        });
    }

    componentDidMount() {
        Animated.timing(this.state.position, {
            duration: 2000,
            toValue: NEGATIVE_END_Y
        }).start(this.props.onComplete);
    }

    getHeartAnimationStyle() {
        return {
            transform: [
                {translateY: this.state.position},
                {translateX: this._xAnimation},
                {scale: this._scaleAnimation},
                {rotate: this._rotateAnimation}
            ],
            opacity: this._opacityAnimation
        }
    }

    render() {
      return (
          <Animated.View style={[styles.heartWrap, this.getHeartAnimationStyle(), this.props.style]}>
              <Heart />
          </Animated.View>
      )
    }
}

export default class FadingHearts extends Component {
    constructor(props) {
        super(props);
        this.state = {hearts: []};

        this.addHeart = this.addHeart.bind(this);
        this.removeHeart = this.removeHeart.bind(this);
    }

    addHeart() {
        startCount += 1;
        const obj = {
            id: startCount,
            right: getRandomNumber(50, 150)
        };
        this.setState((prevState) => ({
            hearts: prevState.hearts.concat([obj])
        }));
    }

    removeHeart(v) {
        var index = this.state.hearts.findIndex(function(heart) { return heart.id === v});
        this.state.hearts.splice(index, 1);
        this.setState(this.state);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback style={styles.container} onPress={this.addHeart}>
                    <View style={styles.container}>
                        {
                            this.state.hearts.map(function(v, i) {
                                return (
                                    <AnimatedHeart
                                        key={v.id}
                                        onComplete={this.removeHeart.bind(this, v.id)}
                                        style={{right: this.state.hearts[i].right}}
                                        />
                                )
                            }, this)
                        }
                    </View>
                </TouchableWithoutFeedback>
      	        <Text style={styles.message}>Tap anywhere to see hearts!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        fontSize: 15,
        color: '#888',
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
    },
    heartWrap: {
        position: 'absolute',
        bottom: 30,
        backgroundColor: 'transparent'
    },
    heart: {
        width: 50,
        height: 50,
        backgroundColor: 'transparent'
    },
    heartShape: {
        width: 30,
        height: 45,
        position: 'absolute',
        top: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#6427d1',
    },
    leftHeart: {
        transform: [
            {rotate: '-45deg'}
        ],
        left: 5
    },
    rightHeart: {
        transform: [
            {rotate: '45deg'}
        ],
        right: 5
    }
});

AppRegistry.registerComponent('FadingHearts', () => FadingHearts);
