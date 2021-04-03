import Vue from 'vue'
import { wrapFunctional } from './index'

const components = {
  CookieBanner: () => import('../..\\components\\cookie-banner.vue' /* webpackChunkName: "components/cookie-banner" */).then(c => wrapFunctional(c.default || c)),
  CustomTableCell: () => import('../..\\components\\custom-table-cell.vue' /* webpackChunkName: "components/custom-table-cell" */).then(c => wrapFunctional(c.default || c)),
  CustomTable: () => import('../..\\components\\custom-table.vue' /* webpackChunkName: "components/custom-table" */).then(c => wrapFunctional(c.default || c)),
  DateLiteralsValueEntryForm: () => import('../..\\components\\date-literals-value-entry-form.vue' /* webpackChunkName: "components/date-literals-value-entry-form" */).then(c => wrapFunctional(c.default || c)),
  Editor: () => import('../..\\components\\editor.vue' /* webpackChunkName: "components/editor" */).then(c => wrapFunctional(c.default || c)),
  FieldDetails: () => import('../..\\components\\field-details.vue' /* webpackChunkName: "components/field-details" */).then(c => wrapFunctional(c.default || c)),
  FieldForm: () => import('../..\\components\\field-form.vue' /* webpackChunkName: "components/field-form" */).then(c => wrapFunctional(c.default || c)),
  FieldsGroup: () => import('../..\\components\\fields-group.vue' /* webpackChunkName: "components/fields-group" */).then(c => wrapFunctional(c.default || c)),
  Fields: () => import('../..\\components\\fields.vue' /* webpackChunkName: "components/fields" */).then(c => wrapFunctional(c.default || c)),
  FilterEntryForm: () => import('../..\\components\\filter-entry-form.vue' /* webpackChunkName: "components/filter-entry-form" */).then(c => wrapFunctional(c.default || c)),
  FilterForm: () => import('../..\\components\\filter-form.vue' /* webpackChunkName: "components/filter-form" */).then(c => wrapFunctional(c.default || c)),
  GroupByForm: () => import('../..\\components\\group-by-form.vue' /* webpackChunkName: "components/group-by-form" */).then(c => wrapFunctional(c.default || c)),
  Loading: () => import('../..\\components\\loading.vue' /* webpackChunkName: "components/loading" */).then(c => wrapFunctional(c.default || c)),
  Logo: () => import('../..\\components\\logo.vue' /* webpackChunkName: "components/logo" */).then(c => wrapFunctional(c.default || c)),
  OrderByForm: () => import('../..\\components\\order-by-form.vue' /* webpackChunkName: "components/order-by-form" */).then(c => wrapFunctional(c.default || c)),
  QueryResults: () => import('../..\\components\\query-results.vue' /* webpackChunkName: "components/query-results" */).then(c => wrapFunctional(c.default || c)),
  QueryTextEditor: () => import('../..\\components\\query-text-editor.vue' /* webpackChunkName: "components/query-text-editor" */).then(c => wrapFunctional(c.default || c)),
  RedirectButton: () => import('../..\\components\\redirect-button.vue' /* webpackChunkName: "components/redirect-button" */).then(c => wrapFunctional(c.default || c)),
  RelationshipSelector: () => import('../..\\components\\relationship-selector.vue' /* webpackChunkName: "components/relationship-selector" */).then(c => wrapFunctional(c.default || c)),
  SelectedFields: () => import('../..\\components\\selected-fields.vue' /* webpackChunkName: "components/selected-fields" */).then(c => wrapFunctional(c.default || c)),
  SideBar: () => import('../..\\components\\side-bar.vue' /* webpackChunkName: "components/side-bar" */).then(c => wrapFunctional(c.default || c)),
  SideMenu: () => import('../..\\components\\side-menu.vue' /* webpackChunkName: "components/side-menu" */).then(c => wrapFunctional(c.default || c)),
  SignupForm: () => import('../..\\components\\signup-form.vue' /* webpackChunkName: "components/signup-form" */).then(c => wrapFunctional(c.default || c)),
  SoqlForm: () => import('../..\\components\\soql-form.vue' /* webpackChunkName: "components/soql-form" */).then(c => wrapFunctional(c.default || c)),
  SoqlPlan: () => import('../..\\components\\soql-plan.vue' /* webpackChunkName: "components/soql-plan" */).then(c => wrapFunctional(c.default || c)),
  SuccessMessage: () => import('../..\\components\\success-message.vue' /* webpackChunkName: "components/success-message" */).then(c => wrapFunctional(c.default || c)),
  Tab: () => import('../..\\components\\tab.vue' /* webpackChunkName: "components/tab" */).then(c => wrapFunctional(c.default || c)),
  Tabs: () => import('../..\\components\\tabs.vue' /* webpackChunkName: "components/tabs" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
