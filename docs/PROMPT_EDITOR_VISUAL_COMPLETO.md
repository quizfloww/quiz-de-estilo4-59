# 🎨 PROMPT PARA DESENVOLVER EDITOR VISUAL AO VIVO
## Quiz Sell Genius - Editor Visual Completo

### 📋 CONTEXTO DO PROJETO

Desenvolver um **Editor Visual Ao Vivo** para o projeto **Quiz Sell Genius** que permita editar em tempo real:
- 📝 **Quiz atual** (perguntas, respostas, layout)
- 🎯 **Página de resultado** (conteúdo, design, ofertas)
- 💰 **Página de oferta/venda** (copy, imagens, preços)

**Mantendo EXATAMENTE o layout e design atual** sem quebrar a estrutura existente.

---

## 🎯 OBJETIVO PRINCIPAL

Criar um sistema de editor visual que permita:

1. **Edição ao vivo** com preview em tempo real
2. **Interface drag-and-drop** intuitiva
3. **Preservação total** do design e layout existente
4. **Salvamento automático** e manual das alterações
5. **Integração completa** com o sistema admin atual

---

## 🏗️ ESTRUTURA ATUAL DO PROJETO

### 📁 Arquivos Principais Identificados:
```
/src/pages/admin/EditorPage.tsx                    # ✅ Página principal do editor
/src/components/visual-editor/
├── QuizOfferPageVisualEditor.tsx                  # ✅ Editor visual principal
├── QuizOfferPageEditable.tsx                      # ✅ Componente editável
/src/components/pages/
├── PreviewQuizOfferPage.tsx                       # 📄 Página de oferta atual
/src/pages/
├── QuizOfferPage.tsx                              # 📄 Página principal de oferta
├── ResultPage.tsx                                 # 📄 Página de resultado
/src/components/QuizPage.tsx                       # 📊 Componente do quiz atual
/src/styles/preview-quiz-offer.css                 # 🎨 Estilos específicos
```

### 🎨 Design System Atual:
```css
:root {
  --primary: #B89B7A;          /* Cor principal */
  --secondary: #432818;        /* Cor secundária */
  --accent: #aa6b5d;          /* Cor de destaque */
  --background: #FFFBF7;      /* Fundo principal */
  --text-dark: #432818;       /* Texto escuro */
  --text-medium: #6B4F43;     /* Texto médio */
}
```

### 🧩 Componentes Existentes:
- ✅ `EditorPage` - Interface principal do editor
- ✅ `QuizOfferPageVisualEditor` - Editor visual avançado
- ✅ `QuizOfferPageEditable` - Componente editável
- ✅ `AdminRoute` - Proteção de rotas admin
- ✅ `AdminLogin` - Sistema de autenticação
- ✅ Sistema de admin dashboard funcional

---

## 🚀 ESPECIFICAÇÕES TÉCNICAS

### 1. **EDITOR VISUAL PRINCIPAL**

**Funcionalidades Core:**
```typescript
interface VisualEditor {
  // Seções editáveis
  sections: {
    hero: EditableSection;
    problem: EditableSection;
    solution: EditableSection;
    benefits: EditableSection;
    bonuses: EditableSection;
    testimonials: EditableSection;
    pricing: EditableSection;
    faq: EditableSection;
  };
  
  // Controles de edição
  controls: {
    textEditor: RichTextEditor;
    imageUploader: ImageManager;
    colorPicker: ColorManager;
    layoutManager: LayoutControls;
    styleEditor: CSSEditor;
  };
  
  // Sistema de preview
  preview: {
    mode: 'edit' | 'preview';
    responsive: 'desktop' | 'tablet' | 'mobile';
    realTime: boolean;
  };
}
```

### 2. **INTERFACE DE EDIÇÃO**

**Layout sugerido:**
```
┌─────────────────────────────────────────────────┐
│ 🎯 Barra de Ferramentas                         │
│ [Salvar] [Preview] [Responsivo] [Desfazer]      │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│ 📝 Painel   │        📱 Preview Ao Vivo         │
│    de       │                                   │
│ Edição      │     [Conteúdo da página]          │
│             │                                   │
│ • Textos    │                                   │
│ • Imagens   │                                   │
│ • Cores     │                                   │
│ • Layout    │                                   │
│ • Seções    │                                   │
│             │                                   │
└─────────────┴───────────────────────────────────┘
```

### 3. **SISTEMA DE EDIÇÃO POR SEÇÕES**

**Seções editáveis identificadas:**

1. **📝 HERO SECTION**
   - Título principal
   - Subtítulo
   - CTA button text
   - Imagem hero
   - Badge de credibilidade

2. **⚠️ SEÇÃO PROBLEMA**
   - Título da seção
   - Lista de problemas
   - Descrição expandida
   - Imagem ilustrativa

3. **💡 SEÇÃO SOLUÇÃO**
   - Título da solução
   - Descrição do quiz
   - Preview do quiz
   - CTA principal

4. **🎁 SEÇÃO BENEFÍCIOS**
   - Lista de benefícios
   - Descrições detalhadas
   - Ícones dos benefícios
   - Imagens de apoio

5. **🎯 SEÇÃO BÔNUS**
   - Bônus 1: Peças-chave
   - Bônus 2: Visagismo
   - Descrições e imagens
   - Valores agregados

6. **💰 SEÇÃO PREÇOS**
   - Valor principal
   - Valor promocional
   - Lista do que está incluso
   - CTAs de compra

7. **💬 DEPOIMENTOS**
   - Fotos de clientes
   - Textos dos depoimentos
   - Resultados mostrados
   - Social proof

8. **❓ FAQ**
   - Perguntas e respostas
   - Accordion funcional
   - CTA final

### 4. **CONTROLES DE EDIÇÃO ESPECÍFICOS**

**Para cada seção:**

```typescript
interface SectionEditor {
  // Editor de texto
  textControls: {
    richText: boolean;
    fontSize: number;
    fontWeight: string;
    color: string;
    alignment: 'left' | 'center' | 'right';
  };
  
  // Gerenciador de imagens
  imageControls: {
    upload: (file: File) => string;
    resize: { width: number; height: number };
    position: string;
    alt: string;
  };
  
  // Controles de layout
  layoutControls: {
    spacing: { top: number; bottom: number };
    padding: { x: number; y: number };
    background: { color: string; image?: string };
    border: { width: number; color: string; radius: number };
  };
  
  // Visibilidade
  visibility: {
    show: boolean;
    responsive: {
      desktop: boolean;
      tablet: boolean;
      mobile: boolean;
    };
  };
}
```

### 5. **SISTEMA DE SALVAMENTO**

```typescript
interface SaveSystem {
  autoSave: {
    interval: number; // 30 segundos
    enabled: boolean;
  };
  
  manualSave: {
    button: () => void;
    shortcut: 'Ctrl+S';
  };
  
  history: {
    undo: () => void;
    redo: () => void;
    maxSteps: number; // 50 passos
  };
  
  export: {
    json: () => string;
    html: () => string;
    backup: () => void;
  };
}
```

---

## 🎨 ESPECIFICAÇÕES DE DESIGN

### **Paleta de Cores (manter exata)**
```css
/* Cores principais - NÃO ALTERAR */
--primary: #B89B7A;
--secondary: #432818;
--accent: #aa6b5d;
--background: #FFFBF7;
--white: #ffffff;
--text-dark: #432818;
--text-medium: #6B4F43;
```

### **Tipografia (manter exata)**
```css
/* Fontes - NÃO ALTERAR */
font-family: 'Inter', sans-serif;          /* Texto geral */
font-family: 'Playfair Display', serif;    /* Títulos */
```

### **Componentes Visuais (preservar)**
- ✅ Botões 3D com gradiente
- ✅ Cards com sombra e hover
- ✅ Animações de entrada
- ✅ Layout responsivo
- ✅ Efeitos de imagem
- ✅ Gradientes de fundo

---

## 🛠️ IMPLEMENTAÇÃO TÉCNICA

### **1. Tecnologias a usar:**
- ⚛️ **React 18** + TypeScript
- 🎨 **Tailwind CSS** (já configurado)
- 🧩 **shadcn/ui** (componentes existentes)
- 💾 **Local Storage** para salvamento
- 🔄 **React Suspense** para lazy loading

### **2. Estrutura de arquivos sugerida:**
```
/src/components/visual-editor/
├── VisualEditor.tsx                    # 🎯 Componente principal
├── EditorToolbar.tsx                   # 🔧 Barra de ferramentas
├── SectionEditor.tsx                   # 📝 Editor de seções
├── PreviewPanel.tsx                    # 👁️ Painel de preview
├── PropertyPanel.tsx                   # ⚙️ Painel de propriedades
├── editors/
│   ├── TextEditor.tsx                  # 📝 Editor de texto
│   ├── ImageEditor.tsx                 # 🖼️ Editor de imagem
│   ├── ColorEditor.tsx                 # 🎨 Editor de cores
│   └── LayoutEditor.tsx                # 📐 Editor de layout
├── sections/
│   ├── HeroEditor.tsx                  # 🦸 Editor hero
│   ├── ProblemEditor.tsx               # ⚠️ Editor problema
│   ├── SolutionEditor.tsx              # 💡 Editor solução
│   ├── BenefitsEditor.tsx              # 🎁 Editor benefícios
│   ├── PricingEditor.tsx               # 💰 Editor preços
│   └── TestimonialsEditor.tsx          # 💬 Editor depoimentos
└── utils/
    ├── editorUtils.ts                  # 🛠️ Utilitários
    ├── saveSystem.ts                   # 💾 Sistema de salvamento
    └── previewGenerator.ts             # 👁️ Gerador de preview
```

### **3. Interface do Editor Principal:**
```tsx
interface VisualEditorProps {
  initialData: PageData;
  onSave: (data: PageData) => void;
  mode: 'quiz' | 'result' | 'offer';
}

interface PageData {
  sections: Section[];
  globalStyles: GlobalStyles;
  metadata: PageMetadata;
}

interface Section {
  id: string;
  type: SectionType;
  content: SectionContent;
  styles: SectionStyles;
  visible: boolean;
  order: number;
}
```

---

## 🎯 FUNCIONALIDADES ESPECÍFICAS

### **A. EDITOR DE QUIZ**
- ✏️ Editar perguntas e respostas
- 🎨 Customizar cores e fontes
- 📱 Preview responsivo
- 🔄 Reordenar perguntas
- ➕ Adicionar/remover opções
- 🖼️ Upload de imagens para opções

### **B. EDITOR DE PÁGINA DE RESULTADO**
- 📊 Customizar layout de resultados
- 🎨 Editar textos e descrições
- 🖼️ Gerenciar imagens de resultado
- 🔗 Configurar CTAs para oferta
- 📈 Ajustar elementos de conversão

### **C. EDITOR DE PÁGINA DE OFERTA**
- 💰 Editar preços e ofertas
- 📝 Customizar copy de vendas
- 🎁 Gerenciar seção de bônus
- 💬 Editar depoimentos
- ❓ Configurar FAQ
- 🔥 Ajustar elementos de urgência

---

## 🎮 EXPERIÊNCIA DO USUÁRIO

### **Interface Intuitiva:**
1. **🎯 Click para editar** - Clique direto no elemento para editar
2. **🖱️ Drag and drop** - Arraste seções para reordenar
3. **⚡ Preview instantâneo** - Veja mudanças em tempo real
4. **📱 Modo responsivo** - Teste em diferentes tamanhos
5. **💾 Salvamento automático** - Nunca perca o trabalho

### **Controles Visuais:**
- 🎨 **Color picker** integrado
- 📏 **Sliders** para espaçamentos
- 🔤 **Typography controls** fáceis
- 🖼️ **Image manager** com crop
- 📐 **Layout grid** visual

---

## 🚦 REQUISITOS OBRIGATÓRIOS

### **❌ NÃO PODE:**
- Quebrar o design atual
- Alterar URLs existentes
- Remover funcionalidades
- Modificar sistema de pagamento
- Afetar SEO/Performance

### **✅ DEVE:**
- Manter layout responsivo
- Preservar animações CSS
- Manter sistema de cores
- Funcionar em todos navegadores
- Ser intuitivo para não-técnicos

### **🔧 INTEGRAÇÃO:**
- Usar componentes shadcn/ui existentes
- Integrar com sistema admin atual
- Manter autenticação funcionando
- Salvar no localStorage
- Funcionar offline

---

## 📋 CHECKLIST DE DESENVOLVIMENTO

### **Fase 1: Estrutura Base**
- [ ] Criar componente VisualEditor principal
- [ ] Implementar sistema de seções
- [ ] Configurar preview ao vivo
- [ ] Integrar com EditorPage existente

### **Fase 2: Editores Específicos**
- [ ] Editor de texto rico
- [ ] Gerenciador de imagens
- [ ] Seletor de cores
- [ ] Controles de layout

### **Fase 3: Seções Específicas**
- [ ] Editor Hero section
- [ ] Editor seção problema
- [ ] Editor seção solução
- [ ] Editor seção benefícios
- [ ] Editor seção preços
- [ ] Editor FAQ

### **Fase 4: Sistema de Salvamento**
- [ ] Salvamento automático
- [ ] Sistema de undo/redo
- [ ] Export/import dados
- [ ] Backup automático

### **Fase 5: UI/UX**
- [ ] Interface intuitiva
- [ ] Responsividade
- [ ] Feedback visual
- [ ] Loading states

### **Fase 6: Testes**
- [ ] Teste em dispositivos
- [ ] Teste de performance
- [ ] Teste de salvamento
- [ ] Teste de integração

---

## 🎯 RESULTADO ESPERADO

Um **Editor Visual Completo** que permita:

1. **📝 Editar qualquer texto** da página clicando nele
2. **🖼️ Trocar qualquer imagem** facilmente
3. **🎨 Mudar cores e estilos** visualmente
4. **📱 Ver resultado ao vivo** em tempo real
5. **💾 Salvar alterações** automaticamente
6. **🔄 Desfazer mudanças** quando necessário
7. **📱 Funcionar responsivamente** em todos dispositivos

**Tudo isso mantendo EXATAMENTE o design e layout atual!**

---

## 💡 EXEMPLO DE USO

```typescript
// Exemplo de como o editor funcionará
const editorData = {
  hero: {
    title: "Descubra Seu Estilo Predominante",
    subtitle: "em 5 Minutos", 
    ctaText: "Descobrir Meu Estilo Agora",
    image: "/hero-image.jpg",
    backgroundColor: "#FFFBF7"
  },
  pricing: {
    mainPrice: "39,90",
    originalPrice: "197,00",
    currency: "R$",
    ctaText: "Comprar Agora"
  }
  // ... outras seções
};

// O editor permitirá modificar todos estes valores
// através de uma interface visual intuitiva
```

---

## 🚀 PRONTO PARA IMPLEMENTAR!

Este prompt contém todas as especificações necessárias para desenvolver um editor visual completo que mantém o design atual e adiciona funcionalidade de edição ao vivo.

**Foque em criar uma experiência intuitiva onde o usuário pode clicar em qualquer elemento e editá-lo diretamente!**
