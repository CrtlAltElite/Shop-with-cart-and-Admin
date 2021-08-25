import { create } from 'apisauce';

const apiClientWithToken = (token) => create({
    baseURL: "http://127.0.0.1:5000",
    headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type':'application/json'
    }
    })

export default apiClientWithToken;