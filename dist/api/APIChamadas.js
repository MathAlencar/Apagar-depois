"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _formdata = require('form-data'); var _formdata2 = _interopRequireDefault(_formdata);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv); // responsável por armazenar as variáveis de ambiente;
var _axiosjs = require('../service/axios.js');
var _metodosjs = require('../methods/metodos.js');

_dotenv2.default.config();

 class CallOptions{
    constructor(){}

    /**
     * Objetivo: Buscar deals do Ploomes com status e stage específicos, extraindo CPFs dos tomadores
     * Como funciona: Faz requisição GET para API do Ploomes com filtros de StatusId e StageId, expande OtherProperties para pegar campos customizados com CPFs dos 4 tomadores e flag de processado, e retorna array de deals formatados
     */
    async TakeDealOtherProperties() {
        try {
            // `/Deals?$select=Id,Title,StageId,StatusId&$expand=OtherProperties($filter=FieldKey eq 'deal_304CA7AF-E8C8-4006-BC57-6D5FA653FEB5')&$filter=StatusId eq 3 and StageId eq 185072 and Id eq 802048270`,
            // `/Deals?$select=Id,Title,StageId,StatusId,ContactId&$expand=OtherProperties($filter=FieldKey eq 'deal_304CA7AF-E8C8-4006-BC57-6D5FA653FEB5' and FieldKey eq 'deal_A9AC9C2E-633A-480F-8689-C93D930F6847' and FieldKey eq 'deal_AF1A346F-3AE9-428B-9FF9-A6317AC02FD3' and FieldKey eq 'deal_98CF5047-B79D-43EC-89A8-EA4E6863A24D')&$filter=StatusId eq 1 and StageId eq 185072`,

            // StatusId+eq+1+and+StageId+eq+185071 -> Caminho do SCR

            // Id's usados -> 802062421
            // Id's usados -> 802062337

            const url =
            `/Deals` +
            `?$select=Id,Title,StageId,StatusId,ContactId` +
            `&$expand=OtherProperties(` +
            `$filter=` +
            `FieldKey eq 'deal_304CA7AF-E8C8-4006-BC57-6D5FA653FEB5' or ` +

            `FieldKey eq 'deal_A9AC9C2E-633A-480F-8689-C93D930F6847' or ` +
            `FieldKey eq 'deal_AF1A346F-3AE9-428B-9FF9-A6317AC02FD3' or ` +
            `FieldKey eq 'deal_98CF5047-B79D-43EC-89A8-EA4E6863A24D' or ` +
            `FieldKey eq 'deal_8202EECD-41FA-4AAD-9927-90105C5B9391' or ` +

            `FieldKey eq 'deal_E95722A2-7AAE-4EBE-B632-1C954764894C' or ` +
            `FieldKey eq 'deal_0C3DA592-AE6D-4DE2-A9B3-A8251CD08F00' or ` +
            `FieldKey eq 'deal_5B70C640-6C0C-48F6-ADA7-F7DE2F0A470D' or ` +
            `FieldKey eq 'deal_D8603767-5A19-46DC-9B88-2F000BD01096' or ` +
            `FieldKey eq 'deal_CF20FE57-AC53-4620-ADAC-7E5BB998B1B8' or ` +
            `FieldKey eq 'deal_6428B433-76DF-439F-B2CD-A2E9F18B854C' or ` +

            // === PJ LTDA (1) a (10) ===
            `FieldKey eq 'deal_3C86C7F4-CC28-43AB-A211-1FC10E102D98' or ` +
            `FieldKey eq 'deal_986A2C8A-3A08-4009-9FB0-4A15C6CECCE0' or ` +
            `FieldKey eq 'deal_C92D2E5C-6001-40BB-A096-032669146910' or ` +
            `FieldKey eq 'deal_F810F8E0-5290-4CB1-A3F8-192EDD5C1FF0' or ` +
            `FieldKey eq 'deal_441B58BB-842D-400D-B1B6-DEC311742BC7' or ` +
            `FieldKey eq 'deal_2D0E193F-4DA4-4C34-A97C-82295C3E0F92' or ` +
            `FieldKey eq 'deal_FC93A750-9123-4F41-BD70-4063EAC22612' or ` +
            `FieldKey eq 'deal_6299BA58-9DBE-4396-A431-2322CA6EAE19' or ` +
            `FieldKey eq 'deal_38AC04A7-5258-4C6C-AFB8-E363D827052E' or ` +
            `FieldKey eq 'deal_1DC2AFA0-294D-4220-A66A-0C6B8F49DDB3' or ` +

            // Garantidor 1 ===
            `FieldKey eq 'deal_50673E76-8C32-48EB-ACB6-B8897DD60D7B' or ` +
            `FieldKey eq 'deal_49C9E291-E75F-4DAA-8AF3-0C53E70C4DD1' or ` +

            // Garantidor 2 ===
            `FieldKey eq 'deal_E3771332-4430-48C9-9AA8-5B84C2DEAA5C' or ` +
            `FieldKey eq 'deal_650C6DF1-BE94-4947-BED6-FB851A6793BE' or ` +

            // Garantidor 3 ===
            `FieldKey eq 'deal_74034139-270D-44FF-943B-AD2AFCD8C6A5' or ` +
            `FieldKey eq 'deal_7D09BAF8-3042-4917-A51B-F5A7C5E6C2CC'` +

            // // Garantidor 4 === ERRO
            // `FieldKey eq 'deal_BD082B4E-98C4-4F22-B9FF-37B507A198EA' or ` +
            // `FieldKey eq 'deal_081A4E2B-A486-48E6-9FA8-9FAB568E9603'` +

            `)` +
            `&$filter=StatusId eq 1 and StageId eq 185072`;

            const negocios = await _axiosjs.apiPloomes.get(url,
            {
                    headers: {
                    "Content-Type": "application/json",
                    "User-Key":
                        "661569F0F2BFBD31E9AC2AEE5B55C79F245AA394FAB35193A17D32654241CC4298F80D88A4C7C711FC1F2C7DCD6FBE147CB178B54213CB44E85895DAEC17BA18",
                    },
                }
            );

            const pickValue = (value) => {
              if (value.FieldKey === 'deal_8202EECD-41FA-4AAD-9927-90105C5B9391') {
                return value.BoolValue;
              }

              if (value.FieldKey === 'deal_CF20FE57-AC53-4620-ADAC-7E5BB998B1B8') {
                return value.ObjectValueName;
              }

              return value.StringValue;
            };

            const dados = negocios.data.value.map(deal => ({
              id: deal.Id,
              titulo: deal.Title,
              StageId: deal.StageId,
              ContactId: deal.ContactId,
              otherProps: Object.fromEntries(
                (deal.OtherProperties || []).map(value => ([
                  value.FieldKey,
                  pickValue(value)
                ]))
              )
            }));

            // lista das chaves que você quer capturar
            // const fieldKeys = [
            // "deal_304CA7AF-E8C8-4006-BC57-6D5FA653FEB5", // Tomador 1 - CPF
            // "deal_A9AC9C2E-633A-480F-8689-C93D930F6847", // Tomador 2 - CPF
            // "deal_AF1A346F-3AE9-428B-9FF9-A6317AC02FD3", // Tomador 3 - CPF
            // "deal_98CF5047-B79D-43EC-89A8-EA4E6863A24D", // Tomador 4 - CPF
            // ];

            return dados;
        } catch (error) {
            if (error.response) {
            console.error("Erro API: ", error.response.data);
            } else {
            console.error("Erro geral: ", error.message);
            }
        }
    }

    /**
     * Objetivo: Atualizar todos os campos de dívidas de um deal no Ploomes
     * Como funciona: Monta um objeto com OtherProperties contendo todos os campos de dívidas (vencido e a vencer) para os 4 tomadores, marca o deal como não processado, e faz requisição PATCH para atualizar o deal
     */
    async UpdateData(id, ContactId, StageId, Dividas, populacao){
        try {

            const body = {
                ContactId,
                StageId,
                "OtherProperties": [

                    // --- Processado 📌 --- //
                    { "FieldKey": "deal_8202EECD-41FA-4AAD-9927-90105C5B9391", "BoolValue": false },
                    { "FieldKey": "deal_6428B433-76DF-439F-B2CD-A2E9F18B854C", "StringValue": populacao },

                    // --- Prujuizo 📌 --- //
                    { "FieldKey": "deal_EB570764-56BF-4F80-82A4-029F5B8630D6", "DecimalValue":  _optionalChain([Dividas, 'access', _ => _[0], 'optionalAccess', _2 => _2.prejuizo]) }, // T1
                    { "FieldKey": "deal_B2AAB212-2129-4BCD-8658-B07120DE2004", "DecimalValue":  _optionalChain([Dividas, 'access', _3 => _3[1], 'optionalAccess', _4 => _4.prejuizo])}, // T2
                    { "FieldKey": "deal_85965CB4-1477-4485-A70A-F92ACA44EC0A", "DecimalValue":  _optionalChain([Dividas, 'access', _5 => _5[2], 'optionalAccess', _6 => _6.prejuizo])}, // T3
                    { "FieldKey": "deal_EEE716AB-A54E-4943-A9F1-C658448EF650", "DecimalValue":  _optionalChain([Dividas, 'access', _7 => _7[3], 'optionalAccess', _8 => _8.prejuizo])}, // T4

                    // Vencido - 📌 Crédito Rotativo
                    { "FieldKey": "deal_4B942F11-48E8-4774-9035-439CBD87E78E", "DecimalValue":  _optionalChain([Dividas, 'access', _9 => _9[0], 'optionalAccess', _10 => _10.creditoRotativoVencido]) }, // T1
                    { "FieldKey": "deal_9324CA51-D67C-4D41-97F7-9B09A5E6818E", "DecimalValue":  _optionalChain([Dividas, 'access', _11 => _11[1], 'optionalAccess', _12 => _12.creditoRotativoVencido])}, // T2
                    { "FieldKey": "deal_9312E20F-7435-4D6C-99DD-3DB34636F8E2", "DecimalValue":  _optionalChain([Dividas, 'access', _13 => _13[2], 'optionalAccess', _14 => _14.creditoRotativoVencido])}, // T3
                    { "FieldKey": "deal_831001E6-730C-4CD3-9AFC-6E8F0C0339FE", "DecimalValue":  _optionalChain([Dividas, 'access', _15 => _15[3], 'optionalAccess', _16 => _16.creditoRotativoVencido])}, // T4

                    // Vencido - 📌 Home Equity
                    { "FieldKey": "deal_848862F8-6865-4DB0-A4B3-94719F912869", "DecimalValue": _optionalChain([Dividas, 'access', _17 => _17[0], 'optionalAccess', _18 => _18.homeEquityVencido]) }, // T1
                    { "FieldKey": "deal_59C5F566-661D-46B6-8072-4A2A21038837", "DecimalValue": _optionalChain([Dividas, 'access', _19 => _19[1], 'optionalAccess', _20 => _20.homeEquityVencido]) }, // T2
                    { "FieldKey": "deal_301B23F8-01E2-401F-997A-4CEE03E33054", "DecimalValue": _optionalChain([Dividas, 'access', _21 => _21[2], 'optionalAccess', _22 => _22.homeEquityVencido]) }, // T3
                    { "FieldKey": "deal_23C889D8-CCC6-4294-B94D-55D5F51A056D", "DecimalValue": _optionalChain([Dividas, 'access', _23 => _23[3], 'optionalAccess', _24 => _24.homeEquityVencido]) }, // T4

                    // Vencido - 📌 Cartão de Crédito
                    { "FieldKey": "deal_33F74537-F463-4F46-B602-7F85C20A20AB", "DecimalValue": _optionalChain([Dividas, 'access', _25 => _25[0], 'optionalAccess', _26 => _26.cartaoCreditoVencido]) }, // T1
                    { "FieldKey": "deal_14D0DDCE-01B9-4446-A4EF-6DF3F53B0A60", "DecimalValue": _optionalChain([Dividas, 'access', _27 => _27[1], 'optionalAccess', _28 => _28.cartaoCreditoVencido]) }, // T2
                    { "FieldKey": "deal_FD42CBBE-9808-4596-B2BD-0D23A1997E9C", "DecimalValue": _optionalChain([Dividas, 'access', _29 => _29[2], 'optionalAccess', _30 => _30.cartaoCreditoVencido]) }, // T3
                    { "FieldKey": "deal_68289BF7-1B84-47A4-A535-B42E36108ACB", "DecimalValue": _optionalChain([Dividas, 'access', _31 => _31[3], 'optionalAccess', _32 => _32.cartaoCreditoVencido]) }, // T4

                    // Vencido - 📌 Cartão de Crédito Não Migrado
                    { "FieldKey": "deal_EF52D7B0-A314-4946-AD1B-800ECED8EC8D", "DecimalValue": _optionalChain([Dividas, 'access', _33 => _33[0], 'optionalAccess', _34 => _34.cartaoCreditoNaoMigradoVencido]) }, // T1
                    { "FieldKey": "deal_0EC24AB4-4D25-4156-BA30-99D0F043E867", "DecimalValue": _optionalChain([Dividas, 'access', _35 => _35[1], 'optionalAccess', _36 => _36.cartaoCreditoNaoMigradoVencido]) }, // T2
                    { "FieldKey": "deal_1AF63BC3-04DE-401F-A4C7-3AFA48CFC0BA", "DecimalValue": _optionalChain([Dividas, 'access', _37 => _37[2], 'optionalAccess', _38 => _38.cartaoCreditoNaoMigradoVencido]) }, // T3
                    { "FieldKey": "deal_6DBB90CC-F49E-4669-9E94-966240D0A782", "DecimalValue": _optionalChain([Dividas, 'access', _39 => _39[3], 'optionalAccess', _40 => _40.cartaoCreditoNaoMigradoVencido]) }, // T4

                    // Vencido - 📌 Crédito Pessoal Consignado
                    { "FieldKey": "deal_2644138C-4569-41CF-B915-BC9E31141C3A", "DecimalValue": _optionalChain([Dividas, 'access', _41 => _41[0], 'optionalAccess', _42 => _42.creditoPessoalConsignadoVencido]) }, // T1
                    { "FieldKey": "deal_DE5F73C4-890A-42D3-840A-47B26807D0F7", "DecimalValue": _optionalChain([Dividas, 'access', _43 => _43[1], 'optionalAccess', _44 => _44.creditoPessoalConsignadoVencido]) }, // T2
                    { "FieldKey": "deal_7719C0A6-21D4-4F81-B235-5E18BF67D434", "DecimalValue": _optionalChain([Dividas, 'access', _45 => _45[2], 'optionalAccess', _46 => _46.creditoPessoalConsignadoVencido]) }, // T3
                    { "FieldKey": "deal_7A72857F-25C7-4592-B251-C3F14CF7EC4D", "DecimalValue": _optionalChain([Dividas, 'access', _47 => _47[3], 'optionalAccess', _48 => _48.creditoPessoalConsignadoVencido]) }, // T4

                    // Vencido - 📌 Crédito pessoal Sem Consignação
                    { "FieldKey": "deal_D624D642-CFD4-47FC-B976-62CB67042B92", "DecimalValue": _optionalChain([Dividas, 'access', _49 => _49[0], 'optionalAccess', _50 => _50.creditoPessoalSemConsignacaoVencido]) }, // T1
                    { "FieldKey": "deal_E30F041A-5476-4ACD-A691-03AE542C5A9D", "DecimalValue": _optionalChain([Dividas, 'access', _51 => _51[1], 'optionalAccess', _52 => _52.creditoPessoalSemConsignacaoVencido]) }, // T2
                    { "FieldKey": "deal_E5602153-55F2-4030-8011-7CB03C8EF99F", "DecimalValue": _optionalChain([Dividas, 'access', _53 => _53[2], 'optionalAccess', _54 => _54.creditoPessoalSemConsignacaoVencido]) }, // T3
                    { "FieldKey": "deal_19ED8D4B-8E96-4EF2-A2A8-67818CA285E8", "DecimalValue": _optionalChain([Dividas, 'access', _55 => _55[3], 'optionalAccess', _56 => _56.creditoPessoalSemConsignacaoVencido]) }, // T4

                    // Vencido - 📌 Capital de Giro
                    { "FieldKey": "deal_048BFB80-8129-4FED-9EC1-5183B4848D1F", "DecimalValue": _optionalChain([Dividas, 'access', _57 => _57[0], 'optionalAccess', _58 => _58.capitalDeGiroVencido]) }, // T1
                    { "FieldKey": "deal_FF77E0B6-EAF5-4107-88C6-661548921321", "DecimalValue": _optionalChain([Dividas, 'access', _59 => _59[1], 'optionalAccess', _60 => _60.capitalDeGiroVencido]) }, // T2
                    { "FieldKey": "deal_A00A0B58-F72B-44F9-8901-9177044C53C9", "DecimalValue": _optionalChain([Dividas, 'access', _61 => _61[2], 'optionalAccess', _62 => _62.capitalDeGiroVencido]) }, // T3
                    { "FieldKey": "deal_7F16D88F-03AF-476F-8FA2-6132D092DD3D", "DecimalValue": _optionalChain([Dividas, 'access', _63 => _63[3], 'optionalAccess', _64 => _64.capitalDeGiroVencido]) }, // T4

                    // Vencido - 📌 Aquisição de Bens
                    { "FieldKey": "deal_60A074AF-8652-4049-8148-9AC9BDD6D256", "DecimalValue": _optionalChain([Dividas, 'access', _65 => _65[0], 'optionalAccess', _66 => _66.aquisicaoDeBensVencido]) }, // T1
                    { "FieldKey": "deal_47ABEEC8-855A-4C72-BB7E-23297FBF49E4", "DecimalValue": _optionalChain([Dividas, 'access', _67 => _67[1], 'optionalAccess', _68 => _68.aquisicaoDeBensVencido]) }, // T2
                    { "FieldKey": "deal_7BBBA3DC-36E8-4F4B-A7D3-2D8BED2706F3", "DecimalValue": _optionalChain([Dividas, 'access', _69 => _69[2], 'optionalAccess', _70 => _70.aquisicaoDeBensVencido]) }, // T3
                    { "FieldKey": "deal_5E0C935D-431E-46D9-9DD6-3941CE9C0121", "DecimalValue": _optionalChain([Dividas, 'access', _71 => _71[3], 'optionalAccess', _72 => _72.aquisicaoDeBensVencido]) }, // T4

                    // Vencido - 📌 Cheque Especial
                    { "FieldKey": "deal_25ED6299-AB09-430D-A3EA-C89ACFA55F70", "DecimalValue": _optionalChain([Dividas, 'access', _73 => _73[0], 'optionalAccess', _74 => _74.chequeEspecialVencido]) }, // T1
                    { "FieldKey": "deal_7FE80583-FB6A-4EE6-B9CD-F9466C03DF2F", "DecimalValue": _optionalChain([Dividas, 'access', _75 => _75[1], 'optionalAccess', _76 => _76.chequeEspecialVencido]) }, // T2
                    { "FieldKey": "deal_27532060-B97A-4B22-A493-531DB099628B", "DecimalValue": _optionalChain([Dividas, 'access', _77 => _77[2], 'optionalAccess', _78 => _78.chequeEspecialVencido]) }, // T3
                    { "FieldKey": "deal_849BEDEC-953E-4143-B0BD-E758DB65AA8F", "DecimalValue": _optionalChain([Dividas, 'access', _79 => _79[3], 'optionalAccess', _80 => _80.chequeEspecialVencido]) }, // T4

                    // Vencido - 📌 Financiamento Habitacional
                    { "FieldKey": "deal_CF12D321-747B-4373-A624-B5BA9A3B7953", "DecimalValue": _optionalChain([Dividas, 'access', _81 => _81[0], 'optionalAccess', _82 => _82.financiamentoHabitacionalVencido]) }, // T1
                    { "FieldKey": "deal_BD72432A-681D-4A62-967C-A41F9088BDF4", "DecimalValue": _optionalChain([Dividas, 'access', _83 => _83[1], 'optionalAccess', _84 => _84.financiamentoHabitacionalVencido]) }, // T2
                    { "FieldKey": "deal_E922EF4D-A7F1-46CA-8D21-F332430EF3D9", "DecimalValue": _optionalChain([Dividas, 'access', _85 => _85[2], 'optionalAccess', _86 => _86.financiamentoHabitacionalVencido]) }, // T3
                    { "FieldKey": "deal_3058AD78-D29B-4F9E-AFFB-864E33317AD4", "DecimalValue": _optionalChain([Dividas, 'access', _87 => _87[3], 'optionalAccess', _88 => _88.financiamentoHabitacionalVencido]) }, // T4

                    // Vencido - 📌 Rural
                    { "FieldKey": "deal_5DF16B4F-06E3-4B92-8C29-E99C95CD8552", "DecimalValue": _optionalChain([Dividas, 'access', _89 => _89[0], 'optionalAccess', _90 => _90.ruralVencido]) }, // T1
                    { "FieldKey": "deal_E0F6877F-3CF0-4D7A-986B-6C523C028A3C", "DecimalValue": _optionalChain([Dividas, 'access', _91 => _91[1], 'optionalAccess', _92 => _92.ruralVencido]) }, // T2
                    { "FieldKey": "deal_AF8C528B-3300-410F-A919-18608DBE5E8D", "DecimalValue": _optionalChain([Dividas, 'access', _93 => _93[2], 'optionalAccess', _94 => _94.ruralVencido]) }, // T3
                    { "FieldKey": "deal_C9C0CBE4-147A-403F-9AC3-CA1775719745", "DecimalValue": _optionalChain([Dividas, 'access', _95 => _95[3], 'optionalAccess', _96 => _96.ruralVencido]) }, // T4

                    // Vencido - 📌 Outros empréstimos
                    { "FieldKey": "deal_C81B39E1-5185-44FA-875A-A0508D25ECA4", "DecimalValue": _optionalChain([Dividas, 'access', _97 => _97[0], 'optionalAccess', _98 => _98.outrosEmprestimosVencido]) }, // T1
                    { "FieldKey": "deal_D573EE26-B8F7-4AB2-8D09-7ED222F3DC9B", "DecimalValue": _optionalChain([Dividas, 'access', _99 => _99[1], 'optionalAccess', _100 => _100.outrosEmprestimosVencido]) }, // T2
                    { "FieldKey": "deal_5E00282B-438C-48A3-BDD3-3233CBF6B548", "DecimalValue": _optionalChain([Dividas, 'access', _101 => _101[2], 'optionalAccess', _102 => _102.outrosEmprestimosVencido]) }, // T3
                    { "FieldKey": "deal_F010E0C4-075F-47FE-B5F5-3DB76D7BB06C", "DecimalValue": _optionalChain([Dividas, 'access', _103 => _103[3], 'optionalAccess', _104 => _104.outrosEmprestimosVencido]) }, // T4

                    // Vencido - 📌 Outras Dívidas 1
                    { "FieldKey": "deal_1B64F80E-CF22-42EB-B51C-B772D722ABF9", "DecimalValue": _optionalChain([Dividas, 'access', _105 => _105[0], 'optionalAccess', _106 => _106.outrasDividas1Vencido]) }, // T1
                    { "FieldKey": "deal_22C781E8-D9AB-4758-8B76-12103DAD0558", "DecimalValue": _optionalChain([Dividas, 'access', _107 => _107[1], 'optionalAccess', _108 => _108.outrasDividas1Vencido]) }, // T2
                    { "FieldKey": "deal_0E1824B1-362D-434C-A563-1C94148C3626", "DecimalValue": _optionalChain([Dividas, 'access', _109 => _109[2], 'optionalAccess', _110 => _110.outrasDividas1Vencido]) }, // T3
                    { "FieldKey": "deal_C0734B30-B18A-46B1-9CDB-9F95BD81EA17", "DecimalValue": _optionalChain([Dividas, 'access', _111 => _111[3], 'optionalAccess', _112 => _112.outrasDividas1Vencido]) }, // T4

                    // Vencido - 📌 Outras Dívidas 2
                    { "FieldKey": "deal_67769EFE-78D8-4504-8EB0-37E41B8EE4FB", "DecimalValue": _optionalChain([Dividas, 'access', _113 => _113[0], 'optionalAccess', _114 => _114.outrasDividas2Vencido]) }, // T1
                    { "FieldKey": "deal_A6B5EB1E-63BB-4C03-A3D4-D250C87494D7", "DecimalValue": _optionalChain([Dividas, 'access', _115 => _115[1], 'optionalAccess', _116 => _116.outrasDividas2Vencido]) }, // T2
                    { "FieldKey": "deal_24896DE8-EA25-45DA-87EE-8A878DA0B294", "DecimalValue": _optionalChain([Dividas, 'access', _117 => _117[2], 'optionalAccess', _118 => _118.outrasDividas2Vencido]) }, // T3
                    { "FieldKey": "deal_BC81F924-79A4-441E-86AA-05C673106CBB", "DecimalValue": _optionalChain([Dividas, 'access', _119 => _119[3], 'optionalAccess', _120 => _120.outrasDividas2Vencido]) }, // T4

                    // Vencido - 📌 Total
                    { "FieldKey": "deal_FD06662F-48F1-42D8-82CF-794B5C13A79C", "DecimalValue": _optionalChain([Dividas, 'access', _121 => _121[0], 'optionalAccess', _122 => _122.totalVencido]) }, // T1
                    { "FieldKey": "deal_7F0B27BE-4982-4392-B21F-219D6B9D75D6", "DecimalValue": _optionalChain([Dividas, 'access', _123 => _123[1], 'optionalAccess', _124 => _124.totalVencido]) }, // T2
                    { "FieldKey": "deal_D6AC8B4B-7389-4DE4-B542-40609BC9A0A6", "DecimalValue": _optionalChain([Dividas, 'access', _125 => _125[2], 'optionalAccess', _126 => _126.totalVencido]) }, // T3
                    { "FieldKey": "deal_9D81A981-1871-4335-88E9-84CF98ABD9D0", "DecimalValue": _optionalChain([Dividas, 'access', _127 => _127[3], 'optionalAccess', _128 => _128.totalVencido]) }, // T4

                    // --- A Vencer --- //

                    // A vencer - 📌 Crédito Rotativo
                    { "FieldKey": "deal_460035FA-7829-4DDB-B3F4-4F9D7DDA42DF", "DecimalValue": _optionalChain([Dividas, 'access', _129 => _129[0], 'optionalAccess', _130 => _130.creditoRotativoAVencer])},  // T1
                    { "FieldKey": "deal_BFA0B3E0-2B57-4EF0-A4DA-160FEA4AAFD3", "DecimalValue": _optionalChain([Dividas, 'access', _131 => _131[1], 'optionalAccess', _132 => _132.creditoRotativoAVencer])},  // T2
                    { "FieldKey": "deal_75A83094-FF30-4E1D-92B7-630098104FAC", "DecimalValue": _optionalChain([Dividas, 'access', _133 => _133[2], 'optionalAccess', _134 => _134.creditoRotativoAVencer])},  // T3
                    { "FieldKey": "deal_A6DDF1CF-60C3-46F7-B7A6-6B177EFB3CFB", "DecimalValue": _optionalChain([Dividas, 'access', _135 => _135[3], 'optionalAccess', _136 => _136.creditoRotativoAVencer])},  // T4

                    // A vencer - 📌 Home Equity
                    { "FieldKey": "deal_1059F356-BD3A-464D-8646-846F38B2F518", "DecimalValue": _optionalChain([Dividas, 'access', _137 => _137[0], 'optionalAccess', _138 => _138.homeEquityAVencer])},  // T1
                    { "FieldKey": "deal_B7A38DC4-59BA-4AAF-906E-37C0C708D4C9", "DecimalValue": _optionalChain([Dividas, 'access', _139 => _139[1], 'optionalAccess', _140 => _140.homeEquityAVencer])},  // T2
                    { "FieldKey": "deal_8DE1D39A-7237-49FE-BE01-81D2DA8DC64B", "DecimalValue": _optionalChain([Dividas, 'access', _141 => _141[2], 'optionalAccess', _142 => _142.homeEquityAVencer])},  // T3
                    { "FieldKey": "deal_9F6AB580-A8B2-4E15-B5E8-DF7B6C0D0E19", "DecimalValue": _optionalChain([Dividas, 'access', _143 => _143[3], 'optionalAccess', _144 => _144.homeEquityAVencer])},  // T4

                    // A vencer - 📌 Cartão de Crédito
                    { "FieldKey": "deal_CEFB48C8-3D3E-4D0B-A5BC-654441FC8835", "DecimalValue": _optionalChain([Dividas, 'access', _145 => _145[0], 'optionalAccess', _146 => _146.cartaoCreditoAVencer])},  // T1
                    { "FieldKey": "deal_05D43BE7-2D33-42B0-97F2-41BEF57A3D6B", "DecimalValue": _optionalChain([Dividas, 'access', _147 => _147[1], 'optionalAccess', _148 => _148.cartaoCreditoAVencer])},  // T2
                    { "FieldKey": "deal_4F53531D-B3EA-4A0D-BDD4-9031E6CF72D6", "DecimalValue": _optionalChain([Dividas, 'access', _149 => _149[2], 'optionalAccess', _150 => _150.cartaoCreditoAVencer])},  // T3
                    { "FieldKey": "deal_953E35DA-AA7D-4591-A49B-8788B5BD51AC", "DecimalValue": _optionalChain([Dividas, 'access', _151 => _151[3], 'optionalAccess', _152 => _152.cartaoCreditoAVencer])},  // T4

                    // A vencer - 📌 Cartão de Crédito Não Migrado
                    { "FieldKey": "deal_178C9C9D-97EA-4EFE-A9CC-DBF7234DFA00", "DecimalValue": _optionalChain([Dividas, 'access', _153 => _153[0], 'optionalAccess', _154 => _154.cartaoCreditoNaoMigradoAVencer])},  // T1
                    { "FieldKey": "deal_1FD0721A-B04F-45D3-9725-7AD4D140668F", "DecimalValue": _optionalChain([Dividas, 'access', _155 => _155[1], 'optionalAccess', _156 => _156.cartaoCreditoNaoMigradoAVencer])},  // T2
                    { "FieldKey": "deal_AC351864-DB92-4C55-B777-0A94297349A2", "DecimalValue": _optionalChain([Dividas, 'access', _157 => _157[2], 'optionalAccess', _158 => _158.cartaoCreditoNaoMigradoAVencer])},  // T3
                    { "FieldKey": "deal_D00F9C9D-D273-4C1A-A6FA-2A5CC385294F", "DecimalValue": _optionalChain([Dividas, 'access', _159 => _159[3], 'optionalAccess', _160 => _160.cartaoCreditoNaoMigradoAVencer])},  // T4

                    // A vencer - 📌 Crédito Pessoal Consignado
                    { "FieldKey": "deal_597D52D0-9A28-4977-ADDA-620210A00CB3", "DecimalValue": _optionalChain([Dividas, 'access', _161 => _161[0], 'optionalAccess', _162 => _162.creditoPessoalConsignadoAVencer])},  // T1
                    { "FieldKey": "deal_8B3BC352-F1ED-4627-A862-93704A44C63F", "DecimalValue": _optionalChain([Dividas, 'access', _163 => _163[1], 'optionalAccess', _164 => _164.creditoPessoalConsignadoAVencer])},  // T2
                    { "FieldKey": "deal_4CDD88F1-5394-49F4-A5C3-9965B1990944", "DecimalValue": _optionalChain([Dividas, 'access', _165 => _165[2], 'optionalAccess', _166 => _166.creditoPessoalConsignadoAVencer])},  // T3
                    { "FieldKey": "deal_82346992-A0B2-4111-876C-13D9EA449AEF", "DecimalValue": _optionalChain([Dividas, 'access', _167 => _167[3], 'optionalAccess', _168 => _168.creditoPessoalConsignadoAVencer])},  // T4

                    // A vencer - 📌 Crédito pessoal Sem Consignação
                    { "FieldKey": "deal_1E4239D7-2A13-4A72-ACA9-78DF08AF1A63", "DecimalValue": _optionalChain([Dividas, 'access', _169 => _169[0], 'optionalAccess', _170 => _170.creditoPessoalSemConsignacaoAVencer])},  // T1
                    { "FieldKey": "deal_E91E8903-4DAB-4C9E-A87F-48CE24237789", "DecimalValue": _optionalChain([Dividas, 'access', _171 => _171[1], 'optionalAccess', _172 => _172.creditoPessoalSemConsignacaoAVencer])},  // T2
                    { "FieldKey": "deal_C612EBB1-9CA7-4699-8150-AFC3CCE19603", "DecimalValue": _optionalChain([Dividas, 'access', _173 => _173[2], 'optionalAccess', _174 => _174.creditoPessoalSemConsignacaoAVencer])},  // T3
                    { "FieldKey": "deal_B5961F12-C2BC-4B34-9182-246AC819F1A5", "DecimalValue": _optionalChain([Dividas, 'access', _175 => _175[3], 'optionalAccess', _176 => _176.creditoPessoalSemConsignacaoAVencer])},  // T4

                    // A vencer - 📌 Capital de Giro
                    { "FieldKey": "deal_3F638E28-EBB4-4DD9-A6C5-8434FE88B397", "DecimalValue": _optionalChain([Dividas, 'access', _177 => _177[0], 'optionalAccess', _178 => _178.capitalDeGiroAVencer])},  // T1
                    { "FieldKey": "deal_A495FEBF-39F5-44D6-AAAC-53B634FDDFC3", "DecimalValue": _optionalChain([Dividas, 'access', _179 => _179[1], 'optionalAccess', _180 => _180.capitalDeGiroAVencer])},  // T2
                    { "FieldKey": "deal_C0010757-DE1B-49BF-B1BA-4A68BC768128", "DecimalValue": _optionalChain([Dividas, 'access', _181 => _181[2], 'optionalAccess', _182 => _182.capitalDeGiroAVencer])},  // T3
                    { "FieldKey": "deal_59727161-A52A-4284-99A4-B34978A121E3", "DecimalValue": _optionalChain([Dividas, 'access', _183 => _183[3], 'optionalAccess', _184 => _184.capitalDeGiroAVencer])},  // T4

                    // A vencer - 📌 Aquisição de Bens
                    { "FieldKey": "deal_8C12F0CC-48C6-4C6B-9F06-9DC06E2A53D7", "DecimalValue": _optionalChain([Dividas, 'access', _185 => _185[0], 'optionalAccess', _186 => _186.aquisicaoDeBensAVencer])},  // T1
                    { "FieldKey": "deal_D5A5BF1B-E6ED-4579-99D8-05FE7FFC9256", "DecimalValue": _optionalChain([Dividas, 'access', _187 => _187[1], 'optionalAccess', _188 => _188.aquisicaoDeBensAVencer])},  // T2
                    { "FieldKey": "deal_23D3088D-F2D4-4C83-85F5-E336A93EBB1A", "DecimalValue": _optionalChain([Dividas, 'access', _189 => _189[2], 'optionalAccess', _190 => _190.aquisicaoDeBensAVencer])},  // T3
                    { "FieldKey": "deal_9DC0AE0E-2056-4C60-A222-9EF6BC35814F", "DecimalValue": _optionalChain([Dividas, 'access', _191 => _191[3], 'optionalAccess', _192 => _192.aquisicaoDeBensAVencer])},  // T4

                    // A vencer - 📌 Cheque Especial
                    { "FieldKey": "deal_8E818AD0-1E1B-4890-9B12-87F9F7CCC98C", "DecimalValue": _optionalChain([Dividas, 'access', _193 => _193[0], 'optionalAccess', _194 => _194.chequeEspecialAVencer])},  // T1
                    { "FieldKey": "deal_584754BD-A354-4900-B54C-CC2B58FCFF1A", "DecimalValue": _optionalChain([Dividas, 'access', _195 => _195[1], 'optionalAccess', _196 => _196.chequeEspecialAVencer])},  // T2
                    { "FieldKey": "deal_6552393A-8A37-489A-AC3D-372ABCD9FC4B", "DecimalValue": _optionalChain([Dividas, 'access', _197 => _197[2], 'optionalAccess', _198 => _198.chequeEspecialAVencer])},  // T3
                    { "FieldKey": "deal_6873023B-F7C8-4B2A-9FC8-615C5F3EB168", "DecimalValue": _optionalChain([Dividas, 'access', _199 => _199[3], 'optionalAccess', _200 => _200.chequeEspecialAVencer])},  // T4

                    // A vencer - 📌 Financiamento Habitacional
                    { "FieldKey": "deal_8F7E07AE-AE4B-4851-92BE-67D6B15BCDE3", "DecimalValue": _optionalChain([Dividas, 'access', _201 => _201[0], 'optionalAccess', _202 => _202.financiamentoHabitacionalAVencer])},  // T1
                    { "FieldKey": "deal_BD8D690C-BA64-4B1D-8427-340580B86823", "DecimalValue": _optionalChain([Dividas, 'access', _203 => _203[1], 'optionalAccess', _204 => _204.financiamentoHabitacionalAVencer])},  // T2
                    { "FieldKey": "deal_75D1C003-6CE3-4EB0-BDD5-7AFB141FD6CD", "DecimalValue": _optionalChain([Dividas, 'access', _205 => _205[2], 'optionalAccess', _206 => _206.financiamentoHabitacionalAVencer])},  // T3
                    { "FieldKey": "deal_4B93253F-8B87-4F76-B91E-5D9839056C93", "DecimalValue": _optionalChain([Dividas, 'access', _207 => _207[3], 'optionalAccess', _208 => _208.financiamentoHabitacionalAVencer])},  // T4

                    // A vencer - 📌 Rural
                    { "FieldKey": "deal_E2D05635-366D-43DC-8C61-65DD4C69DF9A", "DecimalValue": _optionalChain([Dividas, 'access', _209 => _209[0], 'optionalAccess', _210 => _210.ruralAVencer])},  // T1
                    { "FieldKey": "deal_5ECB84BC-81A7-4B2B-968E-B5A90E0A1E96", "DecimalValue": _optionalChain([Dividas, 'access', _211 => _211[1], 'optionalAccess', _212 => _212.ruralAVencer])},  // T2
                    { "FieldKey": "deal_58D62B09-42C4-4F0E-BC7B-A122AE064B10", "DecimalValue": _optionalChain([Dividas, 'access', _213 => _213[2], 'optionalAccess', _214 => _214.ruralAVencer])},  // T3
                    { "FieldKey": "deal_93702AE6-73EE-473B-87A7-0880486CBAA7", "DecimalValue": _optionalChain([Dividas, 'access', _215 => _215[3], 'optionalAccess', _216 => _216.ruralAVencer])},  // T4

                    // A vencer - 📌 Outros empréstimos
                    { "FieldKey": "deal_011325EA-2A24-48D7-B9B3-CDE81A22681F", "DecimalValue": _optionalChain([Dividas, 'access', _217 => _217[0], 'optionalAccess', _218 => _218.outrosEmprestimosAVencer])},  // T1
                    { "FieldKey": "deal_C0047C3A-4C00-40B9-909F-C3F9FAFB8CBF", "DecimalValue": _optionalChain([Dividas, 'access', _219 => _219[1], 'optionalAccess', _220 => _220.outrosEmprestimosAVencer])},  // T2
                    { "FieldKey": "deal_F3CFB3EC-E8C8-452C-BD32-4D932F29F7FD", "DecimalValue": _optionalChain([Dividas, 'access', _221 => _221[2], 'optionalAccess', _222 => _222.outrosEmprestimosAVencer])},  // T3
                    { "FieldKey": "deal_D71A78F6-1928-4079-A0D2-9ECC81607083", "DecimalValue": _optionalChain([Dividas, 'access', _223 => _223[3], 'optionalAccess', _224 => _224.outrosEmprestimosAVencer])},  // T4

                    // A vencer - 📌 Outras Dívidas 1
                    { "FieldKey": "deal_42E4C01E-7138-4F4B-AC12-CB1D5A299BE8", "DecimalValue": _optionalChain([Dividas, 'access', _225 => _225[0], 'optionalAccess', _226 => _226.outrasDividas1AVencer])},  // T1
                    { "FieldKey": "deal_A50FDEEA-3801-4387-B3BE-3CFEFE78B63A", "DecimalValue": _optionalChain([Dividas, 'access', _227 => _227[1], 'optionalAccess', _228 => _228.outrasDividas1AVencer])},  // T2
                    { "FieldKey": "deal_BE821482-BC02-4599-8FFB-0958E30C99DD", "DecimalValue": _optionalChain([Dividas, 'access', _229 => _229[2], 'optionalAccess', _230 => _230.outrasDividas1AVencer])},  // T3
                    { "FieldKey": "deal_856185E5-5E5F-43DC-B5B1-C2EC074D42D4", "DecimalValue": _optionalChain([Dividas, 'access', _231 => _231[3], 'optionalAccess', _232 => _232.outrasDividas1AVencer])},  // T4

                    // A vencer - 📌 Outras Dívidas 2
                    { "FieldKey": "deal_1713BD8C-A07F-4796-B32B-E0C30BFD1037", "DecimalValue": _optionalChain([Dividas, 'access', _233 => _233[0], 'optionalAccess', _234 => _234.outrasDividas2AVencer])},  // T1
                    { "FieldKey": "deal_8BA3362A-AA53-4529-9F2D-0B8811BC2373", "DecimalValue": _optionalChain([Dividas, 'access', _235 => _235[1], 'optionalAccess', _236 => _236.outrasDividas2AVencer])},  // T2
                    { "FieldKey": "deal_0856A710-EA01-445C-B5EF-C330A143392F", "DecimalValue": _optionalChain([Dividas, 'access', _237 => _237[2], 'optionalAccess', _238 => _238.outrasDividas2AVencer])},  // T3
                    { "FieldKey": "deal_B96E4E0A-24C2-414F-95E6-9B202EB4A657", "DecimalValue": _optionalChain([Dividas, 'access', _239 => _239[3], 'optionalAccess', _240 => _240.outrasDividas2AVencer])},  // T4

                    // A vencer - 📌 Total
                    { "FieldKey": "deal_52B811D5-A209-49D2-AC0B-D3F599D23869", "DecimalValue": _optionalChain([Dividas, 'access', _241 => _241[0], 'optionalAccess', _242 => _242.totalAVencer])},  // T1
                    { "FieldKey": "deal_5EC4DAA7-9D43-4610-B6E1-5636141EB3E7", "DecimalValue": _optionalChain([Dividas, 'access', _243 => _243[1], 'optionalAccess', _244 => _244.totalAVencer])},  // T2
                    { "FieldKey": "deal_17E5FB83-C5CB-41B7-A9FC-49900A26A0AC", "DecimalValue": _optionalChain([Dividas, 'access', _245 => _245[2], 'optionalAccess', _246 => _246.totalAVencer])},  // T3
                    { "FieldKey": "deal_3297C7F9-D26A-42A7-B30D-A8ECCC73454D", "DecimalValue": _optionalChain([Dividas, 'access', _247 => _247[3], 'optionalAccess', _248 => _248.totalAVencer])},  // T4
                ]
            };

            const negocios = await _axiosjs.apiPloomes.patch(
            `/Deals(${id})`,
            body,
            {
                    headers: {
                    "Content-Type": "application/json",
                    "User-Key":
                        "661569F0F2BFBD31E9AC2AEE5B55C79F245AA394FAB35193A17D32654241CC4298F80D88A4C7C711FC1F2C7DCD6FBE147CB178B54213CB44E85895DAEC17BA18",
                    },
            }
            );

            const data = negocios.data.value;

            return data;

        } catch (error) {
            if (error.response) {
            console.error("Erro API: ", error.response.data);
            } else {
            console.error("Erro geral: ", error.message);
            }
        }
    }

    /**
     * Objetivo: Buscar campos do Ploomes que contenham uma palavra específica no nome
     * Como funciona: Faz requisição GET para /Fields, filtra os campos cujo nome contém o texto informado (case insensitive), e retorna array de campos encontrados
     */
    async fieldsText(text){
        try{
            const response = await _axiosjs.apiPloomes.get(`/Fields?$select=Id,Name,Key`, {
                headers: {
                'Content-Type': 'application/json',
                'User-Key': "661569F0F2BFBD31E9AC2AEE5B55C79F245AA394FAB35193A17D32654241CC4298F80D88A4C7C711FC1F2C7DCD6FBE147CB178B54213CB44E85895DAEC17BA18"
            }
        })

        const filtrados = response.data.value.filter(el =>
            el.Name.toLowerCase().includes(text.toLowerCase())
        );

        console.log(filtrados.length)

        return filtrados;

        }catch(error){
            if(error.response){
                console.error('Erro API: ', error.response.data)
            } else {
                console.error('Erro geral: ', error.message)
            }
        }
    }

    /**
     * Objetivo: Buscar deals do Ploomes com informações completas de contato e campos customizados
     * Como funciona: Faz requisição GET expandindo Contact (com telefones) e OtherProperties, filtra por StatusId e StageId específicos, e retorna deals com informações de contato e campos customizados formatados
     */
    async TakeDealFields() {
        try {
            const url =
            `/Deals` +
            `?$select=Id,Title,StageId,StatusId,ContactId` +
            `&$expand=` +
                `Contact($select=Id,Name,Email;$expand=Phones),` +
                `OtherProperties(` +
                `$filter=` +
                    `FieldKey eq 'deal_41D58C59-7D70-48E8-9737-3672D8661FE8' or ` +
                    `FieldKey eq 'deal_B221DCFA-F0CB-42DC-9F91-CBA79F340C30' or ` +
                    `FieldKey eq 'deal_AF1A346F-3AE9-428B-9FF9-A6317AC02FD3' or ` +
                    `FieldKey eq 'deal_98CF5047-B79D-43EC-89A8-EA4E6863A24D'` +
                `)` +
            `&$filter=StatusId eq 1 and StageId eq 228324`;

            const negocios = await _axiosjs.apiPloomes.get(url,
            {
                    headers: {
                    "Content-Type": "application/json",
                    "User-Key":
                        "661569F0F2BFBD31E9AC2AEE5B55C79F245AA394FAB35193A17D32654241CC4298F80D88A4C7C711FC1F2C7DCD6FBE147CB178B54213CB44E85895DAEC17BA18",
                    },
                }
            );

            const dados = negocios.data.value.map(deal => ({
                id: deal.Id,
                titulo: deal.Title,
                StageId: deal.StageId,
                ContactId: deal.ContactId,
                contactName: _nullishCoalesce(_optionalChain([deal, 'access', _249 => _249.Contact, 'optionalAccess', _250 => _250.Name]), () => ( null)),
                email: _nullishCoalesce(_optionalChain([deal, 'access', _251 => _251.Contact, 'optionalAccess', _252 => _252.Email]), () => ( null)),
                phones: (_optionalChain([deal, 'access', _253 => _253.Contact, 'optionalAccess', _254 => _254.Phones]) || []).map(p => ({
                    phoneNumber: _nullishCoalesce(p.PhoneNumber, () => ( null)),
                    searchPhoneNumber: _nullishCoalesce(p.SearchPhoneNumber, () => ( null)),
                    typeId: _nullishCoalesce(p.TypeId, () => ( null))
                })),
                otherProps: Object.fromEntries(
                    (deal.OtherProperties || []).map(v => [
                    v.FieldKey,
                    _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_nullishCoalesce(v.StringValue, () => (
                    v.BigStringValue)), () => (
                    v.DecimalValue)), () => (
                    v.IntegerValue)), () => (
                    v.BoolValue)), () => (
                    v.DateTimeValue)), () => (
                    v.AttachmentValueName)), () => (
                    v.ObjectValueName)), () => (
                    v.UserValueName)), () => (
                    v.ContactValueName)), () => (
                    null))
                    ])
                )
            }));


            return dados ;

        } catch (error) {
            if (error.response) {
            console.error("Erro API: ", error.response.data);
            } else {
            console.error("Erro geral: ", error.message);
            }
        }
    }

} exports.CallOptions = CallOptions;

/**
 * Classe para integração com API do Bacen (Sistema de Consulta de Crédito)
 * Objetivo: Consultar dados SCR (Sistema de Informações de Crédito) do Bacen para CPFs
 * Como funciona: Realiza autenticação em 3 etapas (login, autenticação de empresa), depois consulta dados dos últimos 24 meses para um CPF
 */
 class ApiBacen{
    constructor(){
        this.refreshToken = '';
        this.codigoEmpresa = "e70c0d0c-002a-4b2d-855c-8b131baa79d4";
        this.accessToken = '';
        this.tokenAutenticado = '';
        this.dividas = new Array();
    }

    /**
     * Objetivo: Método principal para consultar dados completos do Bacen para um CPF
     * Como funciona: Faz login, autentica empresa, gera array dos últimos 24 meses, e para cada mês consulta dados SCR do Bacen, retornando array com todos os períodos
     */
    async main(cpf){
        const functions = new (0, _metodosjs.Objetos)(); // classes que contém objetos e funções para uso;
        const dados = await this.login(); // Primeiro é realizado o login no sistema -> o qual é disponibilizado o token e o refreshToken.

        // Capturando o refreshToken do usuário logado, que no caso é uma chave para atualizar o token de busca.
        // Capturando o Token do usuário logado.
        this.accessToken = dados.accessToken;
        this.refreshToken = dados.refreshToken; // Ainda não autenticado.

        const dadosToken = await this.autenticandoToken(); // RefreshTOken sendo autenticado aqui.

        const periodos = functions.getUltimos24Meses(); // Capturando os últimos 24 meses a partir da data atual;


        for (const { year, month } of periodos) {
            const res = await this.buscaDividas(cpf, dadosToken.accessToken, year, month);
            this.dividas.push({ year, month, dados: res });
        }

        return this.dividas;
    }

    async ultimos2meses(cpf){
      const functions = new (0, _metodosjs.Objetos)();
      const dados = await this.login();

      this.accessToken = dados.accessToken;
      this.refreshToken = dados.refreshToken;

      const dadosToken = await this.autenticandoToken();

      const periodos = functions.getUltimos2Meses();

      console.log(periodos);

      for (const { year, month } of periodos) {
          const res = await this.buscaDividas(cpf, dadosToken.accessToken, year, month);
          this.dividas.push({ year, month, dados: res });
      }

      return this.dividas;
    }

    /**
     * Objetivo: Realizar login na API do Bacen para obter tokens de autenticação
     * Como funciona: Faz requisição POST com login e senha, e retorna accessToken e refreshToken que serão usados nas próximas requisições
     */
    async login(){
        try{

            // Colocar em variáveis de ambeinte futuramente.
            const body = {
                "Login": "thaina.martins@libracredito.com.br",
                "Senha": "Grasiele97*"
            }

            const response = await _axiosjs.apiBacen.post(`/Autenticacao/AccessToken`, body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            return response.data

        }catch(error){
            return res.status(400).json({
                error: e.message,
            });
        }
    }

    /**
     * Objetivo: Renovar o token de acesso usando o refresh token
     * Como funciona: Faz requisição POST com refreshToken no body e accessToken no header Authorization, e retorna novo token de acesso
     */
    async refreshToken(tokenRefresh, AccesToken){
        try{

            // Colocar em variáveis de ambeinte futuramente.
            const body = {
                "RefreshToken": tokenRefresh,
            }

            const response = await _axiosjs.apiBacen.post(`/Autenticacao/RefreshToken`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AccesToken
                }
            })

            // console.log(response.data)

            return response.data

        }catch(error){
            console.log(error)
        }
    }

    /**
     * Objetivo: Autenticar a empresa no sistema do Bacen usando o refresh token
     * Como funciona: Faz requisição POST com código da empresa e refreshToken, enviando accessToken no header Authorization, e retorna token autenticado para consultas
     */
    async autenticandoToken(){
        try{

            // Colocar em variáveis de ambeinte futuramente.

            // console.log(this.refreshToken)
            // console.log(this.accessToken)

            const body = {
                "codigoEmpresa": this.codigoEmpresa,
	            "refreshToken" : this.refreshToken
            }

            const response = await _axiosjs.apiBacen.post(`/Autenticacao/AutenticarEmpresa`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                }
            })

            // console.log(response.data)

            return response.data

        }catch(error){
            console.log(error)
        }
    }

    /**
     * Objetivo: Consultar dados SCR (dívidas) do Bacen para um CPF em um período específico
     * Como funciona: Faz requisição POST para /Multiplo com ação "ConsultaSCR", enviando CPF, ano e mês da base de dados, e retorna dados completos de dívidas do período
     */
    async buscaDividas(cpf, AccessToken, DataBaseAno, DataBaseMes){
        try{

            const body = {
                "acao": "ConsultaSCR",
                "Dto": {
                    "consulta": {
                    "Documento": cpf,
                     DataBaseAno,
                     DataBaseMes
                    }
                }
            }

            const response = await _axiosjs.apiBacen.post(`/Multiplo`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${AccessToken}`,
                    // "Authorization": `Bearer eyJhbGciOiJQUzI1NiIsImtpZCI6ImxCOGFXcjFhbmpBbjI5c0Q3WTVjUHciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE3NTcwMTQ5NDgsImV4cCI6MTc1NzAxODU0OCwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1vbmV5cC5jb20uYnIiLCJhdWQiOlsibXVsdGlwbG8uYXBpIiwibXVsdGlwbG8uYXBpLmNsaWVudCJdLCJjbGllbnRfaWQiOiJtdWx0aXBsby5mcm9udC5jbGllbnQiLCJzdWIiOiIxZTlhMWY2Yy04Y2Y0LTQyZDAtOWZjYS02M2UwNzRhNTg3NTgiLCJhdXRoX3RpbWUiOjE3NTcwMTE0MzYsImlkcCI6ImxvY2FsIiwiZ2l2ZW5fbmFtZSI6IlRoYWluw6EgTWFydGlucyIsIm5hbWUiOiJ0aGFpbmEubWFydGluc0BsaWJyYWNyZWRpdG8uY29tLmJyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGhhaW5hLm1hcnRpbnNAbGlicmFjcmVkaXRvLmNvbS5iciIsImVtYWlsIjoidGhhaW5hLm1hcnRpbnNAbGlicmFjcmVkaXRvLmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjb2RpZ29FbXByZXNhIjoiZTcwYzBkMGMtMDAyYS00YjJkLTg1NWMtOGIxMzFiYWE3OWQ0IiwidG9rZW4iOiJLLTRmcUJkVWtJcDUteXBtZkdXMTVXVWg4MThOZHN4RW8tckR1Nld0S3hJIiwicm9sZSI6Ik11bHRpcGxvLk1hc3RlciIsImdyb3VwaWQiOiIxOCIsInNjb3BlIjpbImVtYWlsIiwib3BlbmlkIiwicHJvZmlsZSIsInJvbGUiLCJtdWx0aXBsby5hcGkiLCJtdWx0aXBsby5hcGkudXNlciIsIm11bHRpcGxvLmFwaS5jbGllbnQiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.JelyhkTXlibXUnPtBSYzpmwLd7FUMp4fQHDyMVcun-2qpvCaa1o5EPZXxFhi9EcX9touEjlVVnvEM00D5RkZ3YIa_rdsls6sOg6hv1x4VNr5JehqhnHEjR0LVDQZiGJDJIj7_jLHhTC9jnCULno50wUEvRaknZRZjaOvZ8-LOBaEKm8e3xnU0K8voXzhiXB9HCI6-ronCWzUCHwWChQAoXPB276Byt0X-DUk-VkEBbvLhwtsv5n5Q2sbi5q1aG15Oq48s4v7G__5qrLG7DBkPjXfIyQXk0_XBFi-y1b43930zT4TSY8ks5GVFuMevFaXaYIZZr6qWtIXd5ifpNXGrw`,
                    acao: "ConsultaSCR"
                }
            })

            return response.data

        }catch(error){
            console.log(error.status)
        }
    }

} exports.ApiBacen = ApiBacen;

/**
 * Classe para integração com API do Ploomes para upload de documentos/imagens
 * Objetivo: Fazer upload de imagens (gráficos) para deals no Ploomes
 * Como funciona: Tenta upload via FormData multipart, se falhar tenta via Base64, e retorna URL da imagem para atualização nos campos do deal
 */
 class ApiPloomesDocumento{
    constructor(){}

    /**
     * Objetivo: Fazer upload de uma imagem (gráfico) para o Ploomes associada a um deal
     * Como funciona: Primeiro tenta upload via FormData multipart no endpoint /Images, se falhar tenta via Base64 no endpoint /Attachments/Base64, e retorna URL da imagem ou erro
     */
    async uploadImageToPloomes(imageBuffer, fileName, dealId) {
        try {
            console.log(`🔍 Tentando upload para Ploomes - DealId: ${dealId}, FileName: ${fileName}`);

            // Tentativa 1: FormData com multipart/form-data
            const form = new (0, _formdata2.default)();

            // Adicionar o arquivo como buffer
            form.append('file', imageBuffer, {
                filename: fileName,
                contentType: 'image/png'
            });

            // Adicionar outros campos se necessário
            form.append('DealId', dealId);
            form.append('Name', fileName);

            console.log(`📤 Enviando requisição multipart/form-data para /Images`);

            const response = await _axiosjs.apiPloomes.post('/Images', form, {
                headers: {
                    ...form.getHeaders(),
                    'User-Key': "661569F0F2BFBD31E9AC2AEE5B55C79F245AA394FAB35193A17D32654241CC4298F80D88A4C7C711FC1F2C7DCD6FBE147CB178B54213CB44E85895DAEC17BA18"
                }
            });

            console.log(`✅ Resposta do Ploomes:`, response.data);

            return {
                success: true,
                imageId: _optionalChain([response, 'access', _255 => _255.data, 'optionalAccess', _256 => _256.value, 'optionalAccess', _257 => _257[0], 'optionalAccess', _258 => _258.Id]),
                imageUrl: _optionalChain([response, 'access', _259 => _259.data, 'optionalAccess', _260 => _260.value, 'optionalAccess', _261 => _261[0], 'optionalAccess', _262 => _262.Url]),
                fileName: fileName,
                dealId: dealId
            };

        } catch (error) {
            console.error('❌ Erro ao fazer upload da imagem para Ploomes:');
            console.error('📋 Status:', _optionalChain([error, 'access', _263 => _263.response, 'optionalAccess', _264 => _264.status]));
            console.error('📋 Headers:', _optionalChain([error, 'access', _265 => _265.response, 'optionalAccess', _266 => _266.headers]));
            console.error('📋 Data:', _optionalChain([error, 'access', _267 => _267.response, 'optionalAccess', _268 => _268.data]));
            console.error('📋 Message:', error.message);

            // Tentativa 2: Usar o endpoint de Attachments como fallback
            try {
                console.log(`🔄 Tentando fallback com endpoint /Attachments/Base64`);

                const base64Image = imageBuffer.toString('base64');
                const body = {
                    Content: base64Image,
                    Name: fileName,
                    DealId: dealId,
                    Type: 'image/png'
                };

                const fallbackResponse = await _axiosjs.apiPloomes.patch('/Attachments/Base64', body, {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Key': "661569F0F2BFBD31E9AC2AEE5B55C79F245AA394FAB35193A17D32654241CC4298F80D88A4C7C711FC1F2C7DCD6FBE147CB178B54213CB44E85895DAEC17BA18"
                    }
                });

                console.log(`✅ Fallback bem-sucedido:`, fallbackResponse.data);

                return {
                    success: true,
                    imageId: _optionalChain([fallbackResponse, 'access', _269 => _269.data, 'optionalAccess', _270 => _270.value, 'optionalAccess', _271 => _271[0], 'optionalAccess', _272 => _272.Id]),
                    imageUrl: _optionalChain([fallbackResponse, 'access', _273 => _273.data, 'optionalAccess', _274 => _274.value, 'optionalAccess', _275 => _275[0], 'optionalAccess', _276 => _276.Url]),
                    fileName: fileName,
                    dealId: dealId,
                    method: 'fallback'
                };

            } catch (fallbackError) {
                console.error('❌ Fallback também falhou:', _optionalChain([fallbackError, 'access', _277 => _277.response, 'optionalAccess', _278 => _278.data]) || fallbackError.message);

                return {
                    success: false,
                    error: {
                        primary: _optionalChain([error, 'access', _279 => _279.response, 'optionalAccess', _280 => _280.data]) || error.message,
                        fallback: _optionalChain([fallbackError, 'access', _281 => _281.response, 'optionalAccess', _282 => _282.data]) || fallbackError.message
                    }
                };
            }
        }
    }

    /**
     * Objetivo: Atualizar campo customizado do deal com a URL da imagem do gráfico gerado
     * Como funciona: Mapeia o índice do tomador para o FieldKey correspondente, faz requisição PATCH no deal com a URL da imagem no campo OtherProperties específico do tomador
     */
    async updateDealWithGraphImage(dealId, imageUrl, tomadorIndex) {
        try {
            console.log(`🔄 Atualizando Deal ${dealId} com imagem do gráfico para tomador ${tomadorIndex + 1}`);

            // Mapear os FieldKeys para cada tomador (baseado no exemplo fornecido)
            const fieldKeys = [
                "deal_2EE27A42-CCD7-4105-9ACC-DCD6416F4370", // Tomador 1
                "deal_A30F783B-D683-48DC-9DA7-74AA53BEF16C", // Tomador 2
                "deal_8A8D8EF9-71CD-4AFA-B3F1-5E5057071A82", // Tomador 3
                "deal_4C852A85-FA16-4048-9641-B5C8E6B6189A"  // Tomador 4
            ];

            // Verificar se o índice do tomador é válido
            if (tomadorIndex < 0 || tomadorIndex >= fieldKeys.length) {
                throw new Error(`Índice de tomador inválido: ${tomadorIndex}. Deve estar entre 0 e ${fieldKeys.length - 1}`);
            }

            const fieldKey = fieldKeys[tomadorIndex];

            const body = {
                Id: dealId,
                OtherProperties: [
                    {
                        FieldKey: fieldKey,
                        StringValue: imageUrl
                    }
                ]
            };

            console.log(`📤 Enviando atualização para Deal ${dealId}:`);
            console.log(`🔑 FieldKey: ${fieldKey}`);
            console.log(`🔗 ImageUrl: ${imageUrl}`);

            const response = await _axiosjs.apiPloomes.patch(`/Deals(${dealId})`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Key': "661569F0F2BFBD31E9AC2AEE5B55C79F245AA394FAB35193A17D32654241CC4298F80D88A4C7C711FC1F2C7DCD6FBE147CB178B54213CB44E85895DAEC17BA18"
                }
            });

            console.log(`✅ Deal ${dealId} atualizado com sucesso!`);

            return {
                success: true,
                dealId: dealId,
                tomadorIndex: tomadorIndex,
                fieldKey: fieldKey,
                imageUrl: imageUrl,
                response: response.data
            };

        } catch (error) {
            console.error(`❌ Erro ao atualizar Deal ${dealId} com imagem do gráfico:`);
            console.error(`📋 Status:`, _optionalChain([error, 'access', _283 => _283.response, 'optionalAccess', _284 => _284.status]));
            console.error(`📋 Data:`, _optionalChain([error, 'access', _285 => _285.response, 'optionalAccess', _286 => _286.data]));
            console.error(`📋 Message:`, error.message);

            return {
                success: false,
                dealId: dealId,
                tomadorIndex: tomadorIndex,
                error: _optionalChain([error, 'access', _287 => _287.response, 'optionalAccess', _288 => _288.data]) || error.message
            };
        }
    }

} exports.ApiPloomesDocumento = ApiPloomesDocumento;
