describe('The Login Page', () => {

    it('redirects the user to editor after loggin in', function () {
      cy.visit('/signin')
      cy.get('input[id=email]').clear().type('allanoricilcos2@outlook.com')
      cy.get('input[id=password]').clear().type(`07021994aA@`)
      cy.get('button[id=signin]').click()
      cy.url({timeout: 10000}).should('include', '/editor')
      cy.end()
    })
  })