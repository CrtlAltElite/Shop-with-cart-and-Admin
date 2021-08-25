import React, { Component } from 'react'
import {getCategories} from '../api/apiCategory';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import {Redirect} from 'react-router-dom';
import {getItems, putItem, deleteItem} from '../api/apiItems';
import {Button} from 'react-bootstrap'


const CreateItemFormSchema = Yup.object().shape({
    "name":Yup.string().required("Required"),
    "description":Yup.string().required("Required"),
    "price":Yup.string().matches(/^\d+(\.\d{0,2})?$/,"Must be a Valid Price").required("Required"),
    "img":Yup.string().required("Required"),
    "category_id":Yup.number().integer().required("Required")
})

export default class EditItem extends Component {
    constructor(){
        super();
        this.state={
            tokenError:false,
            serverErrorCats:false,
            categories:[],
            successfulPost:false,
            unsuccessfulPost:false,
            unsuccessfulDelete:false,
            successfulDelete:false,
            items:[],
            item:{}
        }
    }
    componentDidMount(){
        this.getAllCats()
        this.getAllItems()
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
        const newItem= this.state.items.filter((li)=>li.id===parseInt(newId))[0]
        this.setState({item:newItem})
    }

    handleDelete=async()=>{
        if (window.confirm(`Are you sure you want to delete ${this.state.item.name}?`)){
            const res = await deleteItem(localStorage.getItem('token'),this.state.item.id)
            if (res) {
                this.setState({successfulDelete:true, unsuccessfulDelete:false, item:{}});
                this.getAllItems()
            }else{
                this.setState({successfulDelete:false, unsuccessfulDelete:true})
            }
        }
    }

    handleSubmit=async(values)=>{
        const res=await putItem(localStorage.getItem('token'),{id:this.state.item.id, ...Object.fromEntries(Object.entries(values).map((e)=>e[1]!==null?[e[0],e[1]]:[e[0],'']))})
        console.log(res)
        if (res){
            this.setState({successfulPost:true,unsuccessfulPost:false,item:{}})
            this.getAllItems()
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
                <label htmlFor="itemsList" className="form-label">Choose Item To Edit</label>
                <select id="options" className="form-select form-select-lg mb-3" name="itemsList" onChange={(event)=>this.handlePullDown(event)}>
                    <option defaultValue={0} label="--Choose a item--"/>
                    {this.state.items?.map((i)=><option key={i.id} value={i.id} label={i.name}/>)}
                </select>
                <br/>

                {Object.entries(this.state.item??{}).length>0 ?
                <>
                    <hr/>
                    <h2>#{this.state.item?.id??'000'} - {this.state.item?.name??"No Item Name"}</h2>
                    <Button variant="danger" onClick={()=>{this.handleDelete()}}>Delete Item</Button>
                    <hr/>

                     <Formik initialValues={{
                         name:this.state.item?.name ?? '',
                         description:this.state.item?.description??'',
                         price:this.state.item?.price ?? '',
                         img:this.state.item?.img??'',
                         category_id:this.state.item?.category_id??''
                     }}
                validationSchema={CreateItemFormSchema}
                onSubmit={(values,{resetForm})=>{
                    this.handleSubmit(values);
                    resetForm({name:'',description:'',price:'',img:'',category_id:''})
                }}
                >
                {({errors,touched})=>(
                    <Form>
                        <label htmlFor="name" className="form-label">Item Name</label>
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


                        <button className="btn btn-primary form-control" type="submit">Edit Item</button>

                    </Form>
                )}
                </Formik>                 

                </>
                :""}
            </div>
        )
    }
}
