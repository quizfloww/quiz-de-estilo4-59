# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - heading "Admin Login" [level=3] [ref=e9]
      - paragraph [ref=e10]: Acesso restrito ao painel administrativo
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - text: Email
          - textbox "Email" [ref=e14]:
            - /placeholder: admin@exemplo.com
        - generic [ref=e15]:
          - text: Senha
          - textbox "Senha" [ref=e16]:
            - /placeholder: ••••••••
        - button "Entrar" [disabled]
      - paragraph [ref=e18]: Apenas administradores autorizados
  - region "Notifications (F8)":
    - list
```