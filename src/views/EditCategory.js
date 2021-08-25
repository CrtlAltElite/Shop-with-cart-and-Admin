import React, { Component } from 'react'
import {putCategory, deleteCategory, getCategories} from '../api/apiCategory';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import { Redirect } from 'react-router-dom';
import {Button} from 'react-bootstrap'


const FormSchema = Yup.object().shape({
    "name": Yup.string().required("Required")
})


export default class EditCategory extends Component {
    constructor() {
        super();
        this.state={
            serverErrorCats:false,
            tokenError:false,
            categories:[],
            successfulDelete:false,
            unsuccessfulDelete:false,
            successfulPost:false,
            unsuccessfulPost:false,
            category:{}
        }
    }
    componentDidMount(){
        this.getAllCats()
    }
    
    getAllCats=async () =>{
        const cats = await getCategories(localStorage.getItem('token'))
        if(cats === 400){this.setState({tokenError:true})}
        if(cats === 500){this.setState({serverErrorCats:true})}
        if (cats !== 500 && cats !== 400){
            this.setState({categories:cats})
        }
    }

    handlePullDown = (event)=>{
        const newId = event.target.value;
        console.log("handlepulldown", newId)
        if (newId===0){return}
        const newCat= this.state.categories.filter((li)=>li.id===parseInt(newId))[0]
        this.setState({category:newCat})
    }

    handleDelete=async()=>{
        if (window.confirm(`Are you sure you want to delete ${this.state.category.name}?`)){
            const res = await deleteCategory(localStorage.getItem('token'),this.state.category.id)
            if (res) {
                this.setState({successfulDelete:true, unsuccessfulDelete:false, category:{}});
                this.getAllCats()
            }else{
                this.setState({successfulDelete:false, unsuccessfulDelete:true})
            }
        }
    }

    handleSubmit=async({name})=>{
        const res=await putCategory(localStorage.getItem('token'),{id:this.state.category.id, name})
        console.log(res)
        if (res){
            this.setState({successfulPost:true,unsuccessfulPost:false})
            this.getAllCats()
        }else{
            this.setState({unsuccessfulPost:true,successfulPost:false})
        }
    }

    render() {
        return (
            <div>
                {this.state.successfulPost?<small style={{color:"green"}}>Your Category was Edited</small>:''}
                {this.state.unsuccessfulPost?<small style={{color:"red"}}>Error Editing Category, Please Try again!</small>:''}
                {this.state.serverErrorCats ? <small style={{color:"red"}}>Error Try Again Later</small>:''}
                {this.state.tokenError?<Redirect to='/login'/>:''}
                <br/>
                <label htmlFor="cats" className="form-label">Choose Category To Edit</label>
                <select id="options" className="form-select form-select-lg mb-3" name="cats" onChange={(event)=>this.handlePullDown(event)}>
                    <option defaultValue={0} label="--Choose a Category--"/>
                    {this.state.categories?.map((cat)=><option key={cat.id} value={cat.id} label={cat.name}/>)}
                </select>
                <br/>
                {Object.entries(this.state.category??{}).length>0 ?
                <>
                    <hr/>
                    <h2>#{this.state.category?.id??'000'} - {this.state.category?.name??"No Category Name"}</h2>
                    <Button variant="danger" onClick={()=>{this.handleDelete()}}>Delete Category</Button>
                    <hr/>
                    <Formik initialValues={{name:this.state.category?.name ?? ''}}
                        enableReinitialize
                        validationSchema={FormSchema}
                        onSubmit={(values, {resetForm})=>{
                            this.handleSubmit(values);
                            resetForm({name:''})
                        }}
                        >
                        {({errors,touched})=>(
                            <Form>
                                <label htmlFor="name" className="form-label">Category Name</label>
                                <Field name="name" className="form-control"/>
                                {errors.name && touched.name ? (<div style={{color:'red'}}>{errors.name}</div>):null}

                                <button className="btn btn-primary form-control" type="submit">Edit Category</button>

                            </Form>
                        )}
                        </Formik>

                </>
                :""}

            </div>
        )
    }
}
