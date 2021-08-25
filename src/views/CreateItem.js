import React, { Component } from 'react';
import {getCategories} from '../api/apiCategory';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import {Redirect} from 'react-router-dom';
import {postItem} from '../api/apiItems';

const CreateItemFormSchema = Yup.object().shape({
    "name":Yup.string().required("Required"),
    "description":Yup.string().required("Required"),
    "price":Yup.string().matches(/^\d+(\.\d{0,2})?$/,"Must be a Valid Price").required("Required"),
    "img":Yup.string().required("Required"),
    "category_id":Yup.number().integer().required("Required")
})

const FormIntialValues={
    name:'',
    description:'',
    price:'',
    img:'',
    category_id:''
}


export default class CreateItem extends Component {
    constructor(){
        super();
        this.state={
            tokenError:false,
            serverErrorCats:false,
            categories:[],
            successfulPost:false,
            unsuccessfulPost:false
        };
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

    handleSubmit=async (values)=>{
        const res=await postItem(localStorage.getItem('token'),values)
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
                {this.state.successfulPost?<small style={{color:"green"}}>Your Item was Created</small>:''}
                {this.state.unsuccessfulPost?<small style={{color:"red"}}>Error Creating Item, Please Try again!</small>:''}
                {this.state.serverErrorCats ? <small style={{color:"red"}}>Error Try Again Later</small>:''}
                {this.state.tokenError?<Redirect to='/login'/>:''}
                <br/>
                <h1>Create Items</h1>

                <Formik initialValues={FormIntialValues}
                validationSchema={CreateItemFormSchema}
                onSubmit={(values)=>this.handleSubmit(values)}
                >
                {({errors,touched})=>(
                    <Form>
                        <label htmlFor="name" className="form-label">New Item Name</label>
                        <Field name="name" className="form-control"/>
                        {errors.name && touched.name ? (<div style={{color:'red'}}>{errors.name}</div>):null}

                        <label htmlFor="description" className="form-label">Description</label>
                        <Field name="description" className="form-control"/>
                        {errors.description && touched.description ? (<div style={{color:'red'}}>{errors.description}</div>):null}

                        <label htmlFor="price" className="form-label">Price</label>
                        <Field name="price" className="form-control"/>
                        {errors.price && touched.price ? (<div style={{color:'red'}}>{errors.price}</div>):null}

                        <label htmlFor="img" className="form-label">Image Url</label>
                        <Field name="img" className="form-control"/>
                        {errors.img && touched.img ? (<div style={{color:'red'}}>{errors.img}</div>):null}

                        <label htmlFor="category_id" className="form-label">Category</label>
                        <Field as="select" name="category_id" className="form-select">
                            {this.state.categories?.map((cat)=><option key={cat.id} value={cat.id} label={cat.name}/>)}
                        </Field>
                        {errors.category_id && touched.category_id ? (<div style={{color:'red'}}>{errors.category_id}</div>):null}


                        <button className="btn btn-primary form-control" type="submit">Create Item</button>

                    </Form>
                )}
                </Formik>
            </div>
        )
    }
}
