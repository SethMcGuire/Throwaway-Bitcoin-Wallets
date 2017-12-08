import React, { Component } from 'react';
import axios from 'axios';
import bitcoin from 'bitcoinjs-lib';
import blockcypher from 'blockcypher';
import jQuery from 'jquery';
import { error } from 'util';

var testnet = bitcoin.networks.testnet;

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            privateKey: '',
            balance: '',
            add: '',
            amount: '',
            hash: ''
        }
    }
    onChangeAddress = (e) => {
        this.setState({ add: e.target.value });
    }

    onChangeAmount = (e) => {
        this.setState({ amount: e.target.value });
    }

    createWallet = (e) => {
        e.preventDefault()
        var keyPair = bitcoin.ECPair.makeRandom({network: testnet});
        console.log(keyPair.toWIF());
        console.log(keyPair.getAddress());
                
            this.setState({
                address: keyPair.getAddress(),
                privateKey: keyPair.toWIF(),
            });

            console.log(this.state.balance);          
    }

    createTransaction = (e) => {
        e.preventDefault()
        const {address, privateKey} = this.state;
        var hashURL = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}`


            axios.get(hashURL).then((response) => {
                this.setState({
                    hash: response.data.txrefs[0].tx_hash
                })
            }).then((result) => {

            var tx = new bitcoin.TransactionBuilder(testnet);
    
            var txId = this.state.hash;

            console.log(txId);

            tx.addInput(txId, 0)
    
            tx.addOutput(this.state.add, this.state.amount)
    
            var keyPair2 = bitcoin.ECPair.fromWIF(privateKey);
    
            tx.sign(0, keyPair2);
            console.log(tx.build().toHex());
            }
        )
    
    }

    checkBalance = (e) => {
        e.preventDefault()
        const {address} = this.state
        var blockcypherURL = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`

        axios.get(blockcypherURL).then((response) => {
            this.setState({
                balance2: response.data.balance
            });
            console.log(this.state.balance2);
        });
    }    


    render() {
        const {address, privateKey, balance, balance2, add, amount} = this.state;
        return (
            <div className="container-fluid">
            <div className="walletStuff">
            <button className="btn btn-primary" onClick={this.createWallet}>Generate New Wallet</button><br />
            <div>
                <h2>Address: {address}</h2>
                <h4>Balance: {balance2}</h4>  <button className="btn btn-warning" onClick={this.checkBalance}>Refresh Balance</button>
            </div>
            </div>
            <form id="transaction">
                <h4>Send bitcoin!</h4>
                <input id="add" value={add} onChange={this.onChangeAddress} name="add" type="text" placeholder="Recipient's BTC Address" autoFocus autoComplete="off"></input><br /><br />
                
                <input id="amount" value={amount} onChange={this.onChangeAmount} name="amount" type="text" placeholder="Amount of BTC to send"></input><br /><br />
                <button className="btn btn-danger" onClick={this.createTransaction}>Send</button>
            </form>
            </div>
        );
    }
}

export default Homepage;

//Send testnet back to 2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF