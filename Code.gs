/**
 * Controle Bijuteria — ponte entre a página (GitHub Pages) e o Google Sheets.
 *
 * COMO INSTALAR (uma vez só):
 * 1. Abra sua planilha "Controle Bijuteria" no Google Sheets.
 * 2. Menu Extensões → Apps Script.
 * 3. Apague o conteúdo do editor e cole este arquivo inteiro.
 * 4. Troque a SENHA abaixo por uma senha sua (qualquer texto).
 * 5. Clique em "Implantar" → "Nova implantação" → tipo "App da Web":
 *      - Executar como: Eu
 *      - Quem pode acessar: Qualquer pessoa
 * 6. Autorize quando o Google pedir e copie a URL que termina em /exec.
 * 7. Na página do Controle Bijuteria, cole a URL e a senha no cartão
 *    "Sincronizar com o Google Sheets" e clique em Conectar.
 */

var SENHA = "troque-esta-senha";

// Nomes das abas na sua planilha (têm que ser exatamente estes)
var ABAS = {
  controle: "Controle",
  vendas: "Vendas",
  invest: "Valores Investidos"
};

// Abas que têm linha de cabeçalho
var TEM_CABECALHO = { controle: true, vendas: true, invest: false };

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function lerAba_(nome) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nome);
  if (!sh || sh.getLastRow() === 0) return [];
  var values = sh.getRange(1, 1, sh.getLastRow(), Math.max(sh.getLastColumn(), 1))
                 .getDisplayValues(); // pega como texto, ex.: "R$ 12,00"
  // remove linhas totalmente vazias
  return values.filter(function (r) {
    return r.some(function (c) { return String(c).trim() !== ""; });
  });
}

// GET → devolve as três abas de uma vez
function doGet(e) {
  if (!e || !e.parameter || e.parameter.token !== SENHA) {
    return json_({ error: "senha incorreta" });
  }
  var controle = lerAba_(ABAS.controle);
  var vendas = lerAba_(ABAS.vendas);
  return json_({
    controle: controle.length > 1 ? controle.slice(1) : [], // sem cabeçalho
    vendas: vendas.length > 1 ? vendas.slice(1) : [],
    invest: lerAba_(ABAS.invest)
  });
}

// POST {token, action:"replace", sheet:"controle|vendas|invest", rows:[[...]]}
function doPost(e) {
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ error: "corpo inválido" });
  }
  if (payload.token !== SENHA) return json_({ error: "senha incorreta" });

  var nomeAba = ABAS[payload.sheet];
  if (!nomeAba) return json_({ error: "aba desconhecida: " + payload.sheet });
  if (payload.action !== "replace" || !Array.isArray(payload.rows)) {
    return json_({ error: "ação inválida" });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita gravações simultâneas embaralhadas
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(nomeAba) || ss.insertSheet(nomeAba);

    var rows = payload.rows;
    sh.clearContents();
    if (rows.length) {
      // deixa todas as linhas com o mesmo número de colunas
      var nCols = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 1);
      var norm = rows.map(function (r) {
        var linha = r.slice(0, nCols);
        while (linha.length < nCols) linha.push("");
        return linha.map(function (c) { return String(c == null ? "" : c); });
      });
      var range = sh.getRange(1, 1, norm.length, nCols);
      range.setNumberFormat("@"); // texto: preserva "R$ 12,00" e datas dd/mm/aaaa
      range.setValues(norm);
    }
    SpreadsheetApp.flush();
    return json_({ ok: true, sheet: payload.sheet, rows: rows.length });
  } finally {
    lock.releaseLock();
  }
}
