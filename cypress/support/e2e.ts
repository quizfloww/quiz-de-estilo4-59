import "@testing-library/cypress/add-commands";

// Adiciona commands customizados
import "./commands";

beforeEach(() => {
  // Limpa indexedDB e localStorage antes de cada teste
  indexedDB.databases().then((dbs) => {
    dbs.forEach((db) => {
      indexedDB.deleteDatabase(db.name);
    });
  });
  cy.clearLocalStorage();
  cy.clearCookies();
});

afterEach(() => {
  // Log de qualquer erro não capturado
  cy.on("uncaught:exception", (err, runnable) => {
    // Ignora erros de terceiros que não afetam os testes
    if (err.message.includes("ResizeObserver loop limit exceeded")) {
      return false;
    }
  });
});
