import * as types from './mutation-types'
export default {
  namespaced: true,
  state: {
    posts: [],
    tags: [],
    currentPost: {},
    filteredPosts: []
  },
  getters: {
    getPosts: state => state.posts,
    getLastPost: state => state.posts[0],
    getRemainingPosts: state => state.posts.slice(1),
    getTags: state => state.tags,
    getCurrentPost: state => state.currentPost,
    getFilteredPosts: state => state.filteredPosts
  },
  actions: {
    loadPosts ({commit}) {
      function loadJSON (callback) {
        const xobj = new XMLHttpRequest()
        xobj.overrideMimeType('application/json')
        xobj.open('GET', '/static/posts/posts.json', true)
        xobj.onreadystatechange = function () {
          if (
            /* eslint-disable */
            xobj.readyState == 4 && xobj.status == '200'
            /* eslint-enable */
          ) {
            callback(xobj.responseText)
          }
        }
        xobj.send(null)
      }
      loadJSON(function (response) {
        const posts = JSON.parse(response)
        commit(types.LOAD_POSTS, posts)
        return posts
      })
    },
    setCurrentPost ({commit}, rout) {
      commit(types.SET_CURRENT_POST, rout)
    },
    setFilteringTag ({commit}, tag) {
      commit(types.SET_FILTERING_TAG, tag)
    }
  },
  mutations: {
    [types.LOAD_POSTS] (state, posts) {
      const tagsSet = new Set()
      const re =/\/n/ig
      const path = window.location.pathname.split('/')[2]

      posts.forEach(e => {
        const tags = e.tags.split(', ')
        tags.forEach(e => tagsSet.add(e))
      })
      state.tags = [...tagsSet]

      posts.forEach(function (e) {
        const tagsSet = new Set()
        const tags = e.tags.split(', ')
        tags.forEach(e => tagsSet.add(e))
        e.tags = [...tagsSet]
        e.text = `<p>${e.text.replace(re, '</p><p>')}</p>`
      })

      state.currentPost = posts.filter(e => e.rout === path)[0]
      state.filteredPosts = posts.filter(e => e.tags.some(e => e == path))

      state.posts = posts
    },
    [types.SET_CURRENT_POST] (state, rout) {
      state.currentPost = state.posts.filter(e => e.rout === rout)[0]
    },
    [types.SET_FILTERING_TAG] (state, tag) {
      state.filteredPosts = state.posts.filter(e => e.tags.some(e => e == tag))
    }
  }
}