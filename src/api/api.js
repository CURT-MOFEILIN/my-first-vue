import Axios from 'axios'

let base = 'http://localhost:9088'

export const Login = params => {
  return Axios({
    method: 'post',
    url: `${base}/login`,
    data: params
  })
}

export const getUserList = params => { return Axios.get(`${base}/user/list`, { params: params }) }

export const getOrgs = params => { return Axios.get(`${base}/orgs/list`, { params: params }) }

export const getOrgTree = params => { return Axios.get(`${base}/orgs/getOrgTree`, { params: params }) }

export const deleteUser = params => { return Axios.get(`${base}/user/deteleById`, { params: params }) }

export const editUser = params => { return Axios.get(`${base}/user/edit`, { params: params }) }

export const addUser = postData => {
  return Axios({
    method: 'post',
    url: `${base}/user/add`,
    data: postData
  })
}

export const getNextTreeId = () => { return Axios.get(`${base}/orgs/nextId`) }

export const addOrg = postData => {
  return Axios({
    method: 'post',
    url: `${base}/orgs/addOrg`,
    data: postData
  })
}

export const editOrg = params => { return Axios.get(`${base}/orgs/editOrg`, { params: params }) }

export const delOrg = params => { return Axios.get(`${base}/orgs/delOrg`, { params: params }) }
