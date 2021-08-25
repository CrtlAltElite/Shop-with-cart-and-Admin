import React, { Component } from 'react'
import {titleCase} from '../helpers'
import { Col, Row, Button } from 'react-bootstrap'
import {getCategories} from '../api/apiCategory'
import {getItems, getItemsByCat} from '../api/apiItems'
import ItemCard from '../components/ItemCard'
import {Redirect} from 'react-router-dom'

export default class Shop extends Component {
    constructor() {
        super();
        this.state={
            categories:[],
            items:[],
            serverErrorCats:false,
            serverErrorItems:false,
            tokenError:false,
            itemStart:0,
            itemEnd:10,
        }
    }
    componentDidMount(){
        this.getAllCats()
        this.getAllItems()
        // do api calls        
    }

    getAllCats=async () =>{
        const cats = await getCategories(localStorage.getItem('token'))
        if(cats === 400){this.setState({tokenError:true})}
        if(cats === 500){this.setState({serverErrorCats:true})}
        if (cats !== 500 && cats !== 400){
            this.setState({categories:cats})
        }
    }

    getAllItems=async () =>{
        const items = await getItems(localStorage.getItem('token'))
        if(items === 400){this.setState({tokenError:true})}
        if(items === 500){this.setState({serverErrorItems:true})}
        if (items !== 500 && items !== 400){
            this.setState({items,
                            itemStart:0,
                            itemEnd:10,})
        }
    }

    handleCat=async (id)=>{
        if (id===0){
            return await this.getAllItems()
        }
        const items = await getItemsByCat(localStorage.getItem('token'),id)
        if(items === 400){this.setState({tokenError:true})}
        if(items === 500){this.setState({serverErrorItems:true})}
        if (items !== 500 && items !== 400){
            this.setState({items,
                itemStart:0,
                itemEnd:10,})
        }
        console.log(items)
    }

    handlePrev=()=>{
        const oldStart=this.state.itemStart
        const oldEnd=this.state.itemEnd
        this.setState({itemStart:oldStart-10,itemEnd:oldEnd-10})
    }
    
    handleNext=()=>{
        const oldStart=this.state.itemStart
        const oldEnd=this.state.itemEnd
        this.setState({itemStart:oldStart+10,itemEnd:oldEnd+10})
    }

    render() {
        const styles={
            catButton:{
                backgroundColor:"white",
                color: 'black',
                width: '100%',
                border: '1px solid grey',
                borderRadius: '15px',
                marginBottom: '5px',
            }
        }
        return (
            <div>
                {this.state.serverErrorCats || this.state.serverErrorItems?<small style={{color:"red"}}>Error Try Again Later</small>:''}
                {this.state.tokenError?<Redirect to='/login'/>:''}
                <Row>
                    <Col md={3}>
                        {/* category section */}
                        <center><h3>Categories</h3></center>
                        <hr/>
                        <ul style={{listStyleType:'none'}}>
                                {/* come back */}
                            <li><button style={styles.catButton}onClick={()=>this.handleCat(0)}>All Items</button></li>
                            {this.state.categories.map((c)=><li key={c.id}><button style={styles.catButton}onClick={()=>this.handleCat(c.id)}>{titleCase(c.name)}</button></li>)}
                        </ul>
                    </Col>

                    <Col md={9}>
                        {/* item section */}
                        <Row>
                            {this.state.items.slice(this.state.itemStart,this.state.itemEnd).map((i)=><ItemCard addToCart={this.props.addToCart} item={i} key={i.id}/>)}
                        </Row>
                        <div className="d-flex justify-content-center">
                            <Button variant="danger" className={"me-2 " + (this.state.itemStart===0?"disabled":'')}onClick={()=>this.handlePrev()}>{"<< Prev"}</Button>
                            <Button variant="success" className={" " + (this.state.items?.length<=this.state.itemEnd?"disabled":'')} onClick={()=>this.handleNext()}>{"Next >>"}</Button>
                        </div>
                    </Col>
                </Row>
                
            </div>
        )
    }
}
