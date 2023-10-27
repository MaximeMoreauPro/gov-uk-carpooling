import Page from '../pages/page';

import { CreateUserCommand } from '../../src/application/use-cases/CreateUser.use-case';

export default class IndexPage extends Page {
  constructor() {
    super('Carpooling');
  }

  clearForm(): void {
    cy.get('#localJusticeArea').clear();
    cy.get('#dateOfHearing-day').clear();
    cy.get('#dateOfHearing-month').clear();
    cy.get('#dateOfHearing-year').clear();
  }

  completeAndSubmitForm(user: CreateUserCommand): void {
    this.inputText().eq(0).type(user.firstName);
    this.inputText().eq(1).type(user.lastName);
    this.inputText().eq(2).type(user.email);

    this.govukButton().click();
  }
}
