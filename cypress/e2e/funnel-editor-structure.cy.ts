describe("FunnelEditor - Estrutura Básica", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve carregar o editor com todos os painéis visíveis", () => {
    // Verifica container principal
    cy.get('[data-testid="funnel-editor-container"]').should("be.visible");

    // Verifica painéis principais
    cy.get('[data-testid="panel-tree"]').should("be.visible"); // Painel de árvore
    cy.get('[data-testid="panel-canvas"]').should("be.visible"); // Canvas principal
    cy.get('[data-testid="panel-properties"]').should("be.visible"); // Propriedades
    cy.get('[data-testid="panel-preview"]').should("be.visible"); // Pré-visualização
    cy.get('[data-testid="panel-code"]').should("be.visible"); // Código
  });

  it("deve exibir a toolbar com todos os botões principais", () => {
    cy.get('[data-testid="editor-toolbar"]').should("be.visible");

    // Botões esperados
    cy.get('[data-testid="undo-button"]').should("be.visible");
    cy.get('[data-testid="redo-button"]').should("be.visible");
    cy.get('[data-testid="test-mode-button"]').should("be.visible");
    cy.get('[data-testid="publish-button"]').should("be.visible");
  });

  it("deve exibir a lista de blocos disponíveis", () => {
    cy.get('[data-testid="blocks-list"]').should("be.visible");

    // Verifica se os tipos de blocos estão presentes
    const blockTypes = [
      "heading",
      "paragraph",
      "button",
      "input",
      "image",
      "video",
      "form",
      "countdown",
      "testimonial",
      "price-table",
      "comparison",
      "timer",
      "guarantee",
      "social-proof",
      "cta",
    ];

    blockTypes.forEach((type) => {
      cy.get(`[data-testid="block-item-${type}"]`).should("be.visible");
    });
  });

  it("deve ter o canvas vazio no carregamento inicial", () => {
    cy.get('[data-testid="panel-canvas"]').within(() => {
      cy.get('[data-testid^="block-"]').should("have.length", 0);
    });
  });

  it("deve exibir breadcrumb de navegação", () => {
    cy.get('[data-testid="breadcrumb"]').should("be.visible");
    cy.get('[data-testid="breadcrumb-item-funnels"]').should(
      "contain",
      "Funnels"
    );
    cy.get('[data-testid="breadcrumb-item-edit"]').should("contain", "Edit");
  });
});

describe("FunnelEditor - Responsividade de Painéis", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve redimensionar painel esquerdo (árvore)", () => {
    const initialWidth = 300;
    const newWidth = 400;

    cy.resizePanel("tree", "right", newWidth - initialWidth);

    cy.get('[data-testid="panel-tree"]')
      .should("have.css", "width")
      .and("include", newWidth.toString());
  });

  it("deve redimensionar painel direito (propriedades)", () => {
    const initialWidth = 350;
    const newWidth = 500;

    cy.resizePanel("properties", "left", newWidth - initialWidth);

    cy.get('[data-testid="panel-properties"]')
      .should("have.css", "width")
      .and("include", newWidth.toString());
  });

  it("deve manter proporcionalidade ao redimensionar", () => {
    // Obtém larguras iniciais
    cy.get('[data-testid="panel-tree"]').then((el) => {
      const initialTreeWidth = el.width();

      // Redimensiona
      cy.resizePanel("tree", "right", 100);

      // Verifica que mudou
      cy.get('[data-testid="panel-tree"]').then((el) => {
        const newTreeWidth = el.width();
        expect(newTreeWidth).to.be.greaterThan(initialTreeWidth);
      });
    });
  });

  it("deve recolher painéis laterais", () => {
    // Clica no botão de recolher do painel esquerdo
    cy.get('[data-testid="collapse-tree-button"]').click();
    cy.get('[data-testid="panel-tree"]').should("have.class", "collapsed");

    // Clica no botão de recolher do painel direito
    cy.get('[data-testid="collapse-properties-button"]').click();
    cy.get('[data-testid="panel-properties"]').should(
      "have.class",
      "collapsed"
    );
  });
});

describe("FunnelEditor - Navegação Estrutural", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve ter abas de navegação entre seções", () => {
    cy.get('[data-testid="editor-tabs"]').should("be.visible");

    // Abas esperadas
    cy.get('[data-testid="tab-canvas"]').should("be.visible");
    cy.get('[data-testid="tab-preview"]').should("be.visible");
    cy.get('[data-testid="tab-code"]').should("be.visible");
  });

  it("deve alternar entre abas", () => {
    // Canvas por padrão
    cy.get('[data-testid="tab-canvas"]').should("have.class", "active");

    // Clica em Preview
    cy.get('[data-testid="tab-preview"]').click();
    cy.get('[data-testid="tab-preview"]').should("have.class", "active");
    cy.get('[data-testid="panel-preview"]').should("be.visible");

    // Clica em Code
    cy.get('[data-testid="tab-code"]').click();
    cy.get('[data-testid="tab-code"]').should("have.class", "active");
    cy.get('[data-testid="panel-code"]').should("be.visible");
  });

  it("deve exibir navegação em árvore dos blocos", () => {
    cy.get('[data-testid="blocks-tree"]').should("be.visible");
  });

  it("deve permitir expandir/recolher itens da árvore", () => {
    // Clica para expandir um item (se houver)
    cy.get('[data-testid="tree-item-expand-button"]')
      .first()
      .then((el) => {
        if (el.length > 0) {
          cy.wrap(el).click();
          cy.get('[data-testid="tree-item"]').should("be.visible");
        }
      });
  });
});

describe("FunnelEditor - Feedback Visual", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve exibir indicador de carregamento durante operações", () => {
    cy.get('[data-testid="funnel-editor-container"]').should(
      "not.have.class",
      "loading"
    );
  });

  it("deve exibir notificações de erro corretamente", () => {
    // Simula erro de rede ou validação
    cy.intercept("POST", "/api/funnels/*/update", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("updateError");

    // Tenta uma ação que causaria erro
    cy.get('[data-testid="save-button"]').click();
    cy.wait("@updateError");

    cy.get('[data-testid="error-notification"]').should("be.visible");
    cy.get('[data-testid="error-notification"]').should("contain", "erro");
  });

  it("deve exibir notificações de sucesso ao salvar", () => {
    cy.intercept("POST", "/api/funnels/*/update", {
      statusCode: 200,
      body: { success: true },
    }).as("updateSuccess");

    cy.get('[data-testid="save-button"]').click();
    cy.wait("@updateSuccess");

    cy.get('[data-testid="success-notification"]').should("be.visible");
  });

  it("deve exibir tooltips ao passar sobre elementos", () => {
    cy.get('[data-testid="help-icon"]').first().trigger("mouseover");
    cy.get('[data-testid="tooltip"]').should("be.visible");
  });

  it("deve indicar quando há alterações não salvas", () => {
    // Após fazer qualquer mudança
    cy.get('[data-testid="undo-button"]').should("not.be.disabled");

    // Deve aparecer indicador visual
    cy.get('[data-testid="unsaved-indicator"]').should("be.visible");
  });
});

describe("FunnelEditor - Atalhos de Teclado", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve executar Undo com Ctrl+Z", () => {
    cy.addBlockToCanvas("heading");

    // Verifica que o bloco foi adicionado
    cy.get('[data-testid="block-heading"]').should("exist");

    // Executa Undo
    cy.get("body").type("{ctrl}z");

    // Verifica que foi desfeito
    cy.get('[data-testid="block-heading"]').should("not.exist");
  });

  it("deve executar Redo com Ctrl+Shift+Z", () => {
    cy.addBlockToCanvas("heading");
    cy.get("body").type("{ctrl}z");

    // Executa Redo
    cy.get("body").type("{ctrl}{shift}z");

    // Verifica que foi refeito
    cy.get('[data-testid="block-heading"]').should("exist");
  });

  it("deve abrir modal de Publish com Ctrl+S", () => {
    cy.get("body").type("{ctrl}s");
    cy.get('[data-testid="publish-modal"]').should("be.visible");
  });

  it("deve abrir Preview com Ctrl+P", () => {
    cy.get("body").type("{ctrl}p");
    cy.get('[data-testid="panel-preview"]').should("be.visible");
  });
});
