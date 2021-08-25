import React, { Component } from 'react';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import {Button} from 'react-bootstrap';
import getToken from '../api/apiBasicAuth';
import {Redirect} from 'react-router-dom';

const loginFormSchema = Yup.object().shape({
    "email": Yup.string().email("Must be a valid e-mail format").required('Required'),
    "password": Yup.string().required('')
})

const loginFormInitialValues={
    email:'',
    password:''
}

export default class Login extends Component {

    constructor(){
        super();
        this.state={
            badLogin:false,
            serverError:false,
            redirect:false,
        }
    }

    handleSubmit=async ({email, password})=>{
        const token = await getToken(email, password)
        if (token ===401){return this.setState({badLogin:true, serverError:false})}
        if (token ===500){return this.setState({badLogin:false, serverError:true})}
        localStorage.setItem('token', token)
        this.props.setToken(token)
        this.setState({redirect:true})
    }

    render() {

        const styles={
            error:{color:'red'}
        }
        return (
            <div>                                          
                {this.state.redirect ? <Redirect to={{pathname:"/", props:{token:localStorage.getItem("token")} }}/>:''}
                <Formik 
                    initialValues={loginFormInitialValues}
                    validationSchema={loginFormSchema}
                    onSubmit={(values)=>{console.log(values); this.handleSubmit(values)}}
                    >
                {({errors, touched})=>(
                    <Form>
                        <label htmlFor="email" className="form-label">Email</label>
                        <Field name="email" className="form-control"/>
                        {errors.email && touched.email ? (<div style={styles.error}>{errors.email}</div>):null}

                        <label htmlFor="password" className="form-label">Password</label>
                        <Field name="password" className="form-control" type="password"/>
                        {errors.password && touched.password ? (<div style={styles.error}>{errors.password}</div>):null}

                        {this.state.badLogin?<small style={styles.error}>Invalid Email/Password combo</small>:''}
                        {this.state.searverError?<small style={styles.error}>Unexpected error please Try again</small>:''}
                        <br/>
                        <Button type="submit">Login</Button>
                    </Form>
                )}
                </Formik>
            </div>
        )
    }
}
