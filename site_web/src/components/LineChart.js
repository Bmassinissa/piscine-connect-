import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import db from '../Storage'


// Initialize firebase instance
//firebase.initializeApp(firebaseConfig)

class App extends React.Component {
  constructor() {
    super();
    this.state = {
    luminosité:'',
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
    })
      this.setState (  {Data: tab})
      console.log(this.state.Data)
  }


}


function LineChart() {
  const data = {
    labels:['10','20','30', '40','50','60','70','80','90','100'  ],
    datasets:[
      {
        label:' température de la piscine ',
  // data: [5,10,15,20,25,30,35,40,45]
      }
    ]
  }
  
  const options = {
   title: {
     display: true,
     text: 'Graphes '
   },
   scales: {
     yAxes: [
       {
         ticks: {
           min: 0,
           max: 30,
           stepSize: 5
         }
       }
     ]
   }
 }



  return <Line data={data} options={options} />
}
export default LineChart

