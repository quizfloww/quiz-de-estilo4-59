describe("FunnelEditor - Publicação", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve abrir modal de publicação", () => {
    cy.get('[data-testid="publish-button"]').click();
    cy.get('[data-testid="publish-modal"]').should("be.visible");
  });

  it("deve exibir informações sobre a publicação", () => {
    cy.get('[data-testid="publish-button"]').click();
    cy.get('[data-testid="publish-modal"]').within(() => {
      cy.get('[data-testid="publish-title"]').should("contain", "Publicar");
      cy.get('[data-testid="publish-description"]').should("be.visible");
    });
  });

  it("deve validar antes de publicar", () => {
    // Adiciona um bloco incompleto
    cy.addBlockToCanvas("button");
    cy.get('[data-testid="block-button"]').click();
    cy.get('[data-testid="property-text"]').clear(); // Remove texto obrigatório

    cy.get('[data-testid="publish-button"]').click();
    cy.get('[data-testid="publish-error"]').should(
      "contain",
      "Preenchimento obrigatório"
    );
  });

  it("deve publicar funnel com sucesso", () => {
    cy.intercept("POST", "/api/funnels/*/publish", {
      statusCode: 200,
      body: { success: true, publishedAt: new Date().toISOString() },
    }).as("publishFunnel");

    cy.addBlockToCanvas("heading");
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-text"]').clear().type("Meu Título");

    cy.publishFunnel();
    cy.wait("@publishFunnel");

    cy.get('[data-testid="publish-success-message"]').should("be.visible");
    cy.get('[data-testid="publish-success-message"]').should(
      "contain",
      "Publicado com sucesso"
    );
  });

  it("deve exibir URL publicada após publicação", () => {
    cy.intercept("POST", "/api/funnels/*/publish", {
      statusCode: 200,
      body: {
        success: true,
        url: "https://quiz.com/funnel/abc123",
        publishedAt: new Date().toISOString(),
      },
    }).as("publishFunnel");

    cy.publishFunnel();
    cy.wait("@publishFunnel");

    cy.get('[data-testid="published-url"]').should(
      "contain",
      "https://quiz.com/funnel/abc123"
    );
  });

  it("deve permitir copiar URL publicada", () => {
    cy.intercept("POST", "/api/funnels/*/publish", {
      statusCode: 200,
      body: { success: true, url: "https://quiz.com/funnel/abc123" },
    }).as("publishFunnel");

    cy.publishFunnel();
    cy.wait("@publishFunnel");

    cy.get('[data-testid="copy-url-button"]').click();
    cy.get('[data-testid="url-copied-notification"]').should("be.visible");
  });

  it("deve exibir data/hora de publicação", () => {
    cy.intercept("POST", "/api/funnels/*/publish", {
      statusCode: 200,
      body: {
        success: true,
        url: "https://quiz.com/funnel/abc123",
        publishedAt: "2025-12-05T10:30:00Z",
      },
    }).as("publishFunnel");

    cy.publishFunnel();
    cy.wait("@publishFunnel");

    cy.get('[data-testid="published-time"]').should("contain", "05/12/2025");
  });

  it("deve permitir cancelar publicação", () => {
    cy.get('[data-testid="publish-button"]').click();
    cy.get('[data-testid="publish-cancel-button"]').click();
    cy.get('[data-testid="publish-modal"]').should("not.be.visible");
  });

  it("deve exibir versão da publicação", () => {
    cy.intercept("GET", "/api/funnels/1", {
      statusCode: 200,
      body: {
        id: 1,
        name: "Funnel Test",
        version: 3,
        lastPublishedAt: new Date().toISOString(),
      },
    }).as("getFunnel");

    cy.navigateToFunnelEditor("1");
    cy.wait("@getFunnel");

    cy.get('[data-testid="funnel-version"]').should("contain", "v3");
  });
});

describe("FunnelEditor - Modo de Teste", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve abrir modal de teste", () => {
    cy.get('[data-testid="test-mode-button"]').click();
    cy.get('[data-testid="test-mode-modal"]').should("be.visible");
  });

  it("deve exibir link de teste válido", () => {
    cy.intercept("POST", "/api/funnels/*/test-link", {
      statusCode: 200,
      body: { testUrl: "http://localhost:5173/preview/funnel/test/xyz789" },
    }).as("generateTestLink");

    cy.get('[data-testid="test-mode-button"]').click();
    cy.wait("@generateTestLink");

    cy.get('[data-testid="test-link"]').should(
      "have.value",
      "http://localhost:5173/preview/funnel/test/xyz789"
    );
  });

  it("deve permitir copiar link de teste", () => {
    cy.intercept("POST", "/api/funnels/*/test-link", {
      statusCode: 200,
      body: { testUrl: "http://localhost:5173/preview/funnel/test/xyz789" },
    }).as("generateTestLink");

    cy.get('[data-testid="test-mode-button"]').click();
    cy.wait("@generateTestLink");

    cy.get('[data-testid="copy-test-link-button"]').click();
    cy.get('[data-testid="link-copied-notification"]').should("be.visible");
  });

  it("deve abrir pré-visualização do funnel", () => {
    cy.get('[data-testid="test-mode-button"]').click();
    cy.get('[data-testid="test-mode-modal"]').should("be.visible");

    cy.get('[data-testid="preview-button"]').click();

    // Verifica que abre em nova aba/preview
    cy.get('[data-testid="preview-iframe"]').should("exist");
  });

  it("deve exibir QR code para teste", () => {
    cy.intercept("POST", "/api/funnels/*/test-link", {
      statusCode: 200,
      body: {
        testUrl: "http://localhost:5173/preview/funnel/test/xyz789",
        qrCode: "data:image/png;base64,iVBORw0KGgo...",
      },
    }).as("generateTestLink");

    cy.get('[data-testid="test-mode-button"]').click();
    cy.wait("@generateTestLink");

    cy.get('[data-testid="qr-code"]').should("be.visible");
  });

  it("deve expirar link de teste após 24h", () => {
    cy.intercept("POST", "/api/funnels/*/test-link", {
      statusCode: 200,
      body: {
        testUrl: "http://localhost:5173/preview/funnel/test/xyz789",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    }).as("generateTestLink");

    cy.get('[data-testid="test-mode-button"]').click();
    cy.wait("@generateTestLink");

    cy.get('[data-testid="test-link-expiry"]').should("contain", "Expira em");
  });

  it("deve regenerar link de teste", () => {
    cy.intercept("POST", "/api/funnels/*/test-link", {
      statusCode: 200,
      body: { testUrl: "http://localhost:5173/preview/funnel/test/xyz789" },
    }).as("generateTestLink1");

    cy.get('[data-testid="test-mode-button"]').click();
    cy.wait("@generateTestLink1");

    cy.intercept("POST", "/api/funnels/*/test-link", {
      statusCode: 200,
      body: { testUrl: "http://localhost:5173/preview/funnel/test/abc456" },
    }).as("generateTestLink2");

    cy.get('[data-testid="regenerate-test-link-button"]').click();
    cy.wait("@generateTestLink2");

    cy.get('[data-testid="test-link"]').should(
      "have.value",
      "http://localhost:5173/preview/funnel/test/abc456"
    );
  });

  it("deve exibir instruções de teste", () => {
    cy.get('[data-testid="test-mode-button"]').click();
    cy.get('[data-testid="test-instructions"]').should("be.visible");
    cy.get('[data-testid="test-instructions"]').should("contain", "link");
  });
});

describe("FunnelEditor - Validação na Publicação", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve validar campos obrigatórios", () => {
    cy.addBlockToCanvas("form");
    cy.get('[data-testid="block-form"]').click();

    // Tenta publicar sem preencher campos obrigatórios
    cy.publishFunnel();

    cy.get('[data-testid="validation-error"]').should("be.visible");
  });

  it("deve validar tamanho de imagens", () => {
    cy.addBlockToCanvas("image");

    // Simula adição de imagem grande via propriedade
    cy.get('[data-testid="block-image"]').click();
    cy.get('[data-testid="property-image-url"]').type(
      "https://example.com/large-image.jpg"
    );

    cy.publishFunnel();
    cy.get('[data-testid="image-size-warning"]').should("be.visible");
  });

  it("deve validar URLs dos blocos", () => {
    cy.addBlockToCanvas("button");
    cy.get('[data-testid="block-button"]').click();
    cy.get('[data-testid="property-link"]').type("url-invalida");

    cy.publishFunnel();
    cy.get('[data-testid="invalid-url-error"]').should("be.visible");
  });

  it("deve alertar sobre blocos vazios", () => {
    cy.addBlockToCanvas("heading");
    cy.addBlockToCanvas("paragraph");

    cy.publishFunnel();
    cy.get('[data-testid="empty-blocks-warning"]').should("be.visible");
  });

  it("deve exibir relatório completo de validação", () => {
    cy.addBlockToCanvas("form");
    cy.publishFunnel();

    cy.get('[data-testid="validation-report"]').should("be.visible");
    cy.get('[data-testid="validation-report"]').should("contain", "erro");
    cy.get('[data-testid="validation-report"]').should("contain", "aviso");
  });
});

describe("FunnelEditor - Histórico de Publicação", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve exibir histórico de publicações", () => {
    cy.intercept("GET", "/api/funnels/1/publish-history", {
      statusCode: 200,
      body: [
        { version: 3, publishedAt: "2025-12-05T10:30:00Z", url: "https://..." },
        { version: 2, publishedAt: "2025-12-04T15:20:00Z", url: "https://..." },
        { version: 1, publishedAt: "2025-12-03T09:15:00Z", url: "https://..." },
      ],
    }).as("getPublishHistory");

    cy.get('[data-testid="publish-history-button"]').click();
    cy.wait("@getPublishHistory");

    cy.get('[data-testid="publish-history"]').should("be.visible");
    cy.get('[data-testid="publish-history-item"]').should("have.length", 3);
  });

  it("deve permitir voltar a versão publicada anterior", () => {
    cy.get('[data-testid="publish-history-button"]').click();
    cy.get('[data-testid="publish-history-item"]')
      .eq(1)
      .within(() => {
        cy.get('[data-testid="revert-button"]').click();
      });

    cy.get('[data-testid="revert-confirm-modal"]').should("be.visible");
    cy.get('[data-testid="revert-confirm-button"]').click();

    cy.get('[data-testid="success-notification"]').should(
      "contain",
      "Versão restaurada"
    );
  });
});
