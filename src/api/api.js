import Axios from 'axios'

let base = 'http://localhost:9088'

export const getUserList = params => { return Axios.get(`${base}/user/list`, { params: params }) }

export const getOrgs = params => { return Axios.get(`${base}/orgs/list`, { params: params }) }

export const getOrgTree = params => { return Axios.get(`${base}/orgs/getOrgTree`, { params: params }) }

export const getUsersByOrgId = params => { return Axios.get(`${base}/user/getUsersByOrgId`, { params: params }) }

export const deleteUser = params => { return Axios.get(`${base}/user/deteleById`, { params: params }) }

export const editUser = params => { return Axios.get(`${base}/user/edit`, { params: params }) }

export const addUser = postData => {
  return Axios({
    method: 'post',
    url: `${base}/user/add`,
    data: postData
  })
}
