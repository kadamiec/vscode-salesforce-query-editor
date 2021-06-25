import { makeServer } from '../miragejs/server'

if (window.Cypress) {
  makeServer({ environment: 'test' })
}
