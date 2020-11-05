import React,{useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import * as actions from "../actions/actions";
import {connect} from 'react-redux';
import numeral from 'numeral';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

const url = 'http://localhost:3000/'

const CardList = (props) => {
  //cardlist props using usestate to update the props's word that's being passed in to lowercase the first letter 
    const [Ownername, setOwnerName] = useState('')
    const [redirect, setRedirect] = useState(false);
    function capitalize(word) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
    // set's item to whatever is passed in the props 
    const handleClick =(e) =>{
        // console.log('props',props)
        props.setItem(props)
    }

    useEffect(() => {
        // this is a fetch get request 
        // console.log('inside cardlist', props)
        axios.get('http://localhost:3000/listing/searchname', { params :{ user_id : props.user_id}} )
        .then((res) => { 
                if(res.status === 204) {
                    setOwnerName('No User')
                }
                else{
                    setOwnerName(res.data.username)
                }
            })
        .catch(err => console.log(err))
        
    })
     
    // this func is going to hanle the delete functionality
    const deletefunc = (e) => {
      handleClick(e) 
      console.log('delete is working', e)
      console.log(props.item.id)
      axios.delete(url + 'profile/' + props.item.id)
      
      .then(setRedirect(true))

    }

    return ( 
        redirect === false ? 
        <div className='CardList'>
            <ul className="cardcontainer">
                <li className="cardlistitem"><label className="cardlabel">Name:</label> {Ownername}</li>
                <li className="cardlistitem"><label className="cardlabel">Item:</label> {(props.name)}</li>
                <li className="cardlistitem"><label className="cardlabel">Price:</label> ${numeral(props.price).format('0,0')}</li>
                <li className="cardlistitem"><label className="cardlabel">Location:</label> {(props.location)}</li>
            </ul>
            <button className="cardbutton" onClick={handleClick}><Link className="linktext" to={{pathname: `/item/${props.name}`}} >Details </Link></button>
            
            <button className="cardbutton" onClick={handleClick}><Link className="linktext" to={{pathname: '/updateList'}}>Update</Link></button>
            
            <button className="cardbutton" onClick={deletefunc}>Delete</button>
        </div>
        :
        <Redirect
          to={{
          pathname: '/profile'
        }} />
     );
}

const mapStateToProps = (state) =>({
    item : state.wobbeReducer.item,
    
})

const mapActionToProps = {
    setItem : actions.setItem,
}

export default connect(mapStateToProps, mapActionToProps)(CardList);