import React, { Component } from 'react';
import {postCategory} from '../api/apiCategory';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';

const CreateItemFormSchema = Yup.object().shape({
    "name":Yup.string().required("Required")
})

const FormIntialValues={
    name:''
}

export default class CreateCategory extends Component {
    constructor(){
        super();
        this.state={
            successfulPost:false,
            unsuccessfulPost:false
        };
    }

    handleSubmit=async ({name})=>{
        const res=await postCategory(localStorage.getItem('token'),name)
        console.log(res)
        if (res){
            this.setState({successfulPost:true,unsuccessfulPost:false})
        }else{
            this.setState({unsuccessfulPost:true,successfulPost:false})
        }
    }

    render() {
        return (
            <div>
                {this.state.successfulPost?<small style={{color:"green"}}>Your Category was Created</small>:''}
                {this.state.unsuccessfulPost?<small style={{color:"red"}}>Error Creating Category, Please Try again!</small>:''}
                <br/>
                <h1>Create Category</h1>
                <Formik initialValues={FormIntialValues}
                validationSchema={CreateItemFormSchema}
                onSubmit={(values)=>this.handleSubmit(values)}
                >
                {({errors,touched})=>(
                    <Form>
                        <label htmlFor="name" className="form-label">New Category Name</label>
                        <Field name="name" className="form-control"/>
                        {errors.name && touched.name ? (<div style={{color:'red'}}>{errors.name}</div>):null}

                        <button className="btn btn-primary form-control" type="submit">Create Category</button>

                    </Form>
                )}
                </Formik>
            </div>
        )
    }
}
