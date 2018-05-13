import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    const MyContract = window.web3.eth.contract([
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "result",
            "type": "bool"
          }
        ],
        "name": "ExperimentComplete",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "kill",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newState",
            "type": "string"
          }
        ],
        "name": "setState",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "startExperiment",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getSecret",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getState",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "pseudoRandomResult",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "you_awesome",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ]);

    this.state = {
      ContractInstance: MyContract.at('0xcd1cce5e215f20e4b99a80c8d2dc24d027c12cfc'),
      contractState: '',
    }
    this.state.event = this.state.ContractInstance.ExperimentComplete()
    this.state.event.watch((err, event) =>{
      if (err) console.error('An error occured:::', err)
      console.log('This is an event:::', event)
      console.log('This is an experiment result:::', event.args.result)
    })
  }
  queryState = () => {
    const { getState } = this.state.ContractInstance;

    getState((err, secret) => {
      if (err) { console.error('An error occured:::', err) }
      console.log('This contract state:::', secret)
    })
  }
  updateState = (event) => {
    event.preventDefault();

    const { setState } = this.state.ContractInstance;
    const { contractState: newState } = this.state;

    console.log('Try to change state');
    setState(
      newState,
      {
        gas: 300000,
        from: window.web3.eth.accounts[0],
        value: window.web3.toWei(0.01, 'ether'),
      }, (err, value) => {
        console.log('Contract state is changing');
      }
    )
  }

  startExperiment = () => {
    const { startExperiment } = this.state.ContractInstance;

    startExperiment({
      gas: 300000,
      from: window.web3.eth.accounts[0],
      value: window.web3.toWei(0.01, 'ether'),
    }, (err, result) => {
      console.log('Experiment started')
    })
  }
  queryPseudoRandom = () => {
    const { pseudoRandomResult } = this.state.ContractInstance;

    pseudoRandomResult((err, result) => {
      console.log('Pseudo random result::::', result);
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React and Ethereum</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <br />
        <button onClick={this.queryState}>Query State</button>
        <br />
        <br />
        <br />
        <form onSubmit={this.updateState}>
          <input
            name="change-state"
            placeholder="enter new state..."
            value={this.state.contractState}
            onChange={(e) => {this.setState({ contractState: e.target.value })}}
          />
          <button type="submit">Submit</button>
        </form>
        <br />
        <br />
        <button onClick={this.startExperiment}>Start Experiment</button>
        <br />
        <br />
        <br />
        <button onClick={this.queryPseudoRandom}>Query Pseudo Random</button>
        <br />
        <br />

      </div>
    );
  }
}

export default App;
