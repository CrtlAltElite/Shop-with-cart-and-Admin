import React, { Component } from 'react'
import {getItem} from '../api/apiItems'
import ItemCard from '../components/ItemCard'

export default class SingleItem extends Component {
    constructor() {
        super();
        this.state={
            item:false
        }
    }

    componentDidMount() {
        this.getSingleItem()
    }

    getSingleItem = async () =>{
        const item=await getItem(localStorage.getItem('token'),this.props.match.params.id)
        if(item === 400){this.setState({tokenError:true})}
        if(item === 500){this.setState({serverError:true})}
        if (item !== 500 && item !== 400){
            this.setState({item})
        }
    }



    render() {
        return (
            <div>
                {this.state.item ?
                    <ItemCard item={this.state.item} addToCart={this.props.addToCart}/>
                    :
                    ''
                }
            </div>
        )
    }
}
