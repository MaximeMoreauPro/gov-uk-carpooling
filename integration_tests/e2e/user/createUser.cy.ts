import Page from '../../pages/page';
import CreateUser from '../../user/createUser';

context('Feature: create a user', () => {
  let currentPage: CreateUser;

  beforeEach(() => {
    cy.visit('/user/create');
    currentPage = Page.verifyOnPage(CreateUser);
  });

  describe('Should be able to create a user', () => {
    it('should display the create user form', () => {
      currentPage.inputText().should('have.length', 3);
      currentPage.inputText().eq(0).should('have.id', 'firstName');
      currentPage.inputText().eq(1).should('have.id', 'lastName');
      currentPage.inputText().eq(2).should('have.id', 'email');

      currentPage.govukButton().should('have.text', 'Save and continue');
    });

    it('should displayed the user created success page', () => {
      currentPage.completeAndSubmitForm({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
      });

      currentPage
        .govukConfirmationPanelTitle()
        .should('contain.text', 'User created');
    });
  });
});
