import React from 'react';
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux';
import starter from '../index.js';
import {
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';

import Login from './Login';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }

  clearCredentials() {
    Keychain.resetGenericPassword().then(() => {
      console.log("jwt token deleted");
    });
  }

  render() {
    let renderMainView = () => {
      if (this.props.screenName) {
        starter.startTabs();
        return null;
      } 
      else {
        // LEAVE THE FOLLOWING COMMENTED OUT FOR DEBUGGING PURPOSES, BUT PUT BACK IN IN PROD.
        // have clearCredentials here as well as in unauthUser because user may not log out, but could swipe up on the app. 
        // this would ensure that credentials are cleared in both cases.
        this.clearCredentials();
        return <Login />;
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        {renderMainView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#ccc'
  },
});

let mapStateToProps = (state) => {
  return {
    screenName: state.user.screenName
  };
};

module.exports = connect(mapStateToProps, null)(App);
