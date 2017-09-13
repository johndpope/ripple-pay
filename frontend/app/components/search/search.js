import React from 'react';
import HomeContainer from '../home/homeContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import BankSendContainer from '../banksend/banksendContainer';
import { reduxForm } from 'redux-form';

import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  TouchableHighlight } from 'react-native';
  import Tabs from 'react-native-tabs';

import Ion from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.requestUsers = this.props.requestUsers.bind(this);
    this.makeUsers = this.makeUsers.bind(this);
    this.navBankSend = this.navBankSend.bind(this);
    this.state = {
      query: "",
      page: 'source'
    };
  }

  componentDidUpdate(prevProps,prevState){
    if ( prevState.query !== this.state.query )
    {
      this.requestUsers(this.state.query);
    }
  }

  //I set the query to an empty string so that when this comes back it is an empty string we are searching for since none of the components
  //are unmounting with navigatorIOS. They just stay mounted.
  navHome() {
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'Home',
      component: HomeContainer,
      navigationBarHidden: true
    });
  }

  navBankSend(receiver_id, otherUser) {
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'BankSend',
      component: BankSendContainer,
      navigationBarHidden: true,
      passProps: {receiver_id: receiver_id, otherUser: otherUser}
    });
  }

  navWallet() {
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
      navigationBarHidden: true
    });
  }
  //You can store a constant as stuff that is not wrapped in jsx tags

  navExchange() {
    this.setState({query: ""});
    this.props.navigator.push({
      title: 'Exchange',
      component: ExchangeContainer,
      navigationBarHidden: true
    });
  }

//Disregard where your id is equal to the user id that comes back.
  makeUsers(){
    let theUsers;
    if ( this.props.users )
    {
      theUsers = this.props.users.sort((a,b) => a.screenName - b.screenName)
      .map((user, idx) => {
        if ( user._id !== this.props.user.user_id )
        {
          return (
            <TouchableHighlight key={idx} style={{backgroundColor:'white'}}>
              <TouchableOpacity style={styles.resultItem} onPress={() => { this.navBankSend(user._id, user.screenName); }}>
                <View style={styles.username}>
                  <Text style={styles.resultItemText}>{user.screenName}</Text>
                </View>
                <View></View>
                <View></View>
              </TouchableOpacity>
            </TouchableHighlight>
          );
        }
      });
      return (
        <ScrollView style={styles.resultsContainer}> 
         {theUsers}
       </ScrollView>
      );
    }
    else
    {
      return;
    }
  }

  render() {
   return (
     <View style={styles.mainContainer}>
       <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.field}>
            <TextInput
              style={styles.textInput} 
              value={this.state.query}
              onChangeText={
                (query) => {
                  this.setState({query: query});
                }
              }
              autoFocus={true}
              placeholder="Enter Username"
              placeholderTextColor="#6D768B"
              />
            </View>
        </View>
       </View>

        <ScrollView>
          {/* i made a conditional in this results to try to print the results only when they are in the state,
              not working, but close i think  */}
          {this.makeUsers()}
        </ScrollView>


       <Tabs style={styles.tabs} selected={this.state.page} onSelect={el => this.setState({ page: el.props.name })}>
         <TouchableOpacity onPress={this.navHome.bind(this)}>
           <Text style={styles.tabFont}><Icon name="home" size={30} color="white" /></Text>
         </TouchableOpacity>
         <TouchableOpacity name="source">
           <Text style={styles.tabFont}><Icon name="magnifying-glass" size={30} color="white" /></Text>
         </TouchableOpacity>
         <TouchableOpacity name="pool" onPress={this.navWallet.bind(this)}>
           <Text style={styles.tabFont}><Icon name="wallet" size={30} color="white" /></Text>
         </TouchableOpacity>
         <TouchableOpacity name="Stream" onPress={this.navExchange.bind(this)}>
           <Text style={styles.tabFont}><Icon name="swap" size={30} color="white" /></Text>
         </TouchableOpacity>
       </Tabs>
     </View>
   );
 }}

 const {width, height} = Dimensions.get('window');
 const styles=StyleSheet.create({
   mainContainer: {
     flex: 1,
     justifyContent: 'center',
     backgroundColor: 'white'
   },
   topContainer: {
     flex: -1,
     backgroundColor: '#111F61',
     flexDirection: 'row',
     justifyContent: 'space-around',
     alignItems: 'center',
     height: 90,
     paddingTop: 10,
   },
    title: {
      color: 'white',
      fontSize: 20,
      justifyContent: 'center',
      fontFamily: 'Kohinoor Bangla',
    },
    field: {
      backgroundColor: '#0F1C52',
      borderRadius: 5,
      padding: 5,
      paddingLeft: 15,
      margin: 30,
      width: 325
    },
    textInput: {
      height: 35,
      fontFamily: 'Kohinoor Bangla',
      color: 'white',
    },
    instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
     fontSize: 15
   },
    tabFont: {
      color: 'white',
      fontFamily: 'Kohinoor Bangla',
    },
    tabs: {
      backgroundColor: '#111F61',
      borderColor: '#d3d3d3',
      position: 'absolute',
      paddingTop: 15,
      paddingBottom: 10,
      height: 75
    },
    resultsContainer: {
      flex: 1,
      marginBottom: 75,
      marginTop: -20
    },
    resultsInfo: {
      flex: 1,
    },
    resultItemText: {
      fontWeight: "600",
      fontSize: 15,
      backgroundColor: 'white'
    },
    resultItem: {
      flex: 1,
      padding: 2,
      paddingTop: 15.65,
      paddingBottom: 15.65,
      borderBottomWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: 'white',
      width: 345,
      marginLeft: 15
    },
    sendText: {
      marginRight: 3
    }
 });

 export default Search;
