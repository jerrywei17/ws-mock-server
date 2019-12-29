import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const axiosInstance = axios.create({
  baseURL: process.env.HOST
})

axiosInstance.interceptors.response.use((res: {data: any}) => {
  return res.data
}, function (error: Error) {
  return Promise.reject(error)
})

export const fetchProject = ():Promise<Array<object>> => axiosInstance.get('/project')

export const createProject = (data: object):Promise<Array<object>> => axiosInstance.post('/project', data)

export const updateProject = (id: string, data: Object):Promise<Project> => axiosInstance.patch(`/project/${id}`, data)

export const deleteProject = (id: string):Promise<string> => axiosInstance.delete(`/project/${id}`)

export const fetchProjectMockEvent = (id: string):Promise<Array<object>> => axiosInstance.get(`/project/${id}/event`)

export const createMockEvent = (id: string, data:object):Promise<object> => axiosInstance.post(`/project/${id}/event`, data)

export const deleteMockEvent = (id: string):Promise<string> => axiosInstance.delete(`/event/${id}`)

export const updateMockEvent = (id: string, data: Object):Promise<MockEvent> => axiosInstance.patch(`/event/${id}`, data)
