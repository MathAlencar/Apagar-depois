"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _APIChamadasjs = require('../api/APIChamadas.js');
var _metodosjs = require('../methods/metodos.js');
var _GeradorGraficojs = require('../utils/GeradorGrafico.js');


_dotenv2.default.config();

// usar memória para acessar file.buffer
const storage = _multer2.default.memoryStorage();
// até 20 arquivos por requisição (ajuste se quiser)
const upload = _multer2.default.call(void 0, { storage });

/**
 * Classe para integração com API GerarExcelSCR
 * Objetivo: Gerar arquivos Excel SCR a partir dos dados do Bacen
 * Como funciona: Converte dados do Bacen para o formato esperado pela API externa e faz requisição POST para gerar o Excel
 */
class APIGeradorExcelSCR {
  constructor() {
    this.apiUrl = 'https://api.multiplo.moneyp.com.br/api/Bureau/GerarExcelSCR';
    this.pastaDocumento = _path2.default.join(process.cwd(), 'Front-end', "Documentos Excel");
    this.timeout = 30000; // 30 segundos

    // Labels padrão para a API
    this.labelsPadrao = [
      "Período",
      "Dados da Operação",
      "Coobrigação Assumida",
      "Coobrigação Recebida",
      "% Doctos Processados",
      "% Volume Processado",
      "Qtde Operações Discordância",
      "Vlr Operações Discordância",
      "Qtde Operações Sub Judice",
      "Vlr Operações Sub Judice",
      "Qtde Instituições",
      "Qtde Operações",
      "Risco Indireto Vendor",
      "Carteira a Vencer",
      "De 14 a 30 dias",
      "De 31 a 60 dias",
      "De 61 a 90 dias",
      "De 91 a 180 dias",
      "De 181 a 360 dias",
      "Mais de 360 dias",
      "Prazo Indeterminado",
      "Vencidos",
      "De 15 a 30 dias",
      "De 31 a 60 dias",
      "De 61 a 90 dias",
      "De 91 a 180 dias",
      "De 181 a 360 dias",
      "Mais de 360 dias",
      "Prejuízo",
      "Até 12 meses",
      "Acima 12 meses",
      "Limite de Crédito",
      "Até 360 dias",
      "Acima de 360 dias",
      "Carteira de Crédito",
      "Repasses",
      "Coobrigações",
      "Responsabilidade Total",
      "Créditos a Liberar",
      "Risco Indireto Vendor",
      "Risco Total",
      "Moeda Estrangeira - De 15 a 30 dias",
      "Moeda Estrangeira - De 31 a 60 dias",
      "Moeda Estrangeira - De 61 a 90 dias",
      "Moeda Estrangeira - De 91 a 180 dias",
      "Moeda Estrangeira - De 181 a 360 dias",
      "Moeda Estrangeira - Acima de 360 dias",
      "Modalidades"
    ];
  }

  /**
   * Objetivo: Garantir que a pasta de documentos Excel existe no sistema de arquivos
   * Como funciona: Verifica se a pasta existe usando fs.existsSync, e se não existir, cria recursivamente usando fs.mkdirSync
   */
  _criarPastaSeNaoExistir() {
    if (!_fs2.default.existsSync(this.pastaDocumento)) {
      _fs2.default.mkdirSync(this.pastaDocumento, { recursive: true });
      // console.log(`📁 Pasta criada: ${this.pastaDocumento}`);
    }
  }

  /**
   * Objetivo: Gerar um nome único para o arquivo Excel baseado no CPF e timestamp
   * Como funciona: Remove caracteres não numéricos do CPF, adiciona prefixo "SCR_", e concatena com timestamp ISO formatado
   */
  _gerarNomeArquivo(cpfCliente) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const prefixo = `SCR_${cpfCliente.replace(/[^0-9]/g, '')}`;
    return `${prefixo}_${timestamp}.xlsx`;
  }

  /**
   * Objetivo: Converter os dados retornados pelo Bacen para o formato esperado pela API de geração de Excel
   * Como funciona: Itera sobre os dados do Bacen, filtra apenas períodos válidos (sem erro), e monta um objeto com labels padrão e periodosConsulta
   */
  _converterDadosBacenParaAPI(dataBacen) {
    const periodosConsulta = [];

    // // Processar cada período dos dados do Bacen
    for (const item of dataBacen) {
      if (item.dados && !item.dados.error && !item.dados.Erro) {
        // Os dados já contêm Erro, MensagemOperador e Periodo
        // Apenas incluir os dados diretamente
        periodosConsulta.push(item.dados);
      }
    }

    // Processar cada período dos dados do Bacen -> Ordem invertida para se ajustar ao bacen.
    // for (const item of dataBacen) {
    //   if (item.dados && !item.dados.error && !item.dados.Erro) {
    //     periodosConsulta.unshift(item.dados);
    //   }
    // }

    return {
      labels: this.labelsPadrao,
      periodosConsulta: periodosConsulta
    };
  }

  /**
   * Faz chamada para a API e gera Excel SCR
   * @param {Array} dataBacen - Dados retornados por bacen.main(cpf)
   * @param {string} cpfCliente - CPF do cliente
   * @returns {Promise<Object>} Resultado da operação
   */

  /**
   * Objetivo: Limpar arquivos Excel antigos da pasta de documentos para evitar acúmulo de arquivos
   * Como funciona: Lê todos os arquivos .xlsx da pasta, verifica a data de modificação de cada um, e exclui os que são mais antigos que o limite especificado em minutos
   */
    async limparExcelsAntigos(minutos = 5) {
      // garante que a pasta exista
      this._criarPastaSeNaoExistir();

      const LIMITE_MS = minutos * 60000;
      const agora = Date.now();

      const resultado = {
        pasta: this.pastaDocumento,
        minutos,
        candidatos: 0,
        excluidos: [],
        ignorados: [],
        erros: []
      };

      try {
        const itens = await _fs2.default.promises.readdir(this.pastaDocumento, { withFileTypes: true });

        // só arquivos XLSX (ex.: SCR_*.xlsx)
        const apenasXlsx = itens
          .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.xlsx'));

        for (const arq of apenasXlsx) {
          const caminho = _path2.default.join(this.pastaDocumento, arq.name);
          try {
            const st = await _fs2.default.promises.stat(caminho);

            // usamos mtime (última modificação). birthtime pode não ser confiável em alguns FS.
            const idadeMs = agora - st.mtimeMs;
            const ehAntigo = idadeMs > LIMITE_MS;

            resultado.candidatos += 1;

            if (ehAntigo) {
              await _fs2.default.promises.unlink(caminho);
              resultado.excluidos.push({
                arquivo: arq.name,
                tamanhoBytes: st.size,
                mtime: st.mtime.toISOString()
              });
            } else {
              resultado.ignorados.push({
                arquivo: arq.name,
                tamanhoBytes: st.size,
                mtime: st.mtime.toISOString()
              });
            }
          } catch (e) {
            resultado.erros.push({ arquivo: arq.name, erro: e.message });
          }
        }
      } catch (e) {
        resultado.erros.push({ pasta: this.pastaDocumento, erro: e.message });
      }

      return resultado;
    }

  /**
   * Objetivo: Gerar arquivo Excel SCR através de chamada à API externa usando dados do Bacen
   * Como funciona: Converte dados do Bacen para formato da API, faz requisição POST com arraybuffer, valida se a resposta é realmente um Excel, e salva o arquivo na pasta de documentos
   */
    async gerarExcelSCR(dataBacen, cpfCliente) {
    try {
      // Criar pasta se necessário
      this._criarPastaSeNaoExistir();

      // Converter dados do Bacen para formato da API

      const dadosAPI = this._converterDadosBacenParaAPI(dataBacen);

      if (dadosAPI.periodosConsulta.length === 0) {
        throw new Error('Nenhum período válido encontrado nos dados do Bacen');
      }

      // Gerar nome do arquivo
      const nomeArquivo = this._gerarNomeArquivo(cpfCliente);
      const caminhoCompleto = _path2.default.join(this.pastaDocumento, nomeArquivo);

      // Log opcional para debug
      // console.dir(dadosAPI, { depth: null });

      // Fazer requisição POST
      const response = await _axios2.default.post(this.apiUrl, dadosAPI, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'arraybuffer',
        timeout: this.timeout
      });

      const contentType = (response.headers['content-type'] || '').toLowerCase();
      const buffer = Buffer.from(response.data);

      // 🔴 SE NÃO FOR EXCEL, É ERRO → NÃO SALVA COMO XLSX
      if (!contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const texto = buffer.toString('utf8');
        let msgErro = texto;

        // tenta parsear como JSON para pegar { error: "..." }
        try {
          const json = JSON.parse(texto);
          if (json.error) msgErro = json.error;
        } catch (_) {
          // se não for JSON, mantém texto cru mesmo
        }

        console.error('❌ API SCR não retornou Excel. Conteúdo:', msgErro);

        return {
          success: false,
          erro: msgErro,
          statusCode: response.status,
          cpfCliente,
          arquivo: null
        };
      }

      // ✅ Chegou aqui? É Excel mesmo → salva o arquivo
      _fs2.default.writeFileSync(caminhoCompleto, buffer);

      const stats = _fs2.default.statSync(caminhoCompleto);

      return {
        success: true,
        arquivo: caminhoCompleto,
        nomeArquivo: nomeArquivo,
        tamanho: stats.size,
        dataGeracao: new Date().toISOString(),
        cpfCliente: cpfCliente,
        periodosProcessados: dadosAPI.periodosConsulta.length
      };

    } catch (error) {
      console.error(`❌ Erro na chamada da API para CPF ${cpfCliente}:`, error.message);

      let erroDetalhado = error.message;
      let statusCode = null;

      if (error.response) {
        statusCode = error.response.status;

        // trata data mesmo sendo arraybuffer
        let textoErro = '';
        if (error.response.data) {
          if (error.response.data instanceof ArrayBuffer || Buffer.isBuffer(error.response.data)) {
            textoErro = Buffer.from(error.response.data).toString('utf8');
          } else if (typeof error.response.data === 'string') {
            textoErro = error.response.data;
          } else {
            textoErro = JSON.stringify(error.response.data);
          }
        }

        erroDetalhado = `HTTP ${statusCode}: ${textoErro}`;
      }

      return {
        success: false,
        erro: erroDetalhado,
        statusCode: statusCode,
        cpfCliente: cpfCliente,
        arquivo: null
      };
    }
    }


}

class CadastroControllers {

  /** -> TESTE/VALIDAÇÂO
   * Objetivo: Endpoint de teste para verificar se a API está funcionando
   * Como funciona: Retorna uma mensagem JSON simples de sucesso
   */
  async teste(req,res){
    try{
      return res.status(200).json({
        "msg": "código atualizado!"
      })

    }catch(e){
      return res.status.json({
        "msg": "teste"
      })
    }
  }

  /** -> TESTE/VALIDAÇÂO
   * Objetivo: Endpoint de teste para consultar dados do Bacen para um CPF específico
   * Como funciona: Instancia a API do Bacen, chama o método main com um CPF fixo, e retorna os dados dos últimos 24 meses
   */
  async searchBacen(req, res){
    try {

      // Inicializando a api do bacen
      const bacen = new (0, _APIChamadasjs.ApiBacen)();

      const data = await bacen.main('04040602935'); // Colocar essa linha de código em Store.

      return res.status(200).json({
          data,
          status: "sucesso",
      });
    } catch (e) {
      return res.status(400).json({
        error: e.message,
      });
    }
  }

  /** -> TESTE/VALIDAÇÂO
   * Objetivo: Gerar gráfico de evolução das dívidas para um CPF específico
   * Como funciona: Consulta dados do Bacen, processa os dados para formato de gráfico, gera o gráfico usando Chart.js, e retorna o resultado em JSON
   */
  async gerarGraficoEvolucao(req, res) {
    try {
      const { cpf } = req.params;

      if (!cpf) {
        return res.status(400).json({
          error: "CPF é obrigatório",
          message: "Informe o CPF para gerar o gráfico"
        });
      }

      // Inicializar APIs
      const bacen = new (0, _APIChamadasjs.ApiBacen)();
      const objeto = new (0, _metodosjs.Objetos)();
      const geradorGrafico = new (0, _GeradorGraficojs.GeradorGrafico)();

      // Consultar dados dos últimos 12 meses
      // console.log(`Consultando dados do Bacen para CPF: ${cpf}`);
      const dados12Meses = await bacen.main(cpf);

      // Processar dados para o gráfico
      const dadosGrafico = objeto.processarDadosParaGrafico(dados12Meses);

      if (dadosGrafico.length === 0) {
        return res.status(404).json({
          error: "Nenhum dado encontrado",
          message: "Não foram encontrados dados válidos para o CPF informado"
        });
      }

      // Gerar apenas o gráfico de evolução (linha)
      const resultadoEvolucao = await geradorGrafico.gerarGraficoEvolucaoDividas(dadosGrafico, cpf);

      return res.status(200).json({
        success: true,
        message: "Gráfico de evolução gerado com sucesso",
        dados: dadosGrafico,
        grafico: resultadoEvolucao
      });

    } catch (error) {
      console.error('Erro ao gerar gráfico:', error);
      return res.status(500).json({
        error: error.message,
        message: "Erro interno do servidor ao gerar gráfico"
      });
    }
  }

  /** -> TESTE/VALIDAÇÂO
   * Objetivo: Endpoint para fazer upload de documentos para o Ploomes (atualmente incompleto)
   * Como funciona: Retorna uma resposta de sucesso, mas a implementação completa não está presente
   */
  async uploadToPloomes(req, res) {
    try {

      // 3) Retorna o resultado do Ploomes (Id/Url/ThumbUrl)
      return res.status(200).json({
        message: 'Upload realizado com sucesso!',
        ploomes: data,
      });
    } catch (err) {
      console.error(_optionalChain([err, 'access', _2 => _2.response, 'optionalAccess', _3 => _3.data]) || err.message);
      return res.status(500).json({
        error: 'Falha ao enviar imagem para o Ploomes',
        detail: _optionalChain([err, 'access', _4 => _4.response, 'optionalAccess', _5 => _5.data]) || err.message,
      });
    }
  }

  /**
   * Objetivo: Processar deals do Ploomes de forma otimizada, consultando Bacen, gerando gráficos e atualizando campos
   * Como funciona: Busca deals no Ploomes, para cada deal extrai CPFs dos tomadores, consulta Bacen, processa dívidas, gera gráficos, faz upload para Ploomes, atualiza campos de dívidas, gera Excel SCR, tudo com rate limiting para respeitar limites da API
   */
  async storeOtimizado(req, res) {
    try {
      // console.log('🚀 Iniciando processamento otimizado com rate limiting...');

      // Inicializar a API do ploomes
      const deal = new (0, _APIChamadasjs.CallOptions)();

      // Realizar a captura dos dados no Ploomes
      const data = await deal.TakeDealOtherProperties();

      // Sistema de rate limiting - máximo 6 requisições simultâneas
      let requisiçõesAtivas = 0;
      const maxRequisiçõesSimultâneas = 6;
      const filaDeRequisições = [];

      /**
       * Objetivo: Controlar o número de requisições simultâneas para não exceder o limite da API
       * Como funciona: Mantém um contador de requisições ativas, se atingir o máximo adiciona à fila, e processa a fila conforme requisições são concluídas
       */
      const executarComRateLimit = async (função) => {
        return new Promise((resolve, reject) => {
          const executar = async () => {
            if (requisiçõesAtivas >= maxRequisiçõesSimultâneas) {
              // Adicionar à fila se já atingiu o limite
              filaDeRequisições.push({ função, resolve, reject });
              return;
            }

            requisiçõesAtivas++;
            try {
              const resultado = await função();
              resolve(resultado);
            } catch (error) {
              reject(error);
            } finally {
              requisiçõesAtivas--;
              // Processar próxima requisição da fila
              if (filaDeRequisições.length > 0) {
                const próxima = filaDeRequisições.shift();
                setTimeout(() => executarComRateLimit(próxima.função).then(próxima.resolve).catch(próxima.reject), 100);
              }
            }
          };
          executar();
        });
      };

      /**
       * Objetivo: Processar um lote de deals de forma controlada
       * Como funciona: Para cada deal do lote, verifica se já foi processado, extrai CPFs dos tomadores, processa cada tomador sequencialmente (consulta Bacen, gera gráfico, upload, atualização), e atualiza campos de dívidas no deal
       */
      const processarLoteDeals = async (loteDeals) => {
        // console.log(`📦 Processando lote de ${loteDeals.length} deals...`);

          /**
           * Objetivo: Processar um deal individual do Ploomes
           * Como funciona: Verifica se o deal já foi processado, extrai CPFs dos 4 tomadores possíveis, processa cada tomador (consulta Bacen, categoriza dívidas, gera gráfico, faz upload, atualiza campos), e por fim atualiza todos os campos de dívidas no deal
           */
          const processarDeal = async (dealUser) => {
          // console.log('dealUser', dealUser)
          const { id, StageId, ContactId, otherProps } = dealUser;

          if(id == 802129740){
            return null
          }

          if(otherProps['deal_8202EECD-41FA-4AAD-9927-90105C5B9391'] == true){
          // console.log(`🔄 Processando Deal ${id}...`);

          // Inicializar APIs
          const ploomesDocumento = new (0, _APIChamadasjs.ApiPloomesDocumento)();
          const objeto = new (0, _metodosjs.Objetos)();

          // Extrair CPFs dos tomadores
          const cpfCnpjTomadores = [
          otherProps['deal_E95722A2-7AAE-4EBE-B632-1C954764894C'] || otherProps['deal_304CA7AF-E8C8-4006-BC57-6D5FA653FEB5'],
            otherProps['deal_0C3DA592-AE6D-4DE2-A9B3-A8251CD08F00'] || otherProps['deal_A9AC9C2E-633A-480F-8689-C93D930F6847'],
            otherProps['deal_5B70C640-6C0C-48F6-ADA7-F7DE2F0A470D'] || otherProps['deal_AF1A346F-3AE9-428B-9FF9-A6317AC02FD3'],
            otherProps['deal_D8603767-5A19-46DC-9B88-2F000BD01096'] || otherProps['deal_98CF5047-B79D-43EC-89A8-EA4E6863A24D']
          ];

          console.log(cpfCnpjTomadores)

          /**
           * Objetivo: Processar um tomador individual (CPF) de um deal
           * Como funciona: Consulta dados do Bacen para o CPF, encontra dados válidos, captura e categoriza dívidas, gera gráfico de evolução, faz upload do gráfico para Ploomes com retry, atualiza campo do gráfico no deal, e gera Excel SCR
           */
          const processarTomador = async (cpf, tomadorIndex) => {
            if (!cpf) return null;

            try {
              console.log(`🔄 Processando tomador ${tomadorIndex + 1} - CPF: ${cpf}`);

              // Consulta ao Bacen (sem rate limiting - é API externa)
              const bacen = new (0, _APIChamadasjs.ApiBacen)();
              const dataBacen = await bacen.main(cpf);

              // Encontrar dados válidos
              let dadosValidos = null;
              for (const item of dataBacen) {
                if (item.dados && !item.dados.error && !item.dados.Erro && item.dados.ResumoDoClienteTraduzido) {
                  dadosValidos = item;
                  break;
                }
              }

              if (!dadosValidos) {
                console.log(`⚠️ Nenhum dado válido encontrado para CPF ${cpf}`);
                return null;
              }

              // Capturar dados das dívidas
              const retornoJson = objeto.capturandoDividas(dadosValidos);

              // Gerar gráfico (sem rate limiting - é processamento local)
              const dadosGrafico = objeto.processarDadosParaGrafico(dataBacen);
              if (dadosGrafico.length === 0) {
                // console.log(`⚠️ Dados insuficientes para gráfico do CPF ${cpf}`);
                return null;
              }

              const geradorGrafico = new (0, _GeradorGraficojs.GeradorGrafico)();
              const resultadoGrafico = await geradorGrafico.gerarGraficoEvolucaoDividas(dadosGrafico, cpf);

              if (!resultadoGrafico.success) {
                // console.log(`❌ Erro ao gerar gráfico para CPF ${cpf}`);
                return null;
              }

              /**
               * Objetivo: Fazer upload do gráfico para o Ploomes com sistema de retry em caso de erro
               * Como funciona: Tenta fazer upload até 3 vezes, se receber erro 429 (rate limit) aguarda 2 segundos antes de tentar novamente
               */
              const uploadComRetry = async (tentativas = 3) => {
                for (let i = 0; i < tentativas; i++) {
                  try {
                    const resultado = await executarComRateLimit(() =>
                      ploomesDocumento.uploadImageToPloomes(resultadoGrafico.buffer, resultadoGrafico.fileName, id)
                    );

                    if (resultado.success) {
                      return resultado;
                    }
                  } catch (error) {
                    if (_optionalChain([error, 'access', _6 => _6.response, 'optionalAccess', _7 => _7.status]) === 429 && i < tentativas - 1) {
                      // console.log(`⏳ Rate limit atingido, aguardando 2s antes da tentativa ${i + 2}...`);
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      continue;
                    }
                    throw error;
                  }
                }
                throw new Error('Máximo de tentativas atingido');
              };

              const uploadResult = await uploadComRetry();

              /**
               * Objetivo: Atualizar campo do gráfico no deal do Ploomes com sistema de retry
               * Como funciona: Tenta atualizar o campo até 3 vezes, se receber erro 429 aguarda 2 segundos antes de tentar novamente
               */
              const atualizarComRetry = async (tentativas = 3) => {
                for (let i = 0; i < tentativas; i++) {
                  try {
                    const resultado = await executarComRateLimit(() =>
                      ploomesDocumento.updateDealWithGraphImage(id, uploadResult.imageUrl, tomadorIndex)
                    );

                    if (resultado.success) {
                      return resultado;
                    }
                  } catch (error) {
                    if (_optionalChain([error, 'access', _8 => _8.response, 'optionalAccess', _9 => _9.status]) === 429 && i < tentativas - 1) {
                      // console.log(`⏳ Rate limit atingido, aguardando 2s antes da tentativa ${i + 2}...`);
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      continue;
                    }
                    throw error;
                  }
                }
                throw new Error('Máximo de tentativas atingido');
              };

              const updateResult = await atualizarComRetry();

              // Gerar Excel SCR via API (sem rate limiting - é processamento local)
              const geradorExcel = new APIGeradorExcelSCR();
              // Limpando primeiros os Excels ->
              await geradorExcel.limparExcelsAntigos(2880); // 5 minutos

              let resultadoExcel = null;

              try {
                // console.log(`📊 Gerando Excel SCR via API para CPF ${cpf}...`);
                resultadoExcel = await geradorExcel.gerarExcelSCR(dataBacen, cpf);

                if (resultadoExcel.success) {
                  console.log(`✅ Excel SCR gerado com sucesso: ${resultadoExcel.arquivo}`);
                  console.log(`📏 Tamanho: ${resultadoExcel.tamanho} bytes`);
                  console.log(`📅 Períodos processados: ${resultadoExcel.periodosProcessados}`);
                } else {
                  console.log(`❌ Erro ao gerar Excel SCR: ${resultadoExcel.erro}`);
                }
              } catch (errorExcel) {
                console.error(`❌ Erro na integração Excel SCR: ${errorExcel.message}`);
              }

              return {
                tomadorIndex,
                cpf,
                success: true,
                uploadResult,
                updateResult,
                dadosDividas: retornoJson, // Incluir dados das dívidas para atualização posterior
                excelSCR: _optionalChain([resultadoExcel, 'optionalAccess', _10 => _10.success]) ? {
                  arquivo: resultadoExcel.arquivo,
                  nomeArquivo: resultadoExcel.nomeArquivo,
                  tamanho: resultadoExcel.tamanho,
                  dataGeracao: resultadoExcel.dataGeracao,
                  periodosProcessados: resultadoExcel.periodosProcessados
                } : null
              };

            } catch (error) {
              console.error(`❌ Erro ao processar tomador ${tomadorIndex + 1}:`, error.message);
              return {
                tomadorIndex,
                cpf,
                success: false,
                error: error.message
              };
            }
          };

          // Processar tomadores sequencialmente para evitar rate limit
          const tomadoresComCPF = cpfCnpjTomadores.map((cpf, index) => ({ cpf, index })).filter(t => t.cpf);
          const resultados = [];
          const ArrayDividas = []; // Array para armazenar os dados das dívidas

          for (const tomador of tomadoresComCPF) {
            const resultado = await processarTomador(tomador.cpf, tomador.index);
            resultados.push(resultado);

            // Adicionar dados das dívidas ao array se o processamento foi bem-sucedido
            if (_optionalChain([resultado, 'optionalAccess', _11 => _11.success]) && resultado.dadosDividas) {
              ArrayDividas.push(objeto.criaTomador(
                resultado.cpf,
                resultado.dadosDividas.creditoRotativoVencido,
                resultado.dadosDividas.creditoRotativoAVencer,
                resultado.dadosDividas.homeEquityVencido,
                resultado.dadosDividas.homeEquityAVencer,
                resultado.dadosDividas.cartaoCreditoVencido,
                resultado.dadosDividas.cartaoCreditoAVencer,
                resultado.dadosDividas.cartaoCreditoNaoMigradoVencido,
                resultado.dadosDividas.cartaoCreditoNaoMigradoAVencer,
                resultado.dadosDividas.creditoPessoalConsignadoVencido,
                resultado.dadosDividas.creditoPessoalConsignadoAVencer,
                resultado.dadosDividas.creditoPessoalSemConsignacaoVencido,
                resultado.dadosDividas.creditoPessoalSemConsignacaoAVencer,
                resultado.dadosDividas.capitalDeGiroVencido,
                resultado.dadosDividas.capitalDeGiroAVencer,
                resultado.dadosDividas.aquisicaoDeBensVencido,
                resultado.dadosDividas.aquisicaoDeBensAVencer,
                resultado.dadosDividas.chequeEspecialVencido,
                resultado.dadosDividas.chequeEspecialAVencer,
                resultado.dadosDividas.financiamentoHabitacionalVencido,
                resultado.dadosDividas.financiamentoHabitacionalAVencer,
                resultado.dadosDividas.ruralVencido,
                resultado.dadosDividas.ruralAVencer,
                resultado.dadosDividas.outrosEmprestimosVencido,
                resultado.dadosDividas.outrosEmprestimosAVencer,
                resultado.dadosDividas.outrasDividas1Vencido,
                resultado.dadosDividas.outrasDividas1AVencer,
                resultado.dadosDividas.outrasDividas2Vencido,
                resultado.dadosDividas.outrasDividas2AVencer,
                resultado.dadosDividas.totalCarteiraVencido,
                resultado.dadosDividas.totalCarteiraAVencer,
                resultado.dadosDividas.preencherZeroVencido,
                resultado.dadosDividas.preencherZeroAVencer,
                resultado.dadosDividas.prejuizo
              ));
            }
          }

          // Atualizar campos de dívidas no Ploomes com rate limiting
          if (ArrayDividas.length > 0) {
            try {
              // console.log(`🔄 Atualizando campos de dívidas para Deal ${id}...`);
              const updateDividasResult = await executarComRateLimit(() =>
                deal.UpdateData(id, ContactId, StageId, ArrayDividas)
              );
              // console.log(`✅ Campos de dívidas atualizados com sucesso para Deal ${id}`);
            } catch (error) {
              console.error(`❌ Erro ao atualizar campos de dívidas para Deal ${id}:`, error.message);
            }
          }

          // Log dos resultados
          const sucessos = resultados.filter(r => _optionalChain([r, 'optionalAccess', _12 => _12.success])).length;
          // console.log(`📊 Deal ${id}: ${sucessos}/${tomadoresComCPF.length} tomadores processados com sucesso`);

          return {
            dealId: id,
            totalTomadores: tomadoresComCPF.length,
            sucessos,
            dividasAtualizadas: ArrayDividas.length,
            resultados: resultados.filter(Boolean)
          };

          }else {
            // console.log('Não irei processar esses pois já foi processado: ', id)
          }
        };

        // Processar deals do lote em paralelo (máximo 2 por vez)
        const resultadosDeals = await Promise.allSettled(
          loteDeals.map(dealUser => processarDeal(dealUser))
        );

        return resultadosDeals.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean);
      };

      // Processar deals em lotes de 2
      const lotes = [];
      for (let i = 0; i < data.length; i += 2) {
        lotes.push(data.slice(i, i + 2));
      }

      // console.log(`📦 Processando ${lotes.length} lotes de deals...`);

      const todosOsResultados = [];
      for (let i = 0; i < lotes.length; i++) {
        // console.log(`🔄 Processando lote ${i + 1}/${lotes.length}...`);
        const resultadosLote = await processarLoteDeals(lotes[i]);
        todosOsResultados.push(...resultadosLote);

        // Pausa entre lotes para evitar sobrecarga
        if (i < lotes.length - 1) {
          // console.log(`⏳ Pausa de 1s entre lotes...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Resumo final
      const totalDeals = data.length;
      const dealsProcessados = todosOsResultados.length;
      const totalTomadores = todosOsResultados.reduce((acc, r) => acc + (_optionalChain([r, 'optionalAccess', _13 => _13.totalTomadores]) || 0), 0);
      const totalSucessos = todosOsResultados.reduce((acc, r) => acc + (_optionalChain([r, 'optionalAccess', _14 => _14.sucessos]) || 0), 0);
      const totalExcelSCR = todosOsResultados.reduce((acc, r) => {
        if (_optionalChain([r, 'optionalAccess', _15 => _15.resultados])) {
          return acc + r.resultados.filter(t => _optionalChain([t, 'optionalAccess', _16 => _16.excelSCR])).length;
        }
        return acc;
      }, 0);

      // console.log(`🎉 Processamento concluído!`);
      // console.log(`📊 ${dealsProcessados}/${totalDeals} deals processados`);
      // console.log(`👥 ${totalSucessos}/${totalTomadores} tomadores processados com sucesso`);
      // console.log(`📈 ${totalExcelSCR} Excel SCR gerados com sucesso`);

      return res.status(200).json({
        success: true,
        message: "Processamento otimizado com rate limiting concluído!",
        resumo: {
          totalDeals,
          dealsProcessados,
          totalTomadores,
          totalSucessos,
          totalExcelSCR
        },
        resultados: todosOsResultados
      });

    } catch (error) {
      console.error('❌ Erro no processamento otimizado:', error);
      return res.status(500).json({
        error: error.message,
        dataBacen,
        message: "Erro interno do servidor"
      });
    }
  }

  /** -> TESTE/VALIDAÇÂO
   * Objetivo: Endpoint de teste para gerar gráfico e enviar para o Ploomes
   * Como funciona: Recebe CPF e DealId, consulta dados do Bacen, gera gráfico, faz upload para Ploomes, e atualiza campo do deal com a URL da imagem
   */
  async testeGraficoUpload(req, res) {
    try {
      const { cpf, dealId } = req.params;

      if (!cpf || !dealId) {
        return res.status(400).json({
          error: "CPF e DealId são obrigatórios",
          message: "Informe o CPF e DealId para gerar e enviar o gráfico"
        });
      }

      // Inicializar APIs
      const bacen = new (0, _APIChamadasjs.ApiBacen)();
      const objeto = new (0, _metodosjs.Objetos)();
      const geradorGrafico = new (0, _GeradorGraficojs.GeradorGrafico)();
      const ploomesDocumento = new (0, _APIChamadasjs.ApiPloomesDocumento)();

      // Consultar dados dos últimos 12 meses
      // console.log(`Consultando dados do Bacen para CPF: ${cpf}`);
      const dados12Meses = await bacen.main(cpf);

      // Encontrar dados válidos
      let dadosValidos = null;
      for (const item of dados12Meses) {
        if (item.dados && !item.dados.error && !item.dados.Erro && item.dados.ResumoDoClienteTraduzido) {
          dadosValidos = item;
          break;
        }
      }

      if (!dadosValidos) {
        return res.status(404).json({
          error: "Nenhum dado válido encontrado",
          message: "Não foram encontrados dados válidos para o CPF informado"
        });
      }

      // Processar dados para o gráfico
      const dadosGrafico = objeto.processarDadosParaGrafico(dados12Meses);

      if (dadosGrafico.length === 0) {
        return res.status(404).json({
          error: "Dados insuficientes para gráfico",
          message: "Não foram encontrados dados suficientes para gerar o gráfico"
        });
      }

      // Gerar gráfico
      const resultadoGrafico = await geradorGrafico.gerarGraficoEvolucaoDividas(dadosGrafico, cpf);

      if (!resultadoGrafico.success) {
        return res.status(500).json({
          error: "Erro ao gerar gráfico",
          message: resultadoGrafico.message
        });
      }

      // Upload para Ploomes
      const uploadResult = await ploomesDocumento.uploadImageToPloomes(
        resultadoGrafico.buffer,
        resultadoGrafico.fileName,
        dealId
      );

      let updateResult = null;
      if (uploadResult.success) {
        // Atualizar campo OtherProperties (assumindo tomador 0 para teste)
        const tomadorIndex = 0;
        updateResult = await ploomesDocumento.updateDealWithGraphImage(
          dealId,
          uploadResult.imageUrl,
          tomadorIndex
        );
      }

      return res.status(200).json({
        success: true,
        message: "Gráfico gerado, enviado e campo atualizado com sucesso!",
        grafico: {
          fileName: resultadoGrafico.fileName,
          generatedInMemory: true
        },
        upload: uploadResult,
        fieldUpdate: updateResult
      });

    } catch (error) {
      console.error('Erro no teste de upload:', error);
      return res.status(500).json({
        error: error.message,
        message: "Erro interno do servidor"
      });
    }
  }

}

exports. default = new CadastroControllers();

 const uploadSingle = upload.single("file"); exports.uploadSingle = uploadSingle;
 const uploadMulti = upload.array("files", 20); exports.uploadMulti = uploadMulti;

