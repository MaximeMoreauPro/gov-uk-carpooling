before(() => {
  cy.task('resetDatabase');
});

after(() => {
  cy.task('resetDatabase');
});
