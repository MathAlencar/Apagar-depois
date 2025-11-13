import dotenv from "dotenv";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { CallOptions, ApiBacen, ApiPloomesDocumento } from "../api/APIChamadas.js";
import { Objetos } from '../methods/metodos.js';
import { GeradorGrafico } from '../utils/GeradorGrafico.js';


dotenv.config();

// usar memória para acessar file.buffer
const storage = multer.memoryStorage();
// até 20 arquivos por requisição (ajuste se quiser)
const upload = multer({ storage });

// Classe para integração com API GerarExcelSCR
class APIGeradorExcelSCR {
  constructor() {
    this.apiUrl = 'https://api.multiplo.moneyp.com.br/api/Bureau/GerarExcelSCR';
    this.pastaDocumento = path.join(process.cwd(), 'Front-end', "Documentos Excel");
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
   * Cria pasta "Documentos Excel" se não existir
   */
  _criarPastaSeNaoExistir() {
    if (!fs.existsSync(this.pastaDocumento)) {
      fs.mkdirSync(this.pastaDocumento, { recursive: true });
      // console.log(`📁 Pasta criada: ${this.pastaDocumento}`);
    }
  }

  /**
   * Gera nome único para o arquivo Excel
   */
  _gerarNomeArquivo(cpfCliente) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const prefixo = `SCR_${cpfCliente.replace(/[^0-9]/g, '')}`;
    return `${prefixo}_${timestamp}.xlsx`;
  }

  /**
   * Converte dados do Bacen para o formato da API
   * @param {Array} dataBacen - Dados retornados por bacen.main(cpf)
   * @returns {Object} Dados no formato da API
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

  // async gerarExcelSCR(dataBacen, cpfCliente) {
  //   try {
  //     // console.log(`🚀 Gerando Excel SCR via API para CPF ${cpfCliente}...`);

  //     // Criar pasta se necessário
  //     this._criarPastaSeNaoExistir();

  //     // Converter dados do Bacen para formato da API
  //     const dadosAPI = this._converterDadosBacenParaAPI(dataBacen);

  //     if (dadosAPI.periodosConsulta.length === 0) {
  //       throw new Error('Nenhum período válido encontrado nos dados do Bacen');
  //     }

  //     // Gerar nome do arquivo
  //     const nomeArquivo = this._gerarNomeArquivo(cpfCliente);
  //     const caminhoCompleto = path.join(this.pastaDocumento, nomeArquivo);

  //     // console.log(`📄 Enviando ${dadosAPI.periodosConsulta.length} períodos para API...`);

  //     // Fazer requisição POST
  //     const response = await axios.post(this.apiUrl, dadosAPI, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //       },
  //       responseType: 'arraybuffer',
  //       timeout: this.timeout
  //     });

  //     // console.log(`✅ Resposta recebida: ${response.status} ${response.statusText}`);
  //     // console.log(`📏 Tamanho da resposta: ${response.data.length} bytes`);

  //     // Salvar arquivo Excel
  //     fs.writeFileSync(caminhoCompleto, response.data);

  //     // Verificar se arquivo foi salvo
  //     const stats = fs.statSync(caminhoCompleto);

  //     // console.log('🎉 Excel SCR gerado com sucesso!');
  //     // console.log(`📁 Local: ${caminhoCompleto}`);
  //     // console.log(`📏 Tamanho: ${stats.size} bytes`);

  //     return {
  //       success: true,
  //       arquivo: caminhoCompleto,
  //       nomeArquivo: nomeArquivo,
  //       tamanho: stats.size,
  //       dataGeracao: new Date().toISOString(),
  //       cpfCliente: cpfCliente,
  //       periodosProcessados: dadosAPI.periodosConsulta.length
  //     };

  //   } catch (error) {
  //     console.error(`❌ Erro na chamada da API para CPF ${cpfCliente}:`, error.message);

  //     let erroDetalhado = error.message;
  //     let statusCode = null;

  //     if (error.response) {
  //       statusCode = error.response.status;
  //       erroDetalhado = `HTTP ${statusCode}: ${error.message}`;

  //       // Tentar salvar resposta de erro se for texto
  //       if (error.response.data && typeof error.response.data === 'string') {
  //         const erroArquivo = path.join(this.pastaDocumento, `erro_api_${cpfCliente}_${Date.now()}.txt`);
  //         fs.writeFileSync(erroArquivo, error.response.data);
  //         // console.log(`📄 Resposta de erro salva em: ${erroArquivo}`);
  //       }
  //     }

  //     return {
  //       success: false,
  //       erro: erroDetalhado,
  //       statusCode: statusCode,
  //       cpfCliente: cpfCliente,
  //       arquivo: null
  //     };
  //   }
  // }

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
    const caminhoCompleto = path.join(this.pastaDocumento, nomeArquivo);

    // Log opcional para debug
    // console.dir(dadosAPI, { depth: null });

    // Fazer requisição POST
    const response = await axios.post(this.apiUrl, dadosAPI, {
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
    fs.writeFileSync(caminhoCompleto, buffer);

    const stats = fs.statSync(caminhoCompleto);

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

  async teste(req,res){
    try{
      return res.status(200).json({
        "msg": "dessu bossm"
      })

    }catch(e){
      return res.status.json({
        "msg": "teste"
      })
    }
  }

  // Já está funcionando.
  async searchBacen(req, res){
    try {

      // Inicializando a api do bacen
      const bacen = new ApiBacen();

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

  // Novo método para gerar gráfico de evolução das dívidas
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
      const bacen = new ApiBacen();
      const objeto = new Objetos();
      const geradorGrafico = new GeradorGrafico();

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

  // Subindo o documento no ploomes.
  async uploadToPloomes(req, res) {
    try {

      // 3) Retorna o resultado do Ploomes (Id/Url/ThumbUrl)
      return res.status(200).json({
        message: 'Upload realizado com sucesso!',
        ploomes: data,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      return res.status(500).json({
        error: 'Falha ao enviar imagem para o Ploomes',
        detail: err.response?.data || err.message,
      });
    }
  }

  // Versão otimizada com rate limiting para respeitar limite de 6 requisições simultâneas
  async storeOtimizado(req, res) {
    try {
      // console.log('🚀 Iniciando processamento otimizado com rate limiting...');

      // Inicializar a API do ploomes
      const deal = new CallOptions();

      // Realizar a captura dos dados no Ploomes
      const data = await deal.TakeDealOtherProperties();

      // Sistema de rate limiting - máximo 6 requisições simultâneas
      let requisiçõesAtivas = 0;
      const maxRequisiçõesSimultâneas = 6;
      const filaDeRequisições = [];

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

      // Processar deals em lotes de 2 para evitar sobrecarga
      const processarLoteDeals = async (loteDeals) => {
        // console.log(`📦 Processando lote de ${loteDeals.length} deals...`);

        const processarDeal = async (dealUser) => {
          // console.log('dealUser', dealUser)
          const { id, StageId, ContactId, otherProps } = dealUser;

          if(id == 802129740){
            return null
          }

          if(otherProps['deal_8202EECD-41FA-4AAD-9927-90105C5B9391'] == true){
          // console.log(`🔄 Processando Deal ${id}...`);

          // Inicializar APIs
          const ploomesDocumento = new ApiPloomesDocumento();
          const objeto = new Objetos();

          // Extrair CPFs dos tomadores
          const cpfCnpjTomadores = [
            otherProps['deal_E95722A2-7AAE-4EBE-B632-1C954764894C'] || otherProps['deal_304CA7AF-E8C8-4006-BC57-6D5FA653FEB5'],
            otherProps['deal_0C3DA592-AE6D-4DE2-A9B3-A8251CD08F00'] || otherProps['deal_A9AC9C2E-633A-480F-8689-C93D930F6847'],
            otherProps['deal_5B70C640-6C0C-48F6-ADA7-F7DE2F0A470D'] || otherProps['deal_AF1A346F-3AE9-428B-9FF9-A6317AC02FD3'],
            otherProps['deal_D8603767-5A19-46DC-9B88-2F000BD01096'] || otherProps['deal_98CF5047-B79D-43EC-89A8-EA4E6863A24D']
          ];

          // Processar tomadores sequencialmente para evitar rate limit
          const processarTomador = async (cpf, tomadorIndex) => {
            if (!cpf) return null;

            try {
              // console.log(`🔄 Processando tomador ${tomadorIndex + 1} - CPF: ${cpf}`);

              // Consulta ao Bacen (sem rate limiting - é API externa)
              const bacen = new ApiBacen();
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
                // console.log(`⚠️ Nenhum dado válido encontrado para CPF ${cpf}`);
                return null;
              }

              // Capturar dados das dívidas
              const retornoJson = objeto.capturandoDividas(dadosValidos);

              console.log(retornoJson.outrasDividas2Vencido)

              // Gerar gráfico (sem rate limiting - é processamento local)
              const dadosGrafico = objeto.processarDadosParaGrafico(dataBacen);
              if (dadosGrafico.length === 0) {
                // console.log(`⚠️ Dados insuficientes para gráfico do CPF ${cpf}`);
                return null;
              }

              const geradorGrafico = new GeradorGrafico();
              const resultadoGrafico = await geradorGrafico.gerarGraficoEvolucaoDividas(dadosGrafico, cpf);

              if (!resultadoGrafico.success) {
                // console.log(`❌ Erro ao gerar gráfico para CPF ${cpf}`);
                return null;
              }

              // Upload com rate limiting e retry
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
                    if (error.response?.status === 429 && i < tentativas - 1) {
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

              // Atualizar campo com rate limiting e retry
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
                    if (error.response?.status === 429 && i < tentativas - 1) {
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

              // console.log(`✅ Gráfico processado com sucesso para tomador ${tomadorIndex + 1}`);

              // Gerar Excel SCR via API (sem rate limiting - é processamento local)
              const geradorExcel = new APIGeradorExcelSCR();
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
                excelSCR: resultadoExcel?.success ? {
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
            if (resultado?.success && resultado.dadosDividas) {
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
          const sucessos = resultados.filter(r => r?.success).length;
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
      const totalTomadores = todosOsResultados.reduce((acc, r) => acc + (r?.totalTomadores || 0), 0);
      const totalSucessos = todosOsResultados.reduce((acc, r) => acc + (r?.sucessos || 0), 0);
      const totalExcelSCR = todosOsResultados.reduce((acc, r) => {
        if (r?.resultados) {
          return acc + r.resultados.filter(t => t?.excelSCR).length;
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

  // Endpoint de teste para gerar gráfico e enviar para Ploomes
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
      const bacen = new ApiBacen();
      const objeto = new Objetos();
      const geradorGrafico = new GeradorGrafico();
      const ploomesDocumento = new ApiPloomesDocumento();

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

export default new CadastroControllers();

export const uploadSingle = upload.single("file");
export const uploadMulti = upload.array("files", 20);

