import axios from 'axios'
import { Redirect } from 'react-router-dom';
import React from "react";
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_baseAPIURL,
    withCredentials: false,
    timeout: 30000,
});

axiosInstance.interceptors.response.use(
    res => {

        return res;
    },
    error => {
        return Promise.reject(error.response)
    }
);

export const signup = (user) => {
    return axiosInstance.post('user/register', user)
    .then((res) => {
        return res.data;
    })
}
export const login = (email, password) => {
    return axiosInstance.post('user/login', {
        email,
        password
    }).then(res => {
        console.log(res.data);
        return res.data;
    })
}
export const changePassword = (email) =>{
    return axiosInstance.post('/user/resetPasswordRequest', {email: email})
    .then((res) => {
        return res.data
    })
}


export const getUser = (jwt, id) => {
    return axiosInstance.get('user/profile/'+id, {headers: { Authorization: jwt } }).then(res => {
        // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
        console.log('form api 2', res);
        return res.data;
    })
}

export const logout = (jwt, user) =>{
    const headers = {
        Authorization: jwt
      }
    return axiosInstance.post('user/logout', user,  {headers: headers}).then(res => {
        return res.data;
    });
}

export const createProject = (jwt, formData)=> {
    const headers = {
        'Content-Type': "multipart/form-data",
        'Authorization': jwt
      }
    return axiosInstance.post('project/add', formData,{headers:headers })
        .then((res) => {
            return res.data;
      });
}
export const createCollaboration = (jwt, formData)=> {
    const headers = {
        'Content-Type': "multipart/form-data",
        'Authorization': jwt
      }
    return axiosInstance.post('collaboration/create', formData,{headers:headers })
        .then((res) => {
            return res;
      });
}

export const updateUser = (jwt, formData) => {
    const headers = {
        'Content-Type': "multipart/form-data",
        'Authorization': jwt
      }
      return axiosInstance.patch('user/update', formData,{headers:headers }).then((res) => {
            return res;
      });
}
export const getProjects = (jwt, userId) => {
    return axiosInstance.get('user/viewProjects/'+userId, {headers: { Authorization: jwt } }).then(res => {
        // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
        console.log('form api getting projs ', res.data);
        return res.data;
    })
}
export const getCollaborations = (jwt, userId) => {
    return axiosInstance.get('user/getCollaborations/'+userId, {headers: { Authorization: jwt } }).then(res => {
        // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;
        console.log('form api getting colabs ', res.data);
        return res.data;
    })
}
export const getCollaboration = (jwt, colabId) => {
    return axiosInstance.get('collaboration/'+colabId, {headers: { Authorization: jwt } }).then(res => {
        return res.data;
    })
}

export const getInterestsList=() => {
    return axiosInstance.get('user/interestsList')
        .then(res => {
            return res.data;
        });	
}
export const followUser = (jwt, userId) =>{
    console.log("started follow: ", userId);
    console.log(jwt);
    return axiosInstance.put('user/follow/'+userId, userId,{headers: { Authorization: jwt } }).then(res => {
        //the followed/unfollowed user
        return res.data;
    });

}

