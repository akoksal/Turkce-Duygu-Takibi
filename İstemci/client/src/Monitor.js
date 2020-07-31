import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Table from 'react-bootstrap/Table'
import { BrowserRouter as Router, Link, Route, useLocation } from "react-router-dom";
import { ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceLine, Bar, Legend } from 'recharts';
import { scaleLog } from 'd3-scale';
import api from './api_config.js';
class Monitor extends Component {
  constructor(props){
    super(props);
    console.log(this.props);
    this.myRef = React.createRef();

    this.scroll= (ref) => {
      ref.current.scrollIntoView({behavior: 'smooth'});
    };

    this.state = {
      data:'',
      selectedX:'',
      tweets: '',
      allTweets: '',
    }
  }

  componentDidMount(){
    
      fetch(api.result_by_id+this.props.match.params.q)
    .then(res => res.json())
    .then(data => {
      data = JSON.parse(data);
      console.log(data);
      data.forEach((e, i) => {
        if(i!=0 && i!=data.length-1){
          const p = data[i-1];
          const n = data[i+1];
          if(e.volume<=20){
            e.sentiment = (e.volume*e.sentiment + p.volume*p.sentiment + n.volume*n.sentiment)/(e.volume+p.volume+n.volume);
          } else {
            
          }
          
        }
      });
      data.forEach((e, i) => {
        if(i!=0 && i!=data.length-1){
          const p = data[i-1];
          const n = data[i+1];
          e.sentiment = (e.volume*e.sentiment + p.volume*p.sentiment + n.volume*n.sentiment)/(e.volume+p.volume+n.volume);
        }
      });
      this.setState({
        allTweets: data,
      });
    })
    .catch(error => console.log(error));

    fetch(api.volume_by_id+this.props.match.params.q)
    .then(res => res.json())
    .then(data => {
      data = JSON.parse(data);
      console.log(data);
      const last_date = data[data.length - 1].date
      const year = 365*86400*1000;
      data = data.filter((e,i)=>(e.date>last_date-year));
      data.forEach((e, index) => {
        e.date = new Date(e.date).toLocaleDateString("tr-TR");
        e.sentiment = e.sentiment.toFixed(2);

      });

      this.setState({
        data: data,
      });
    })
    .catch(error => console.log(error));

    
    
  }

  listTweets = (e, index) => {
    const selectedX = e.activeLabel;
    const oneDay = 86400*1000;
    const dateParts = selectedX.split(".");
    const selectedTime = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).getTime();
    console.log(this.state.allTweets[0].datetime)
    console.log(e)
    console.log(selectedTime)
    const tweets = this.state.allTweets.filter((e,index)=>(e.datetime>=selectedTime && e.datetime<=selectedTime+oneDay)).sort((a, b)=>b.nbr_retweet-a.nbr_retweet).filter((e,i)=>(i<30));
    
    console.log(tweets);
    this.setState({tweets: tweets});
    this.setState({selectedX:selectedX});
    this.scroll(this.myRef);
  }

  render(){
    const {
      data, 
      selectedX,
      tweets
    } = this.state;

    const TweetItem = (item, index) => {
      console.log(item.tweet);
      return (
        <tr className='tweet-list-item' key={index}>
        <td><a href={'https://twitter.com'+item.url} target='_blank'>{item.usernameTweet}</a></td>
        <td className='left-align-row'>{item.text} </td>
        <td>{item.nbr_retweet}</td>
        <td>{item.nbr_favorite}</td>
        <td>{new Date(item.datetime).toLocaleTimeString()}</td>
        </tr>
        );
    }

    const TweetsTable = () => (
      <div className="tweets-div">
      <Table responsive="sm" className="tweets-table table">
      <thead>
      <tr>
      <th>Link</th>
      <th>Tweet</th>
      <th>RT</th>
      <th>Fav</th>
      <th>Saat</th>
      </tr>
      </thead>
      <tbody>{tweets.map((e, index) => TweetItem(e, index))}</tbody>
      </Table>
      </div>
      );  

    return(
      <div>
      <h3>{this.props.queryString}</h3>

      {(data==='')?<Spinner style={{margin:'20px'}} className="spinner" animation="grow" variant="warning" />:
      <div>
      <div className='charts'>
      <ComposedChart margin={{ top: 25, right: 25, bottom: 25, left: 25 }} className='line-chart' key={this.props.match.params.q} width={950} height={350} data={data} onClick={this.listTweets} >

      <XAxis xAxisId="0" dataKey="date" angle={-45} textAnchor="end" minTickGap={7} height={100}/>
      <YAxis yAxisId="left" label={{ value: 'Duygu', offset: 10, position: 'top' }} type="number" domain={[-1.0, 1.0]}/>
      <YAxis yAxisId="right" label={{ value: 'Hacim', offset: 5, position: 'top' }} scale={scaleLog().base(Math.E)} domain={['auto', 'auto']} tickFormatter={(t) => `${Math.round(t)}`} orientation="right" />
      <Bar yAxisId="right" dataKey="volume" barSize={10} fill="#eaeaea"  />

      <Line yAxisId="left" dot={false} type="basis" dataKey="sentiment" stroke="#03a9f4" />
      <Legend verticalAlign="top" height={36}/>
      <ReferenceLine yAxisId="left" y={0.3} stroke="green" strokeDasharray="3 3" />
      {(selectedX)?<ReferenceLine yAxisId="left" x={selectedX} stroke="red"  />:null}
      <ReferenceLine yAxisId="left" y={-0.3} stroke="red" strokeDasharray="3 3" />
      </ComposedChart>
      </div>
      <div ref={this.myRef}>  
      {(selectedX&&tweets!=''&&tweets.length!=0)?<div className="tweet-holder"><h4>{selectedX} tarihli öne çıkan tweetler</h4>
      <TweetsTable/></div>:<p></p>}</div></div>

    }
    </div>
    );
}
}
export default Monitor;