import './App.css';
import { Switch, Route } from 'react-router-dom';
import Example from './views/Example';
import Home from './views/Home';
import Login from './views/Login';
import NavBar from './components/NavBar';
import Page2 from './views/Page2';
import Page3 from './views/Page3';
import Logout from './views/Logout';
import SingleItem from './views/SingleItem';
import CreateCategory from './views/CreateCategory';
import EditCategory from './views/EditCategory';
import CreateItem from './views/CreateItem';
import EditItem from './views/EditItem';

import ProtectedRoute from './components/ProtectedRoute'
import Shop from './views/Shop';
import AdminRoute from './components/AdminRoute'
import Cart from './views/Cart';



import {getIsAdmin as apiGetIsAdmin} from './api/apiAdmin'

import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';


export default class App extends Component {
  constructor() {
    super();
    this.state={
      user:'',
      test:'This is a test', 
      token:'',
      isAdmin:false,
      cart:{}
    }
  }

static getDerivedStateFromProps=(props,state)=>{
  return {
    token:localStorage.getItem('token'),
    cart:localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):{}
  }
}

componentDidMount(){
  if(this.state.token){this.getIsAdmin()}
}

setUser = (user)  =>{
  this.setState({user:user},()=>console.log("User is",this.state.user));
}

setToken=(token)=>{
  this.setState({token},this.getIsAdmin)
}

getIsAdmin=()=>{
  const isAdmin=async()=>{
    let res=await apiGetIsAdmin(localStorage.getItem('token'))
    if (res === 500 || res === 400){res=false}
    this.setState({isAdmin:res})
  }
  isAdmin()
}

doLogout=()=>{
  localStorage.setItem("token",'')
  this.setToken('')
  this.setState({isAdmin:false})
}


// cart={"Item's name":{"price":1.99,"name":"Item's name"},
// "Item2's name":{"price":10.99,"name":"Item2's name"},
// }
// shopping cart function
addToCart=(item)=>{
  let cart = JSON.parse(localStorage.getItem('cart'))
  if (cart[item.name]){
    cart[item.name].quanity++
  }else{
    cart[item.name]={...item, quanity:1}
  }
  this.setState({cart})
  //addline later
  localStorage.setItem('cart',JSON.stringify(cart))
  alert(`Thanks for adding ${item.name} to your cart`)
}

removeFromCart=(item)=>{
  let cart=JSON.parse(localStorage.getItem('cart'))
  if (cart[item.name].quanity>1){
    cart[item.name].quanity--
  }else if(cart[item.name].quanity === 1){
    delete cart[item.name]
  }
  this.setState({cart})
  //addline later
  localStorage.setItem('cart',JSON.stringify(cart))
  alert(`You removed ${item.name} from your cart`)
}

removeAllFromCart=(item)=>{
  let cart=JSON.parse(localStorage.getItem('cart'))
  if(cart[item.name]){
    delete cart[item.name]
  }
  this.setState({cart})
  //addlinelate
  localStorage.setItem('cart',JSON.stringify(cart))  
  alert(`You Removed all of ${item.name} from your cart`)
}

getCartItemTotal=()=>{
  let total=0
  for (const item in JSON.parse(localStorage.getItem('cart'))){
    total+=JSON.parse(localStorage.getItem('cart'))[item].quanity
  }
  return total
}

getCartTotalPrice=()=>{
  let total = 0
  for (const item in JSON.parse(localStorage.getItem('cart'))){
    total +=JSON.parse(localStorage.getItem('cart'))[item].price*JSON.parse(localStorage.getItem('cart'))[item].quanity
  }
  return total
}


render() {
    return (
      <div>
        <NavBar getCartItemTotal={this.getCartItemTotal} getCartTotalPrice={this.getCartTotalPrice} token={this.state.token} isAdmin ={this.state.isAdmin}/>

        <Switch>
          <ProtectedRoute token={this.state.token} exact path = "/" render={()=><Home/>}/>
          <ProtectedRoute token={this.state.token} exact path = "/page2"  render={()=><Page2 user={this.state.user} test={this.state.test} setUser={this.setUser}/>}/>
          <ProtectedRoute token={this.state.token} exact path = "/page3" render={()=><Page3 user={this.state.user}/>}/>
          <ProtectedRoute token={this.state.token} exact path = "/example" render={()=><Example/>}/>
          <ProtectedRoute token={this.state.token} exact path = "/logout" render={()=><Logout doLogout={this.doLogout}/>}/>
          <ProtectedRoute token={this.state.token} exact path = "/shop" render={()=><Shop addToCart={this.addToCart}/>}/>
          <ProtectedRoute token={this.state.token} exact path = "/item:id" render={(props)=><SingleItem addToCart={this.addToCart} {...props} />}/>
          <ProtectedRoute token={this.state.token} exact path = "/cart" render={()=>
                            <Cart 
                            cart={this.state.cart}
                            removeFromCart={this.removeFromCart} 
                            removeAllFromCart={this.removeAllFromCart} 
                            getCartItemTotal={this.getCartItemTotal} 
                            getCartTotalPrice={this.getCartTotalPrice} />}/>

          <AdminRoute isAdmin={this.state.isAdmin} token={this.state.token} exact path = "/createcats" render={()=><CreateCategory/>}/>
          <AdminRoute isAdmin={this.state.isAdmin} token={this.state.token} exact path = "/editcats" render={()=><EditCategory/>}/>
          <AdminRoute isAdmin={this.state.isAdmin} token={this.state.token} exact path = "/createitems" render={()=><CreateItem/>}/>
          <AdminRoute isAdmin={this.state.isAdmin} token={this.state.token} exact path = "/edititems" render={()=><EditItem/>}/>

          <Route exact path = "/login" render={()=><Login setToken={this.setToken}/>}/>
        </Switch>

      </div>
    )
  }
}
