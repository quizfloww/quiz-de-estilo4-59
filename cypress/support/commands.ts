/// <reference types="cypress" />

Cypress.Commands.add("loginAdmin", () => {
  cy.visit("/admin");
  // Assumindo que há um sistema de autenticação
  // Adicione lógica de login aqui se necessário
});

Cypress.Commands.add("navigateToFunnelEditor", (funnelId?: string) => {
  const id = funnelId || "1";
  cy.visit(`/admin/funnels/${id}/edit`);
  cy.get('[data-testid="funnel-editor-container"]', { timeout: 15000 }).should(
    "be.visible"
  );
});

Cypress.Commands.add("addBlockToCanvas", (blockType: string) => {
  // Clica no seletor de blocos
  cy.get('[data-testid="block-selector"]').click();

  // Seleciona o tipo de bloco
  cy.get(`[data-testid="block-type-${blockType}"]`).click();

  // Aguarda o bloco ser adicionado
  cy.get(`[data-testid="block-${blockType}"]`).should("exist");
});

Cypress.Commands.add(
  "dragBlockToPosition",
  (blockId: string, x: number, y: number) => {
    cy.get(`[data-testid="block-${blockId}"]`)
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: x, clientY: y })
      .trigger("mouseup");
  }
);

Cypress.Commands.add(
  "resizePanel",
  (
    panelId: string,
    direction: "left" | "right" | "top" | "bottom",
    pixels: number
  ) => {
    const selector = `[data-testid="resizer-${panelId}-${direction}"]`;
    cy.get(selector)
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", {
        clientX: direction === "right" ? pixels : 0,
        clientY: direction === "bottom" ? pixels : 0,
      })
      .trigger("mouseup");
  }
);

Cypress.Commands.add("openBlockSettings", (blockId: string) => {
  cy.get(`[data-testid="block-${blockId}"]`).rightclick();
  cy.get('[data-testid="block-settings-menu"]').should("be.visible");
  cy.get(
    '[data-testid="block-settings-menu"] button:contains("Configurações")'
  ).click();
});

Cypress.Commands.add("publishFunnel", () => {
  cy.get('[data-testid="publish-button"]').click();
  cy.get('[data-testid="publish-modal"]').should("be.visible");
  cy.get('[data-testid="publish-confirm-button"]').click();
  cy.get('[data-testid="publish-success-message"]', { timeout: 10000 }).should(
    "be.visible"
  );
});

Cypress.Commands.add("testMode", () => {
  cy.get('[data-testid="test-mode-button"]').click();
  cy.get('[data-testid="test-mode-modal"]').should("be.visible");
  cy.get('[data-testid="test-mode-link"]').should("have.text", /https?:\/\/.+/);
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      loginAdmin(): Chainable<void>;
      navigateToFunnelEditor(funnelId?: string): Chainable<void>;
      addBlockToCanvas(blockType: string): Chainable<void>;
      dragBlockToPosition(
        blockId: string,
        x: number,
        y: number
      ): Chainable<void>;
      resizePanel(
        panelId: string,
        direction: "left" | "right" | "top" | "bottom",
        pixels: number
      ): Chainable<void>;
      openBlockSettings(blockId: string): Chainable<void>;
      publishFunnel(): Chainable<void>;
      testMode(): Chainable<void>;
    }
  }
}

export {};
