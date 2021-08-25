import React, { Component } from 'react'

export default class Example extends Component {
    constructor(){
        super();
        this.state={
            name : 'Pika',
            students: ['Thu',"Benny","Chris","Leo","Sean","Sydney"]
        };
        console.log("In constuctor!")
    }

    componentDidMount(){
        console.log("in component Did mount")
    }
    componentDidUpdate(){
        console.log("in component Did update")
    }

    componentWillUnmount(){
        console.log("in component will unmount")
    }

    render() {
        
        const setName = (name) => {
            this.setState({name:name},()=>console.log("State has been changed now"));
            console.log("Log the name after i do setState", this.state.name)
        }
        const styles ={
            button:{
                backgroundColor:'blue',
                color:'white'
            },
            text:{
                color:'green',
                backgroundColor:'yellow'
            }
            
        }
        
        return (
            <div>
                {console.log("in the render")}
                {this.state.name === 'Pika' ? `Lets play a game ${this.state.name}` : `Did I scare you ${this.state.name}?`}
                <br/>

                <span style={styles.text}>The name is {this.state.name}</span>
                <br/>
                <button style={styles.button}onClick={()=>setName("Boo")}>Set Name to "Boo"</button>
                <button style={styles.button}onClick={()=>setName("Pika")}>Set Name to "Pika"</button>


                <div style={{backgroundColor:'red',color:'green',marginTop:'60px'}}>
                    Display a new list element for every item in an array
                </div>
                <ul>
                    {this.state.students.map((student, index)=><li key={index}>{student}</li>)}
                </ul>

            </div>
        )
    }
}
