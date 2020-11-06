import React, { useState } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../actions/actions';
import {Redirect} from 'react-router-dom';
// import { divide } from 'numeral';

const url = 'http://localhost:3000/'

const UpdateList = (props) => {     
  const [redirect, setRedirect] = useState(false);
  const [input, setInput] = useState({
    item: props.item.name,
    price: props.item.price,
    location: props.item.location
  });
  // const [itemInput, setItemInput] = useState(props.item.name);
  // const [priceInput, setPriceInput] = useState(props.item.price);
  // const [locationInput, setLocationInput] = useState(props.item.location);
  return (
    redirect === false ? 
    <div className='updateListContainer'>
      <form className='updateForm'>
      <h1>Update your WOBBE UP!</h1>
        <div className='inputWrapper'>
          <div className='itemInput'>
          <label>Item:</label>
          <input type='text' value={input.item} onChange={e => {
            setInput({...input, item: e.target.value})
          }}></input>
          </div>
          <div className='priceInput'>
          <label>Price:</label>
          <input type='text' value={input.price} onChange={e => {
            setInput({...input, price: e.target.value})
          }}></input>
          </div>
          <div className='locationInput'>
          <label>Location: </label>
          <input type='text' value={input.location} onChange={e => {
            setInput({...input, location: e.target.value})
          }}></input>
          </div>
        </div>
        <button onClick={e => {
          e.preventDefault();

          axios.patch(url + 'profile/' + props.item.id, {
            name: input.item,
            price: input.price,
            location: input.location
          }).then(data => {
            
            setRedirect(true);
          })

          
        }}>Submit</button>
      </form>
    </div>
    :
    <Redirect
      to={{
      pathname: '/profile'
    }} />
  )
}

const mapStateToProps = (state) =>({
  item : state.wobbeReducer.item,
  
})

const mapActionToProps = {
  setItem : actions.setItem,
}

export default connect(mapStateToProps, mapActionToProps)(UpdateList);