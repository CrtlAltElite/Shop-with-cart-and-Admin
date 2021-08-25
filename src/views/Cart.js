import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap'

export default class Cart extends Component {
    render() {
        return (
            <div>

                {Object.keys(this.props.cart).length>0 ?
                <Table stripe bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quanity</th>
                            <th>Remove One</th>
                            <th>Remove All</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.props.cart).map((key)=>
                        <tr key={this.props.cart[key].id}>
                            <td>{this.props.cart[key].id}</td>
                            <td><img alt="The Item" style={{height:'100px',objectFit:"contain"}} 
                                src={this.props.cart[key].img??'https://res.cloudinary.com/cae67/image/upload/v1629310111/fakebook_shop/no-image_nkau78.png'}/></td>
                            <td>{this.props.cart[key].name??'No name'}</td>
                            <td>{this.props.cart[key].description??"No Description"}</td>
                            <td>{this.props.cart[key].price.toFixed(2)??'No Price'}</td>
                            <td>{this.props.cart[key].quanity??'0'}</td>
                            <td><Button variant="danger" onClick={()=>this.props.removeFromCart(this.props.cart[key])}>Remove One</Button></td>
                            <td><Button variant="danger" onClick={()=>this.props.removeAllFromCart(this.props.cart[key])}>Remove All</Button></td>
                        </tr>
                        )
                        }
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{this.props.getCartTotalPrice().toFixed(2)}</td>
                            <td>{this.props.getCartItemTotal()} </td>
                            <td></td>
                            <td></td>
                        </tr>

                    </tbody>

                </Table>
                :<h2>Your Cart is Empty.  Please Go shop</h2>}
            </div>
        )
    }
}
