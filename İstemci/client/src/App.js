import React, { Component, useState } from 'react';
import './App.css';
import Monitor from './Monitor'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/Badge'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import InputGroup from 'react-bootstrap/InputGroup'
import dummy from './dummy.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BrowserRouter as Router, Link, Route, useLocation } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import api from './api_config.js'
import samples from './samples.js'
class App extends Component {
  constructor(){
    super();

    this.state = {
      operations:'',
      query:'',
      tweets: [],
      response:'',
      monitorName:'',
      hasPending: false,
      alert: false
    }
  }

componentDidMount(){
    this.getOperations();
  }

getOperations(){
  fetch(api.operation_all)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        data = data.sort((a,b)=>(new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime()));
        data.forEach((e,i)=>{if(e.status=='Pending'){this.setState({hasPending:true});}});
        data = data.filter((e,i)=>(i<10));
        this.setState({
          operations: data,
        });
      })
      .catch(error => console.log(error));
}

Query(){
  const q = this.state.query;
  var details = {'query':q};
  const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');
  console.log(formBody);
  const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody
    };
    fetch(api.start_operation, requestOptions)
        .then(response => this.getOperations())
}

  Capitalize(str, lower = false){

  return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toLocaleUpperCase("tr-TR"));
}

  render() {
    const { operations, monitorName } = this.state;
    const TableItem = (item, index) => (
      <tr className='query-list-item' key={item.name}>
        <td className='left-align-row'><Link to={'/monitor/' + item.name} onClick={() => this.setState({monitorName:item.name})}>{item.name}</Link></td>
        <td>{item.volume}</td>
        <td> <LineChart width={100} height={30} data={item.sentiment}>
        <Line type="natural" dot={false} dataKey="val" stroke="#ffa807" strokeWidth={2} />
      </LineChart></td>
      </tr>
    );

    const OperationsItem = (item, index) => (
      <tr className='operations-list-item' key={item.id}>
        <td className='left-align-row'><Link to={'/monitor/' + item.id} onClick={() => this.setState({monitorName:this.Capitalize(item.operation_name)})}>{this.Capitalize(item.operation_name)}</Link></td>
        <td>{new Date(item.updatedAt).toLocaleDateString("tr-TR")}</td>
        <td>{item.status=='Completed'?<Badge variant="success">Completed</Badge>:<Badge variant="secondary">Pending</Badge>}</td>
      </tr>
    );

    const SampleQueries = () => (
          <div className="sample-queries list">
            <Table responsive="sm" className="table">
              <thead>
                <tr>
                  <th className='left-align-row'>Sorgu</th>
                  <th>Hacim</th>
                  <th>Değişim</th>
                </tr>
              </thead>
              <tbody>{samples.map((e, index) => TableItem(e, index))}</tbody>
            </Table>
          </div>
    );    

    const Operations = () => (
          <div className="operations list">
            <Table responsive="sm" className="table">
                <thead>
                <tr>
                  <th className='left-align-row'>Sorgu</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>{operations ? operations.map((e, index) => OperationsItem(e, index)):null}</tbody>
            </Table>
          </div>
    );    

    return (
      <Router>
      <div className="App">
      
        <div className="App-bar">
          <span className='logo-text'>Sentmon</span> <p className='logo-text-secondary'>Duygu Analiz Sistemi</p>
          <Route exact={true} path='/'>
          <Form.Row>
            <Form.Group as={Col}>
                <InputGroup onChange={event => {this.setState({query: event.target.value})}}
                    onKeyPress={event => {
                      if (event.key === 'Enter' && this.state.hasPending === true){
                        this.setState({alert:true});
                      } else if (event.key === 'Enter') {
                        console.log('Enter')
                        this.Query()
                      }
                    }}>
                    <InputGroup.Prepend>
                        <InputGroup.Text >
                            <i className="material-icons">search</i>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        type="text"
                        placeholder="Search here.."/>
                </InputGroup>
            </Form.Group>
          </Form.Row>
          {this.state.alert?<AlertDismissible/>:null}
          </Route>
          <Route path='/monitor/:q'>

          </Route>
        </div>
        <div className="App-intro">
          <Route exact={true} path='/'>
          <Row>
          <Col xs={12} md={6}>
          <div className="operations window">
          <span className="baslik">Son Sorgular</span>
          {!operations?<Spinner style={{margin:'20px'}} className="spinner" animation="grow" variant="warning" />:
          <Operations />}
          </div>
          </Col>
          <Col xs={12} md={6}>
          <div className="queries window">
          <span className="baslik">Örnek Sorgular</span>
          <SampleQueries />
          </div>
          </Col>
          </Row>
          </Route>
          <Route path='/monitor/:q'>
          <div style={{'textAlign':'-webkit-center'}}>
          <a style={{float:'left', "textDecoration": "underline", }} variant="outline-primary"><Link to={'/'}><i class="material-icons">arrow_back</i> </Link></a>{' '}
          {(monitorName!='')?<h3 style={{'width': 'fit-content'}}>{monitorName}</h3>:null}</div>
          </Route>
          <Route path='/monitor/:q' component={Monitor} props={true} queryString={'Erkam'}>
          </Route>
        </div>
        <div className="App-altyazi">
        Mandalina 🍊2020
        </div>
      </div>
      </Router>
    );
  }
}

function AlertDismissible() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <p>
          Lütfen sıradaki sorgu tamamlandıktan sonra tekrar deneyin
        </p>
      </Alert>
    );
  }
  return null;
}


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Home() {
  return <h2>Home</h2>;
}



export default App;
