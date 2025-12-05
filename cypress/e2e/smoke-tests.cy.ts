describe("FunnelEditor - Testes Básicos", () => {
  beforeEach(() => {
    cy.visit("/admin/funnels");
  });

  it("deve carregar a página de funnels", () => {
    cy.get("body").should("contain", "Funnel");
  });

  it("deve ter título na página", () => {
    cy.get("h1, h2, h3").first().should("be.visible");
  });

  it("deve ter elementos interativos visíveis", () => {
    cy.get("button").first().should("be.visible");
  });
});
