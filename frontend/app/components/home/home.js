import React from 'react';
import SearchContainer from '../search/searchContainer';
import WalletContainer from '../wallet/walletContainer';
import ExchangeContainer from '../exchange/exchangeContainer';
import { unauthUser } from '../../actions';
import Icon from 'react-native-vector-icons/Entypo';
import Tabs from 'react-native-tabs';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    NavigatorIOS
  } from 'react-native';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
    this.state = {page: 'cloud'};
    this.displayTransactions = this.displayTransactions.bind(this);
  }

  onLogout() {
    this.props.unauthUser();
  }
  //Before we were checking if this was ===0 but this is always falsey in javascript so i did > 0 instead
  displayTransactions() {
    if (this.props.transactions.length > 0) {
      //Jon - You were talking about some way to allow scrolling here so you can scroll through the transactions.
      let ndate;
      let transactions = this.props.transactions.sort((a,b)=>{
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      transactions = transactions.map((transaction, idx) => {
        ndate = new Date(transaction.date);
        let time;
        if (ndate.getHours() > 12) {
          time = `${ndate.getHours() - 12} : ${ndate.getMinutes()} PM` ;
        } else {
          time = `${ndate.getHours()} : ${ndate.getMinutes()} AM`;
        }
        //Had to replace getDay with getDate because getDay was giving the wrong day.
        //Also don't add strings as it is slow. concatenate them
        return (
          <View style={styles.transaction} key={idx}>
            <View style={styles.transactionInfo}>
              <View style={styles.transactionOtherParty}>
                {
                  transaction.otherParty.length > 16 ?
                  <Text style={styles.transactionAddress}>
                    {transaction.otherParty}
                  </Text> :
                  <Text style={styles.transactionOtherPartyText}>
                    {transaction.otherParty}
                  </Text>
                }
              </View>
              <View style={styles.transactionDate}>
                <Text style={styles.transactionDateText}>
                  {`${ndate.toLocaleString("en-us", { month: "short" })} ${ndate.getDate()}, ${ndate.getFullYear()} ${time}`}
                </Text>
              </View>
            </View>
            <View style={styles.transactionAmount}>

                {
                transaction.amount > 0 ?
                  <Text style={styles.transactionAmountTextPos}>
                    +{transaction.amount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
                </Text>
                 :
                  <Text style={styles.transactionAmountTextNeg}>
                  {transaction.amount.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
                </Text>
                }
            </View>
          </View>
        );
      });

      return (
        <ScrollView style={styles.transactionsContainer}>
          {transactions}
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.transaction}>
          <View style={styles.transactionInfo}>
            <View style={styles.transactionOtherParty}>
              <Text style={styles.transactionOtherParty}>
                no transactions
              </Text>
            </View>
          </View>
        </View>
      );
    }
  }

  // After the component has mounted with 0 for balance and and [] for transactions, we go to the database
  // with this thunk action creator to make sure this is indeed the same or if there are transactions or a balance or if not.
  componentDidMount() {
    this.props.requestTransactions(this.props.user);
  }

  navSearch() {
    this.props.navigator.push({
      component: SearchContainer,
      title: 'Search',
      navigationBarHidden: true
    });
  }

  navWallet() {
    this.props.navigator.push({
      title: 'Wallet',
      component: WalletContainer,
      navigationBarHidden: true
    });
  }

  navExchange() {
    this.props.navigator.push({
      title: "Exchange",
      component: ExchangeContainer,
      navigationBarHidden: true
    });
  }
// THE REGEX IS BEING USED TO TRUNCATE THE LENGTH OF THE BALANCE TO 2 DIGITS WITHOUT ROUNDING
  render()
  {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>

          <View style={styles.signOut}>
            <TouchableOpacity onPress={this.onLogout}>
              <Icon name="log-out" size={20} color="white"/>
            </TouchableOpacity>
          </View>

            <View style={styles.logoContainer}>
              <Text style={styles.logo}>
                Balance & Transactions
              </Text>
            </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              {this.props.balance.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]} Ʀ
            </Text>
          </View>
      </View>

      <ScrollView>
        {this.displayTransactions()}
      </ScrollView>

      <View>
        <Tabs style={styles.tabs} selected={this.state.page} onSelect={el=>this.setState({page:el.props.name})}>
          <TouchableOpacity>
              <Text style={styles.tabFont}><Icon name="home" size={30} color="white" /></Text>
          </TouchableOpacity>
          <TouchableOpacity name="source" onPress={this.navSearch.bind(this)} >
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

      </View>
    );
  }
}

// define your styles
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
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
  logoContainer: {
    backgroundColor: '#111F61',
  },
  logo: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontFamily: 'Kohinoor Bangla'
  },
  balanceContainer: {
    borderRadius: 50,
    borderColor: 'white',
    backgroundColor: 'rgba(53, 58, 83, .5)',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
   balanceText: {
     textAlign: 'center',
     fontSize: 16,
     color: 'white',
     fontFamily: 'Kohinoor Bangla'
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
    signOut: {
      transform: [{ rotate: '180deg' }],
      marginBottom: 3
    },
    transactionsContainer: {
      marginBottom: 75,
      marginTop: -20
    },
    transaction: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 2,
      paddingLeft: 15,
      paddingTop: 15.65,
      paddingBottom: 15.65,
      borderBottomWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: 'white',
      width: 345,
      marginLeft: 15
    },
    transactionAmountTextPos: {
      textAlign: 'center',
      fontWeight: "600",
      fontSize: 14,
      color: 'green'
    },
    transactionAmountTextNeg: {
      textAlign: 'center',
      fontWeight: "600",
      fontSize: 14,
      color: 'red'
    },
    transactionOtherPartyText: {
      fontWeight: "600",
      fontSize: 15
    },
    transactionAddress:{
      fontWeight: "600",
      fontSize: 12

    },
    transactionDate: {
      paddingTop: 8
    },
    transactionDateText: {
      fontSize: 12
    },
    transactionInfo: {
      marginLeft: -15
    }
});

export default Home;
