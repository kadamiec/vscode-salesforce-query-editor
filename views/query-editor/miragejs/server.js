import { createServer } from 'miragejs'
import sobjects from '../data/sobjects.json'
import fingerprint from '../data/fingerprint.json'
import editor from '../data/editor.json'
import configuration from '../data/configuration.json'
import orgs from '../data/orgs.json'
import license from '../data/license.json'
import defaultusername from '../data/defaultusername.json'
import keygenUser from '../data/keygen-user.json'
import keygenValidateKey from '../data/keygen-validate-key.json'
import tokens from '../data/tokens.json'
import accountDetails from '../data/account-details.json'

export function makeServer({ environment = 'development' } = {}) {
  const server = createServer({
    environment,

    routes() {
      this.get('http://localhost:5000/vscode/fingerprint', () => {
        return fingerprint
      })

      this.get('http://localhost:5000/vscode/editor', () => {
        return editor
      })

      this.get('http://localhost:5000/vscode/license', () => {
        return license
      })

      this.get('http://localhost:5000/vscode/configuration', () => {
        return configuration
      })

      this.get('http://localhost:5000/sfdx/orgs', () => {
        return orgs
      })

      this.get('http://localhost:5000/salesforce/v50.0/sobjects', () => {
        return sobjects
      })

      this.get('http://localhost:5000/sfdx/defaultusername', () => {
        return defaultusername
      })

      this.post(
        'https://api.keygen.sh/v1/accounts/78edb4be-f034-4809-9ea9-b29b0dff113e/tokens',
        () => {
          return tokens
        }
      )

      this.get(
        'https://api.keygen.sh/v1/accounts/78edb4be-f034-4809-9ea9-b29b0dff113e/users/24d7e525-cb40-48f8-8d6d-aa8281c1ede5',
        () => {
          return keygenUser
        }
      )

      this.post(
        'https://api.keygen.sh/v1/accounts/78edb4be-f034-4809-9ea9-b29b0dff113e/licenses/actions/validate-key',
        () => {
          return keygenValidateKey
        }
      )

      this.post(
        'http://localhost:5000/salesforce/v50.0/composite/batch',
        () => {
          return accountDetails
        }
      )
    },
  })

  return server
}
