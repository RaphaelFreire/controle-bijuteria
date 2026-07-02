# Controle Bijuteria

Sistema de página única (HTML + CSS + JavaScript, sem dependências) para gerenciar as três planilhas do controle de bijuterias:

- **Estoque** (`Controle_Bijuteria_-_Controle.csv`) — com cálculo automático de despesas, imposto, lucro, preço de venda e valor de venda online
- **Vendas** (`Controle_Bijuteria_-_Vendas.csv`)
- **Investimentos** (`Controle_Bijuteria_-_Valores_Investidos.csv`)

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `controle-bijuteria`).
2. Envie os arquivos desta pasta (`index.html`, `README.md` e os 3 CSVs).
3. No repositório, vá em **Settings → Pages → Branch: main → / (root) → Save**.
4. Em ~1 minuto o site estará no ar em `https://SEU-USUARIO.github.io/controle-bijuteria/`.

## Como funciona no dia a dia

- **Nada fica salvo no navegador.** A página carrega os dados direto da planilha do Google ao abrir, e cada peça, venda ou investimento que você adicionar (ou excluir) é gravado na hora nas abas **Controle**, **Vendas** e **Valores Investidos** — de qualquer aparelho, sem precisar configurar nada.
- O painel no topo mostra o resumo: total investido, custo do estoque, total vendido e o saldo.
- Ao digitar o custo de uma peça nova, o preço de venda e o valor online são calculados na hora (os percentuais são configuráveis em "Percentuais de cálculo", mas não são salvos — voltam ao padrão a cada visita).
- Se a conexão com a planilha falhar ao abrir a página, um aviso aparece e é preciso recarregar (botão "↻ Recarregar da planilha") antes de adicionar itens, para não sobrescrever a planilha com dados incompletos.

## Sincronização com o Google Sheets

A URL do App da Web e a senha já estão fixas dentro do `index.html` (bloco `Google Sheets`), então a sincronização funciona assim que a página abre — não é preciso colar nada.

**Atenção:** como a página é pública no GitHub Pages, qualquer pessoa que veja o código-fonte (`Ver código-fonte` no navegador) consegue ler essa URL e senha e usá-las para ler ou alterar sua planilha. Isso foi uma escolha deliberada para simplicidade de uso; se isso for um problema, o ideal é tornar o repositório privado (GitHub Pages exige plano pago para sites privados) ou trocar por um fluxo com login.

Caso precise reconfigurar (por exemplo, trocar de planilha ou senha):

1. Abra a planilha no Google Sheets → **Extensões → Apps Script** → cole o conteúdo de `Code.gs`.
2. Troque a linha `var SENHA = "...";` por uma senha sua.
3. **Implantar → Gerenciar implantações → editar (lápis)** → confirme **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa** → **Implantar**.
4. Autorize quando o Google pedir (aviso de "app não verificado" é normal: **Avançado → Acessar... (não seguro)** — o app é o seu próprio script). Se aparecer "This app is blocked" sem opção de avançar, é preciso vincular o Apps Script a um projeto próprio do Google Cloud (Configurações do projeto → Alterar projeto) e configurar a tela de consentimento OAuth com seu e-mail como usuário de teste.
5. Copie a nova **URL do App da Web** (termina em `/exec`) e cole, junto com a senha, nas variáveis `sync.url` e `sync.token` dentro do `index.html`.

Notas:
- A senha impede que estranhos *sem o link do site* alterem sua planilha — mas não protege contra quem inspeciona o código-fonte da página pública (ver aviso acima).
- Os nomes das abas na planilha precisam ser exatamente `Controle`, `Vendas` e `Valores Investidos`.

## Como atualizar os CSVs no GitHub (opcional)

Com a sincronização ativa, a planilha do Google já fica sempre atualizada — os CSVs do repositório viram apenas um backup. Se quiser atualizá-los:

1. Clique em **"Baixar os 3 CSVs"** (ou baixe só o que mudou).
2. No GitHub, abra o repositório → **Add file → Upload files** → arraste os CSVs → **Commit**.

Pronto: os arquivos do repositório ficam atualizados e servem de backup.

Para carregar dados de um CSV existente (ex.: em outro aparelho), use o botão **"Importar CSV"** de cada aba.

## Observação sobre os percentuais

Na planilha original, os cabeçalhos dizem "LUCRO 130%" e "PLATAFORMA 19%", mas os valores calculados correspondem a **150%** e **20%**. O sistema reproduz a matemática real da planilha (25% despesas, 16% imposto, 150% lucro, 20% plataforma) e mantém os cabeçalhos originais nos CSVs exportados, para compatibilidade. Os percentuais podem ser ajustados na aba Estoque.
