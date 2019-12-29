import Vue from 'vue';
import Vuex from 'vuex';
import {
  fetchProject,
  deleteProject,
  fetchProjectMockEvent,
  deleteMockEvent } from '@/service'

Vue.use(Vuex);

const state: StoreState = {
  projects: [],
  mockEvents: {}
}

export default new Vuex.Store({
  state,
  mutations: {
    initProject: (state: StoreState, projects: Array<Project>) => {
      state.projects = projects
    },
    addProject: (state: StoreState, project: Project) => {
      state.projects.push(project)
    },
    deleteProject: (state: StoreState, id: string) => {
      state.projects.splice(state.projects.findIndex(p => p._id === id), 1)
    },
    updateProject: (state: StoreState, project: Project) => {
      Object.assign(state.projects[state.projects.findIndex((p) => p._id === project._id)], project)
    },
    initMockEvents: (state: StoreState, { id, events}) => {
      Vue.set(state.mockEvents, id, events)
    },
    addMockEvent: (state: StoreState, event: MockEvent) => {
      state.mockEvents[event.project_id].push(event)
    },
    deleteMockEvent: (state: StoreState, event: MockEvent) => {
      let events: Array<MockEvent> = state.mockEvents[event.project_id]
      events.splice(events.findIndex((e) => e._id === event._id), 1)
    },
    updateMockEvent: (state: StoreState, event: MockEvent) => {
      let events: Array<MockEvent> = state.mockEvents[event.project_id]
      Object.assign(events[events.findIndex((e) => e._id === event._id)], event)
    }
  },
  actions: {
    fetchProject: ({commit, state}) => {
      if(state.projects.length){
        return Promise.resolve(state.projects)
      }
      return fetchProject().then((res: Array<Object>) => {
        commit('initProject', res)
        return state.projects
      })
    },
    deleteProject: ({ commit }, id: string) => {
      return deleteProject(id).then(() => {
        commit('deleteProject', id)
      })
    },
    fetchProjectMockEvent: ({commit, state}, id: string) => {
      if(state.mockEvents[id]){
        return Promise.resolve(state.mockEvents[id])
      }
      return fetchProjectMockEvent(id).then(res => {
        commit('initMockEvents', {
          id,
          events: res
        })
        return res
      })
    },
    deleteMockEvent: ({ commit }, event: MockEvent) => {
      return deleteMockEvent(event._id).then(() => {
        commit('deleteMockEvent', event)
      })
    }
  },
});
