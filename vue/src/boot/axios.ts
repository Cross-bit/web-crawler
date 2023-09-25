
// src/boot/axios.js

import { boot } from 'quasar/wrappers'
import axios from 'axios'

const CRAWLER_API_BASE_URL = process.env.CRAWLER_BASE_URL;
const NODES_API_BASE_URL = 'http://localhost:5500/api/v1'; //process.env.NODES_API_BASE_URL; 
// TODO: figure out what is going on why it is not loading the env variable

const api = axios.create({ baseURL: CRAWLER_API_BASE_URL })

console.log(CRAWLER_API_BASE_URL);
const nodesApi = axios.create({baseURL: NODES_API_BASE_URL})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  app.config.globalProperties.$nodesApi = nodesApi
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api, nodesApi }