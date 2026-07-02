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

- Tudo que você digita é **salvo automaticamente no navegador** (localStorage). Pode fechar e abrir que os dados continuam lá, no mesmo aparelho.
- O painel no topo mostra o resumo: total investido, custo do estoque, total vendido e o saldo.
- Ao digitar o custo de uma peça nova, o preço de venda e o valor online são calculados na hora (os percentuais são configuráveis em "Percentuais de cálculo").

## Sincronização automática com o Google Sheets

Com o arquivo `Code.gs` você conecta a página direto na sua planilha do Google: cada peça, venda ou investimento adicionado (ou excluído) é gravado na hora nas abas **Controle**, **Vendas** e **Valores Investidos** — de qualquer aparelho.

Configuração (uma vez só, leva ~5 minutos):

1. Abra a planilha **Controle Bijuteria** no Google Sheets.
2. Menu **Extensões → Apps Script**.
3. Apague o código de exemplo e cole todo o conteúdo do arquivo `Code.gs`.
4. Na linha `var SENHA = "troque-esta-senha";`, coloque uma senha sua.
5. Clique em **Implantar → Nova implantação → tipo "App da Web"** e escolha:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
6. Autorize quando o Google pedir (aviso de "app não verificado" é normal: **Avançado → Acessar... (não seguro)** — o app é o seu próprio script).
7. Copie a **URL do App da Web** (termina em `/exec`).
8. Na página do Controle Bijuteria, role até **"Sincronizar com o Google Sheets"**, cole a URL e a senha e clique em **Conectar e sincronizar**.

A partir daí o topo da página mostra "✓ sincronizado com o Google Sheets". Ao abrir a página, ela carrega os dados atuais da planilha; ao adicionar ou excluir algo, grava de volta automaticamente. Se ficar sem internet, os dados continuam salvos no navegador e um aviso aparece.

Notas:
- A senha impede que estranhos com a URL alterem sua planilha. Não use uma senha que você usa em outros lugares.
- Se mudar o código do script depois, é preciso **Implantar → Gerenciar implantações → editar → Nova versão** para a mudança valer.
- Os nomes das abas na planilha precisam ser exatamente `Controle`, `Vendas` e `Valores Investidos`.

## Como atualizar os CSVs no GitHub (opcional)

Com a sincronização ativa, a planilha do Google já fica sempre atualizada — os CSVs do repositório viram apenas um backup. Se quiser atualizá-los:

1. Clique em **"Baixar os 3 CSVs"** (ou baixe só o que mudou).
2. No GitHub, abra o repositório → **Add file → Upload files** → arraste os CSVs → **Commit**.

Pronto: os arquivos do repositório ficam atualizados e servem de backup.

Para carregar dados de um CSV existente (ex.: em outro aparelho), use o botão **"Importar CSV"** de cada aba.

## Observação sobre os percentuais

Na planilha original, os cabeçalhos dizem "LUCRO 130%" e "PLATAFORMA 19%", mas os valores calculados correspondem a **150%** e **20%**. O sistema reproduz a matemática real da planilha (25% despesas, 16% imposto, 150% lucro, 20% plataforma) e mantém os cabeçalhos originais nos CSVs exportados, para compatibilidade. Os percentuais podem ser ajustados na aba Estoque.
