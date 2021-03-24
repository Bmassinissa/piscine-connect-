
import './App.css';
import LineChart from './components/LineChart'
import React,{useState,useEffect} from 'react';
import db from './Storage';


import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore' // <- needed if using firestore
import { createStore, combineReducers, compose } from 'redux'
import {
    ReactReduxFirebaseProvider,
    firebaseReducer
} from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore'
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer // <- nécessaire si vous utilisez un firestore
})
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- nécessaire si vous utilisez un firestore
}
class App extends React.Component {
  constructor() {
    super();
    this.state = {
    temperature: "",
    luminosite:"",
    Data:[]

    }
  }
  
  async componentDidMount() {
    const tab =[];
    const response = db.collection('capteurs').doc('luminosité')
    .collection('samples').doc(Date.now().toString())
    const data=await response.get();
    data.docs.forEach(item=>{
      tab.push(item.data())
      console.log(data)
    })
      this.setState({Data: tab})
      this.getValue()
  }

  getValue(){
    var temperature = 0;
    var luminosite = 0;
  }

  render(){
    return (
      <div className="App">
        <div className='chart'>
          <LineChart/>
        </div>
  
      </div>
  
    )
  }
}



export default App;
