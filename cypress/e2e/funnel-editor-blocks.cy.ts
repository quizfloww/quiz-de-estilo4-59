describe("FunnelEditor - Adição de Blocos", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
  });

  it("deve adicionar bloco de Heading ao canvas", () => {
    cy.addBlockToCanvas("heading");
    cy.get('[data-testid="block-heading"]').should("be.visible");
    cy.get('[data-testid="blocks-tree"]').should("contain", "Heading");
  });

  it("deve adicionar bloco de Parágrafo ao canvas", () => {
    cy.addBlockToCanvas("paragraph");
    cy.get('[data-testid="block-paragraph"]').should("be.visible");
  });

  it("deve adicionar bloco de Botão ao canvas", () => {
    cy.addBlockToCanvas("button");
    cy.get('[data-testid="block-button"]').should("be.visible");
  });

  it("deve adicionar bloco de Formulário ao canvas", () => {
    cy.addBlockToCanvas("form");
    cy.get('[data-testid="block-form"]').should("be.visible");
  });

  it("deve adicionar múltiplos blocos em sequência", () => {
    cy.addBlockToCanvas("heading");
    cy.addBlockToCanvas("paragraph");
    cy.addBlockToCanvas("button");

    cy.get('[data-testid="block-heading"]').should("be.visible");
    cy.get('[data-testid="block-paragraph"]').should("be.visible");
    cy.get('[data-testid="block-button"]').should("be.visible");
  });

  it("deve manter ordem dos blocos adicionados", () => {
    cy.addBlockToCanvas("heading");
    cy.addBlockToCanvas("paragraph");
    cy.addBlockToCanvas("button");

    cy.get('[data-testid="panel-canvas"] [data-testid^="block-"]').then(
      (blocks) => {
        expect(blocks.length).to.equal(3);
        expect(blocks[0]).to.have.attr("data-testid", "block-heading");
        expect(blocks[1]).to.have.attr("data-testid", "block-paragraph");
        expect(blocks[2]).to.have.attr("data-testid", "block-button");
      }
    );
  });

  it("deve refletir blocos adicionados na árvore", () => {
    cy.addBlockToCanvas("heading");
    cy.addBlockToCanvas("paragraph");

    cy.get('[data-testid="blocks-tree"]').within(() => {
      cy.get('[data-testid*="tree-item"]').should("have.length", 2);
    });
  });
});

describe("FunnelEditor - Edição de Blocos", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
    cy.addBlockToCanvas("heading");
  });

  it("deve selecionar um bloco ao clicar", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-heading"]').should("have.class", "selected");
  });

  it("deve exibir propriedades do bloco selecionado", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="panel-properties"]').should("contain", "Heading");
    cy.get('[data-testid="property-text"]').should("be.visible");
  });

  it("deve editar texto de um bloco", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-text"]').clear().type("Novo Título");
    cy.get('[data-testid="block-heading"]').should("contain", "Novo Título");
  });

  it("deve editar estilo do bloco", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-fontSize"]').clear().type("32");
    cy.get('[data-testid="block-heading"]').should(
      "have.css",
      "font-size",
      "32px"
    );
  });

  it("deve editar cor do texto", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-color"]').click();
    cy.get('[data-testid="color-picker"]').should("be.visible");
  });

  it("deve editar alinhamento do bloco", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-align-center"]').click();
    cy.get('[data-testid="block-heading"]').should(
      "have.css",
      "text-align",
      "center"
    );
  });

  it("deve desfazer mudanças", () => {
    const originalContent = "Heading";

    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-text"]').clear().type("Novo Texto");
    cy.get('[data-testid="undo-button"]').click();

    cy.get('[data-testid="block-heading"]').should("contain", originalContent);
  });

  it("deve refazer mudanças", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-text"]').clear().type("Novo Texto");
    cy.get('[data-testid="undo-button"]').click();
    cy.get('[data-testid="redo-button"]').click();

    cy.get('[data-testid="block-heading"]').should("contain", "Novo Texto");
  });
});

describe("FunnelEditor - Movimentação de Blocos", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
    cy.addBlockToCanvas("heading");
    cy.addBlockToCanvas("paragraph");
    cy.addBlockToCanvas("button");
  });

  it("deve arrastar bloco para cima", () => {
    // Verifica ordem inicial
    cy.get('[data-testid="panel-canvas"] [data-testid^="block-"]')
      .eq(0)
      .should("have.attr", "data-testid", "block-heading");

    // Arrasta paragraph para cima
    cy.get('[data-testid="block-paragraph"]')
      .trigger("dragstart")
      .trigger("drop", { dataTransfer: { dropEffect: "move" } });

    // Verifica nova ordem
    cy.get('[data-testid="panel-canvas"] [data-testid^="block-"]')
      .eq(0)
      .should("have.attr", "data-testid", "block-paragraph");
  });

  it("deve arrastar bloco para posição específica", () => {
    const canvasCenter = { x: 400, y: 300 };

    cy.dragBlockToPosition(
      "heading",
      canvasCenter.x + 100,
      canvasCenter.y + 100
    );

    cy.get('[data-testid="block-heading"]').should("have.css", "transform");
  });

  it("deve mover bloco de cima para baixo na árvore", () => {
    cy.get('[data-testid="tree-item-heading"]').should("be.visible");

    // Clica em mover para baixo
    cy.get('[data-testid="tree-item-heading-move-down"]').click();

    // Verifica que o heading agora é o segundo item
    cy.get('[data-testid="panel-canvas"] [data-testid^="block-"]')
      .eq(1)
      .should("have.attr", "data-testid", "block-heading");
  });

  it("deve mover bloco de baixo para cima na árvore", () => {
    // Clica em mover para cima no último item (button)
    cy.get('[data-testid="tree-item-button-move-up"]').click();

    // Verifica que o button é o penúltimo item agora
    cy.get('[data-testid="panel-canvas"] [data-testid^="block-"]')
      .eq(1)
      .should("have.attr", "data-testid", "block-button");
  });

  it("deve receber feedback visual ao arrastar blocos", () => {
    cy.get('[data-testid="block-paragraph"]')
      .trigger("dragstart")
      .should("have.class", "dragging");
  });
});

describe("FunnelEditor - Remoção de Blocos", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
    cy.addBlockToCanvas("heading");
    cy.addBlockToCanvas("paragraph");
  });

  it("deve remover bloco ao clicar em delete", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-delete-button"]').click();
    cy.get('[data-testid="block-heading"]').should("not.exist");
  });

  it("deve remover bloco via tecla Delete", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.focused().type("{delete}");
    cy.get('[data-testid="block-heading"]').should("not.exist");
  });

  it("deve remover bloco da árvore quando deletado", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-delete-button"]').click();
    cy.get('[data-testid="tree-item-heading"]').should("not.exist");
  });

  it("deve atualizar contagem de blocos após remover", () => {
    cy.get('[data-testid="blocks-count"]').should("contain", "2");

    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-delete-button"]').click();

    cy.get('[data-testid="blocks-count"]').should("contain", "1");
  });

  it("deve permitir refazer após remover um bloco", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-delete-button"]').click();
    cy.get('[data-testid="block-heading"]').should("not.exist");

    cy.get('[data-testid="redo-button"]').click();
    cy.get('[data-testid="block-heading"]').should("be.visible");
  });
});

describe("FunnelEditor - Duplicação de Blocos", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
    cy.addBlockToCanvas("heading");
  });

  it("deve duplicar um bloco", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-duplicate-button"]').click();

    cy.get('[data-testid="block-heading"]').should("have.length", 2);
  });

  it("deve duplicar bloco mantendo as propriedades", () => {
    // Edita o bloco original
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="property-text"]').clear().type("Titulo Customizado");

    // Duplica
    cy.get('[data-testid="block-duplicate-button"]').click();

    // Verifica que a cópia tem o mesmo texto
    cy.get('[data-testid="block-heading"]')
      .last()
      .should("contain", "Titulo Customizado");
  });

  it("deve adicionar cópia logo abaixo do original", () => {
    cy.addBlockToCanvas("paragraph");
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-duplicate-button"]').click();

    // Verifica ordem: heading, heading-cópia, paragraph
    cy.get('[data-testid="panel-canvas"] [data-testid^="block-"]').then(
      (blocks) => {
        expect(blocks[0]).to.have.attr("data-testid", "block-heading");
        expect(blocks[1]).to.have.attr("data-testid", "block-heading");
        expect(blocks[2]).to.have.attr("data-testid", "block-paragraph");
      }
    );
  });
});

describe("FunnelEditor - Seleção Múltipla", () => {
  beforeEach(() => {
    cy.navigateToFunnelEditor("1");
    cy.addBlockToCanvas("heading");
    cy.addBlockToCanvas("paragraph");
    cy.addBlockToCanvas("button");
  });

  it("deve selecionar múltiplos blocos com Ctrl+Click", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-paragraph"]').click({ ctrlKey: true });
    cy.get('[data-testid="block-button"]').click({ ctrlKey: true });

    cy.get(".selected").should("have.length", 3);
  });

  it("deve exibir propriedades comuns de múltipla seleção", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-paragraph"]').click({ ctrlKey: true });

    cy.get('[data-testid="panel-properties"]').should(
      "contain",
      "Múltipla seleção"
    );
  });

  it("deve deletar múltiplos blocos selecionados", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="block-paragraph"]').click({ ctrlKey: true });

    cy.focused().type("{delete}");

    cy.get('[data-testid="block-heading"]').should("not.exist");
    cy.get('[data-testid="block-paragraph"]').should("not.exist");
    cy.get('[data-testid="block-button"]').should("be.visible");
  });

  it("deve resetar seleção ao clicar no canvas vazio", () => {
    cy.get('[data-testid="block-heading"]').click();
    cy.get('[data-testid="panel-canvas"]').click({ force: true });

    cy.get(".selected").should("have.length", 0);
  });
});
