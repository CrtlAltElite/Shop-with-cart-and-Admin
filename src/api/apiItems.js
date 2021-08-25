import apiClientWithToken from './clientTokenAuth'

const endpointsItems = "/api/item";
const endpointAllItems = '/api/all_items';
const endpointItemsByCat = "/api/items_by_category_id";


export const getItems = async (token) =>{
    const response = await apiClientWithToken(token).get(endpointAllItems);
    if (400 <= response.status && response.status <500){return 400;}
    if (500 <= response.status && response.status <600){return 500;}
    if (response.ok){ return response.data.items}
    return
}

export const getItemsByCat =async (token, id)=>{
    const response = await apiClientWithToken(token).get(endpointItemsByCat,{id});
    if (400 <= response.status && response.status <500){return 400;}
    if (500 <= response.status && response.status <600){return 500;}
    if (response.ok){ return response.data.items}
    return
}

export const getItem = async (token, id) =>{
    const response = await apiClientWithToken(token).get(endpointsItems,{id});
    if (400 <= response.status && response.status <500){return 400;}
    if (500 <= response.status && response.status <600){return 500;}
    if (response.ok){ return response.data}
    return
}

export const postItem =async (token, data) =>{
    const response = await apiClientWithToken(token).post(endpointsItems,data);
    if (response.ok){return true}else{return false}
}

export const putItem =async (token, data) =>{
    const response = await apiClientWithToken(token).put(endpointsItems,data);
    if (response.ok){return true}else{return false}
}

export const deleteItem =async (token, id) =>{
    const response = await apiClientWithToken(token).delete(endpointsItems,{},{data:{id}});
    if (response.ok){return true}else{return false}
}