"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _formdata = require('form-data'); var _formdata2 = _interopRequireDefault(_formdata);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv); // responsável por armazenar as variáveis de ambiente;
var _axiosjs = require('../service/axios.js');
var _metodosjs = require('../methods/metodos.js');

_dotenv2.default.config();

 class CallOptions{
    constructor(){}

    // Essa API irá realizar a captura dos ID e dos CPF's do cliente.
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
                `FieldKey eq 'deal_8202EECD-41FA-4AAD-9927-90105C5B9391'` +
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

            const dados = negocios.data.value.map(deal => ({
                id: deal.Id,
                titulo: deal.Title,
                StageId: deal.StageId,
                ContactId: deal.ContactId,
                otherProps: Object.fromEntries(
                    (deal.OtherProperties || []).map(value => [value.FieldKey, value.FieldKey === 'deal_8202EECD-41FA-4AAD-9927-90105C5B9391' ? value.BoolValue : value.StringValue])
                )
            }));

            // // lista das chaves que você quer capturar
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

    // Função responsável por atualizar os campos de dividas.
    async UpdateData(id, ContactId, StageId, Dividas){
        try {

            console.log(_optionalChain([Dividas, 'access', _ => _[0], 'optionalAccess', _2 => _2.totalAVencer]))

            const body = {
                ContactId,
                StageId,
                "OtherProperties": [

                    // --- Processado 📌 --- //
                    { "FieldKey": "deal_8202EECD-41FA-4AAD-9927-90105C5B9391", "BoolValue": true },

                    // --- Prujuizo 📌 --- //
                    { "FieldKey": "deal_EB570764-56BF-4F80-82A4-029F5B8630D6", "DecimalValue":  _optionalChain([Dividas, 'access', _3 => _3[0], 'optionalAccess', _4 => _4.prejuizo]) }, // T1
                    { "FieldKey": "deal_B2AAB212-2129-4BCD-8658-B07120DE2004", "DecimalValue":  _optionalChain([Dividas, 'access', _5 => _5[1], 'optionalAccess', _6 => _6.prejuizo])}, // T2
                    { "FieldKey": "deal_85965CB4-1477-4485-A70A-F92ACA44EC0A", "DecimalValue":  _optionalChain([Dividas, 'access', _7 => _7[2], 'optionalAccess', _8 => _8.prejuizo])}, // T3
                    { "FieldKey": "deal_EEE716AB-A54E-4943-A9F1-C658448EF650", "DecimalValue":  _optionalChain([Dividas, 'access', _9 => _9[3], 'optionalAccess', _10 => _10.prejuizo])}, // T4

                    // Vencido - 📌 Crédito Rotativo
                    { "FieldKey": "deal_4B942F11-48E8-4774-9035-439CBD87E78E", "DecimalValue":  _optionalChain([Dividas, 'access', _11 => _11[0], 'optionalAccess', _12 => _12.creditoRotativoVencido]) }, // T1
                    { "FieldKey": "deal_9324CA51-D67C-4D41-97F7-9B09A5E6818E", "DecimalValue":  _optionalChain([Dividas, 'access', _13 => _13[1], 'optionalAccess', _14 => _14.creditoRotativoVencido])}, // T2
                    { "FieldKey": "deal_9312E20F-7435-4D6C-99DD-3DB34636F8E2", "DecimalValue":  _optionalChain([Dividas, 'access', _15 => _15[2], 'optionalAccess', _16 => _16.creditoRotativoVencido])}, // T3
                    { "FieldKey": "deal_831001E6-730C-4CD3-9AFC-6E8F0C0339FE", "DecimalValue":  _optionalChain([Dividas, 'access', _17 => _17[3], 'optionalAccess', _18 => _18.creditoRotativoVencido])}, // T4

                    // Vencido - 📌 Home Equity
                    { "FieldKey": "deal_848862F8-6865-4DB0-A4B3-94719F912869", "DecimalValue": _optionalChain([Dividas, 'access', _19 => _19[0], 'optionalAccess', _20 => _20.homeEquityVencido]) }, // T1
                    { "FieldKey": "deal_59C5F566-661D-46B6-8072-4A2A21038837", "DecimalValue": _optionalChain([Dividas, 'access', _21 => _21[1], 'optionalAccess', _22 => _22.homeEquityVencido]) }, // T2
                    { "FieldKey": "deal_301B23F8-01E2-401F-997A-4CEE03E33054", "DecimalValue": _optionalChain([Dividas, 'access', _23 => _23[2], 'optionalAccess', _24 => _24.homeEquityVencido]) }, // T3
                    { "FieldKey": "deal_23C889D8-CCC6-4294-B94D-55D5F51A056D", "DecimalValue": _optionalChain([Dividas, 'access', _25 => _25[3], 'optionalAccess', _26 => _26.homeEquityVencido]) }, // T4

                    // Vencido - 📌 Cartão de Crédito
                    { "FieldKey": "deal_33F74537-F463-4F46-B602-7F85C20A20AB", "DecimalValue": _optionalChain([Dividas, 'access', _27 => _27[0], 'optionalAccess', _28 => _28.cartaoCreditoVencido]) }, // T1
                    { "FieldKey": "deal_14D0DDCE-01B9-4446-A4EF-6DF3F53B0A60", "DecimalValue": _optionalChain([Dividas, 'access', _29 => _29[1], 'optionalAccess', _30 => _30.cartaoCreditoVencido]) }, // T2
                    { "FieldKey": "deal_FD42CBBE-9808-4596-B2BD-0D23A1997E9C", "DecimalValue": _optionalChain([Dividas, 'access', _31 => _31[2], 'optionalAccess', _32 => _32.cartaoCreditoVencido]) }, // T3
                    { "FieldKey": "deal_68289BF7-1B84-47A4-A535-B42E36108ACB", "DecimalValue": _optionalChain([Dividas, 'access', _33 => _33[3], 'optionalAccess', _34 => _34.cartaoCreditoVencido]) }, // T4

                    // Vencido - 📌 Cartão de Crédito Não Migrado
                    { "FieldKey": "deal_EF52D7B0-A314-4946-AD1B-800ECED8EC8D", "DecimalValue": _optionalChain([Dividas, 'access', _35 => _35[0], 'optionalAccess', _36 => _36.cartaoCreditoNaoMigradoVencido]) }, // T1
                    { "FieldKey": "deal_0EC24AB4-4D25-4156-BA30-99D0F043E867", "DecimalValue": _optionalChain([Dividas, 'access', _37 => _37[1], 'optionalAccess', _38 => _38.cartaoCreditoNaoMigradoVencido]) }, // T2
                    { "FieldKey": "deal_1AF63BC3-04DE-401F-A4C7-3AFA48CFC0BA", "DecimalValue": _optionalChain([Dividas, 'access', _39 => _39[2], 'optionalAccess', _40 => _40.cartaoCreditoNaoMigradoVencido]) }, // T3
                    { "FieldKey": "deal_6DBB90CC-F49E-4669-9E94-966240D0A782", "DecimalValue": _optionalChain([Dividas, 'access', _41 => _41[3], 'optionalAccess', _42 => _42.cartaoCreditoNaoMigradoVencido]) }, // T4

                    // Vencido - 📌 Crédito Pessoal Consignado
                    { "FieldKey": "deal_2644138C-4569-41CF-B915-BC9E31141C3A", "DecimalValue": _optionalChain([Dividas, 'access', _43 => _43[0], 'optionalAccess', _44 => _44.creditoPessoalConsignadoVencido]) }, // T1
                    { "FieldKey": "deal_DE5F73C4-890A-42D3-840A-47B26807D0F7", "DecimalValue": _optionalChain([Dividas, 'access', _45 => _45[1], 'optionalAccess', _46 => _46.creditoPessoalConsignadoVencido]) }, // T2
                    { "FieldKey": "deal_7719C0A6-21D4-4F81-B235-5E18BF67D434", "DecimalValue": _optionalChain([Dividas, 'access', _47 => _47[2], 'optionalAccess', _48 => _48.creditoPessoalConsignadoVencido]) }, // T3
                    { "FieldKey": "deal_7A72857F-25C7-4592-B251-C3F14CF7EC4D", "DecimalValue": _optionalChain([Dividas, 'access', _49 => _49[3], 'optionalAccess', _50 => _50.creditoPessoalConsignadoVencido]) }, // T4

                    // Vencido - 📌 Crédito pessoal Sem Consignação
                    { "FieldKey": "deal_D624D642-CFD4-47FC-B976-62CB67042B92", "DecimalValue": _optionalChain([Dividas, 'access', _51 => _51[0], 'optionalAccess', _52 => _52.creditoPessoalSemConsignacaoVencido]) }, // T1
                    { "FieldKey": "deal_E30F041A-5476-4ACD-A691-03AE542C5A9D", "DecimalValue": _optionalChain([Dividas, 'access', _53 => _53[1], 'optionalAccess', _54 => _54.creditoPessoalSemConsignacaoVencido]) }, // T2
                    { "FieldKey": "deal_E5602153-55F2-4030-8011-7CB03C8EF99F", "DecimalValue": _optionalChain([Dividas, 'access', _55 => _55[2], 'optionalAccess', _56 => _56.creditoPessoalSemConsignacaoVencido]) }, // T3
                    { "FieldKey": "deal_19ED8D4B-8E96-4EF2-A2A8-67818CA285E8", "DecimalValue": _optionalChain([Dividas, 'access', _57 => _57[3], 'optionalAccess', _58 => _58.creditoPessoalSemConsignacaoVencido]) }, // T4

                    // Vencido - 📌 Capital de Giro
                    { "FieldKey": "deal_048BFB80-8129-4FED-9EC1-5183B4848D1F", "DecimalValue": _optionalChain([Dividas, 'access', _59 => _59[0], 'optionalAccess', _60 => _60.capitalDeGiroVencido]) }, // T1
                    { "FieldKey": "deal_FF77E0B6-EAF5-4107-88C6-661548921321", "DecimalValue": _optionalChain([Dividas, 'access', _61 => _61[1], 'optionalAccess', _62 => _62.capitalDeGiroVencido]) }, // T2
                    { "FieldKey": "deal_A00A0B58-F72B-44F9-8901-9177044C53C9", "DecimalValue": _optionalChain([Dividas, 'access', _63 => _63[2], 'optionalAccess', _64 => _64.capitalDeGiroVencido]) }, // T3
                    { "FieldKey": "deal_7F16D88F-03AF-476F-8FA2-6132D092DD3D", "DecimalValue": _optionalChain([Dividas, 'access', _65 => _65[3], 'optionalAccess', _66 => _66.capitalDeGiroVencido]) }, // T4

                    // Vencido - 📌 Aquisição de Bens
                    { "FieldKey": "deal_60A074AF-8652-4049-8148-9AC9BDD6D256", "DecimalValue": _optionalChain([Dividas, 'access', _67 => _67[0], 'optionalAccess', _68 => _68.aquisicaoDeBensVencido]) }, // T1
                    { "FieldKey": "deal_47ABEEC8-855A-4C72-BB7E-23297FBF49E4", "DecimalValue": _optionalChain([Dividas, 'access', _69 => _69[1], 'optionalAccess', _70 => _70.aquisicaoDeBensVencido]) }, // T2
                    { "FieldKey": "deal_7BBBA3DC-36E8-4F4B-A7D3-2D8BED2706F3", "DecimalValue": _optionalChain([Dividas, 'access', _71 => _71[2], 'optionalAccess', _72 => _72.aquisicaoDeBensVencido]) }, // T3
                    { "FieldKey": "deal_5E0C935D-431E-46D9-9DD6-3941CE9C0121", "DecimalValue": _optionalChain([Dividas, 'access', _73 => _73[3], 'optionalAccess', _74 => _74.aquisicaoDeBensVencido]) }, // T4

                    // Vencido - 📌 Cheque Especial
                    { "FieldKey": "deal_25ED6299-AB09-430D-A3EA-C89ACFA55F70", "DecimalValue": _optionalChain([Dividas, 'access', _75 => _75[0], 'optionalAccess', _76 => _76.chequeEspecialVencido]) }, // T1
                    { "FieldKey": "deal_7FE80583-FB6A-4EE6-B9CD-F9466C03DF2F", "DecimalValue": _optionalChain([Dividas, 'access', _77 => _77[1], 'optionalAccess', _78 => _78.chequeEspecialVencido]) }, // T2
                    { "FieldKey": "deal_27532060-B97A-4B22-A493-531DB099628B", "DecimalValue": _optionalChain([Dividas, 'access', _79 => _79[2], 'optionalAccess', _80 => _80.chequeEspecialVencido]) }, // T3
                    { "FieldKey": "deal_849BEDEC-953E-4143-B0BD-E758DB65AA8F", "DecimalValue": _optionalChain([Dividas, 'access', _81 => _81[3], 'optionalAccess', _82 => _82.chequeEspecialVencido]) }, // T4

                    // Vencido - 📌 Financiamento Habitacional
                    { "FieldKey": "deal_CF12D321-747B-4373-A624-B5BA9A3B7953", "DecimalValue": _optionalChain([Dividas, 'access', _83 => _83[0], 'optionalAccess', _84 => _84.financiamentoHabitacionalVencido]) }, // T1
                    { "FieldKey": "deal_BD72432A-681D-4A62-967C-A41F9088BDF4", "DecimalValue": _optionalChain([Dividas, 'access', _85 => _85[1], 'optionalAccess', _86 => _86.financiamentoHabitacionalVencido]) }, // T2
                    { "FieldKey": "deal_E922EF4D-A7F1-46CA-8D21-F332430EF3D9", "DecimalValue": _optionalChain([Dividas, 'access', _87 => _87[2], 'optionalAccess', _88 => _88.financiamentoHabitacionalVencido]) }, // T3
                    { "FieldKey": "deal_3058AD78-D29B-4F9E-AFFB-864E33317AD4", "DecimalValue": _optionalChain([Dividas, 'access', _89 => _89[3], 'optionalAccess', _90 => _90.financiamentoHabitacionalVencido]) }, // T4

                    // Vencido - 📌 Rural
                    { "FieldKey": "deal_5DF16B4F-06E3-4B92-8C29-E99C95CD8552", "DecimalValue": _optionalChain([Dividas, 'access', _91 => _91[0], 'optionalAccess', _92 => _92.ruralVencido]) }, // T1
                    { "FieldKey": "deal_E0F6877F-3CF0-4D7A-986B-6C523C028A3C", "DecimalValue": _optionalChain([Dividas, 'access', _93 => _93[1], 'optionalAccess', _94 => _94.ruralVencido]) }, // T2
                    { "FieldKey": "deal_AF8C528B-3300-410F-A919-18608DBE5E8D", "DecimalValue": _optionalChain([Dividas, 'access', _95 => _95[2], 'optionalAccess', _96 => _96.ruralVencido]) }, // T3
                    { "FieldKey": "deal_C9C0CBE4-147A-403F-9AC3-CA1775719745", "DecimalValue": _optionalChain([Dividas, 'access', _97 => _97[3], 'optionalAccess', _98 => _98.ruralVencido]) }, // T4

                    // Vencido - 📌 Outros empréstimos
                    { "FieldKey": "deal_C81B39E1-5185-44FA-875A-A0508D25ECA4", "DecimalValue": _optionalChain([Dividas, 'access', _99 => _99[0], 'optionalAccess', _100 => _100.outrosEmprestimosVencido]) }, // T1
                    { "FieldKey": "deal_D573EE26-B8F7-4AB2-8D09-7ED222F3DC9B", "DecimalValue": _optionalChain([Dividas, 'access', _101 => _101[1], 'optionalAccess', _102 => _102.outrosEmprestimosVencido]) }, // T2
                    { "FieldKey": "deal_5E00282B-438C-48A3-BDD3-3233CBF6B548", "DecimalValue": _optionalChain([Dividas, 'access', _103 => _103[2], 'optionalAccess', _104 => _104.outrosEmprestimosVencido]) }, // T3
                    { "FieldKey": "deal_F010E0C4-075F-47FE-B5F5-3DB76D7BB06C", "DecimalValue": _optionalChain([Dividas, 'access', _105 => _105[3], 'optionalAccess', _106 => _106.outrosEmprestimosVencido]) }, // T4

                    // Vencido - 📌 Outras Dívidas 1
                    { "FieldKey": "deal_1B64F80E-CF22-42EB-B51C-B772D722ABF9", "DecimalValue": _optionalChain([Dividas, 'access', _107 => _107[0], 'optionalAccess', _108 => _108.outrasDividas1Vencido]) }, // T1
                    { "FieldKey": "deal_22C781E8-D9AB-4758-8B76-12103DAD0558", "DecimalValue": _optionalChain([Dividas, 'access', _109 => _109[1], 'optionalAccess', _110 => _110.outrasDividas1Vencido]) }, // T2
                    { "FieldKey": "deal_0E1824B1-362D-434C-A563-1C94148C3626", "DecimalValue": _optionalChain([Dividas, 'access', _111 => _111[2], 'optionalAccess', _112 => _112.outrasDividas1Vencido]) }, // T3
                    { "FieldKey": "deal_C0734B30-B18A-46B1-9CDB-9F95BD81EA17", "DecimalValue": _optionalChain([Dividas, 'access', _113 => _113[3], 'optionalAccess', _114 => _114.outrasDividas1Vencido]) }, // T4

                    // Vencido - 📌 Outras Dívidas 2
                    { "FieldKey": "deal_67769EFE-78D8-4504-8EB0-37E41B8EE4FB", "DecimalValue": _optionalChain([Dividas, 'access', _115 => _115[0], 'optionalAccess', _116 => _116.outrasDividas2Vencido]) }, // T1
                    { "FieldKey": "deal_A6B5EB1E-63BB-4C03-A3D4-D250C87494D7", "DecimalValue": _optionalChain([Dividas, 'access', _117 => _117[1], 'optionalAccess', _118 => _118.outrasDividas2Vencido]) }, // T2
                    { "FieldKey": "deal_24896DE8-EA25-45DA-87EE-8A878DA0B294", "DecimalValue": _optionalChain([Dividas, 'access', _119 => _119[2], 'optionalAccess', _120 => _120.outrasDividas2Vencido]) }, // T3
                    { "FieldKey": "deal_BC81F924-79A4-441E-86AA-05C673106CBB", "DecimalValue": _optionalChain([Dividas, 'access', _121 => _121[3], 'optionalAccess', _122 => _122.outrasDividas2Vencido]) }, // T4

                    // Vencido - 📌 Total
                    { "FieldKey": "deal_FD06662F-48F1-42D8-82CF-794B5C13A79C", "DecimalValue": _optionalChain([Dividas, 'access', _123 => _123[0], 'optionalAccess', _124 => _124.totalVencido]) }, // T1
                    { "FieldKey": "deal_7F0B27BE-4982-4392-B21F-219D6B9D75D6", "DecimalValue": _optionalChain([Dividas, 'access', _125 => _125[1], 'optionalAccess', _126 => _126.totalVencido]) }, // T2
                    { "FieldKey": "deal_D6AC8B4B-7389-4DE4-B542-40609BC9A0A6", "DecimalValue": _optionalChain([Dividas, 'access', _127 => _127[2], 'optionalAccess', _128 => _128.totalVencido]) }, // T3
                    { "FieldKey": "deal_9D81A981-1871-4335-88E9-84CF98ABD9D0", "DecimalValue": _optionalChain([Dividas, 'access', _129 => _129[3], 'optionalAccess', _130 => _130.totalVencido]) }, // T4

                    // --- A Vencer --- //

                    // A vencer - 📌 Crédito Rotativo
                    { "FieldKey": "deal_460035FA-7829-4DDB-B3F4-4F9D7DDA42DF", "DecimalValue": _optionalChain([Dividas, 'access', _131 => _131[0], 'optionalAccess', _132 => _132.creditoRotativoAVencer])},  // T1
                    { "FieldKey": "deal_BFA0B3E0-2B57-4EF0-A4DA-160FEA4AAFD3", "DecimalValue": _optionalChain([Dividas, 'access', _133 => _133[1], 'optionalAccess', _134 => _134.creditoRotativoAVencer])},  // T2
                    { "FieldKey": "deal_75A83094-FF30-4E1D-92B7-630098104FAC", "DecimalValue": _optionalChain([Dividas, 'access', _135 => _135[2], 'optionalAccess', _136 => _136.creditoRotativoAVencer])},  // T3
                    { "FieldKey": "deal_A6DDF1CF-60C3-46F7-B7A6-6B177EFB3CFB", "DecimalValue": _optionalChain([Dividas, 'access', _137 => _137[3], 'optionalAccess', _138 => _138.creditoRotativoAVencer])},  // T4

                    // A vencer - 📌 Home Equity
                    { "FieldKey": "deal_1059F356-BD3A-464D-8646-846F38B2F518", "DecimalValue": _optionalChain([Dividas, 'access', _139 => _139[0], 'optionalAccess', _140 => _140.homeEquityAVencer])},  // T1
                    { "FieldKey": "deal_B7A38DC4-59BA-4AAF-906E-37C0C708D4C9", "DecimalValue": _optionalChain([Dividas, 'access', _141 => _141[1], 'optionalAccess', _142 => _142.homeEquityAVencer])},  // T2
                    { "FieldKey": "deal_8DE1D39A-7237-49FE-BE01-81D2DA8DC64B", "DecimalValue": _optionalChain([Dividas, 'access', _143 => _143[2], 'optionalAccess', _144 => _144.homeEquityAVencer])},  // T3
                    { "FieldKey": "deal_9F6AB580-A8B2-4E15-B5E8-DF7B6C0D0E19", "DecimalValue": _optionalChain([Dividas, 'access', _145 => _145[3], 'optionalAccess', _146 => _146.homeEquityAVencer])},  // T4

                    // A vencer - 📌 Cartão de Crédito
                    { "FieldKey": "deal_CEFB48C8-3D3E-4D0B-A5BC-654441FC8835", "DecimalValue": _optionalChain([Dividas, 'access', _147 => _147[0], 'optionalAccess', _148 => _148.cartaoCreditoAVencer])},  // T1
                    { "FieldKey": "deal_05D43BE7-2D33-42B0-97F2-41BEF57A3D6B", "DecimalValue": _optionalChain([Dividas, 'access', _149 => _149[1], 'optionalAccess', _150 => _150.cartaoCreditoAVencer])},  // T2
                    { "FieldKey": "deal_4F53531D-B3EA-4A0D-BDD4-9031E6CF72D6", "DecimalValue": _optionalChain([Dividas, 'access', _151 => _151[2], 'optionalAccess', _152 => _152.cartaoCreditoAVencer])},  // T3
                    { "FieldKey": "deal_953E35DA-AA7D-4591-A49B-8788B5BD51AC", "DecimalValue": _optionalChain([Dividas, 'access', _153 => _153[3], 'optionalAccess', _154 => _154.cartaoCreditoAVencer])},  // T4

                    // A vencer - 📌 Cartão de Crédito Não Migrado
                    { "FieldKey": "deal_178C9C9D-97EA-4EFE-A9CC-DBF7234DFA00", "DecimalValue": _optionalChain([Dividas, 'access', _155 => _155[0], 'optionalAccess', _156 => _156.cartaoCreditoNaoMigradoAVencer])},  // T1
                    { "FieldKey": "deal_1FD0721A-B04F-45D3-9725-7AD4D140668F", "DecimalValue": _optionalChain([Dividas, 'access', _157 => _157[1], 'optionalAccess', _158 => _158.cartaoCreditoNaoMigradoAVencer])},  // T2
                    { "FieldKey": "deal_AC351864-DB92-4C55-B777-0A94297349A2", "DecimalValue": _optionalChain([Dividas, 'access', _159 => _159[2], 'optionalAccess', _160 => _160.cartaoCreditoNaoMigradoAVencer])},  // T3
                    { "FieldKey": "deal_D00F9C9D-D273-4C1A-A6FA-2A5CC385294F", "DecimalValue": _optionalChain([Dividas, 'access', _161 => _161[3], 'optionalAccess', _162 => _162.cartaoCreditoNaoMigradoAVencer])},  // T4

                    // A vencer - 📌 Crédito Pessoal Consignado
                    { "FieldKey": "deal_597D52D0-9A28-4977-ADDA-620210A00CB3", "DecimalValue": _optionalChain([Dividas, 'access', _163 => _163[0], 'optionalAccess', _164 => _164.creditoPessoalConsignadoAVencer])},  // T1
                    { "FieldKey": "deal_8B3BC352-F1ED-4627-A862-93704A44C63F", "DecimalValue": _optionalChain([Dividas, 'access', _165 => _165[1], 'optionalAccess', _166 => _166.creditoPessoalConsignadoAVencer])},  // T2
                    { "FieldKey": "deal_4CDD88F1-5394-49F4-A5C3-9965B1990944", "DecimalValue": _optionalChain([Dividas, 'access', _167 => _167[2], 'optionalAccess', _168 => _168.creditoPessoalConsignadoAVencer])},  // T3
                    { "FieldKey": "deal_82346992-A0B2-4111-876C-13D9EA449AEF", "DecimalValue": _optionalChain([Dividas, 'access', _169 => _169[3], 'optionalAccess', _170 => _170.creditoPessoalConsignadoAVencer])},  // T4

                    // A vencer - 📌 Crédito pessoal Sem Consignação
                    { "FieldKey": "deal_1E4239D7-2A13-4A72-ACA9-78DF08AF1A63", "DecimalValue": _optionalChain([Dividas, 'access', _171 => _171[0], 'optionalAccess', _172 => _172.creditoPessoalSemConsignacaoAVencer])},  // T1
                    { "FieldKey": "deal_E91E8903-4DAB-4C9E-A87F-48CE24237789", "DecimalValue": _optionalChain([Dividas, 'access', _173 => _173[1], 'optionalAccess', _174 => _174.creditoPessoalSemConsignacaoAVencer])},  // T2
                    { "FieldKey": "deal_C612EBB1-9CA7-4699-8150-AFC3CCE19603", "DecimalValue": _optionalChain([Dividas, 'access', _175 => _175[2], 'optionalAccess', _176 => _176.creditoPessoalSemConsignacaoAVencer])},  // T3
                    { "FieldKey": "deal_B5961F12-C2BC-4B34-9182-246AC819F1A5", "DecimalValue": _optionalChain([Dividas, 'access', _177 => _177[3], 'optionalAccess', _178 => _178.creditoPessoalSemConsignacaoAVencer])},  // T4

                    // A vencer - 📌 Capital de Giro
                    { "FieldKey": "deal_3F638E28-EBB4-4DD9-A6C5-8434FE88B397", "DecimalValue": _optionalChain([Dividas, 'access', _179 => _179[0], 'optionalAccess', _180 => _180.capitalDeGiroAVencer])},  // T1
                    { "FieldKey": "deal_A495FEBF-39F5-44D6-AAAC-53B634FDDFC3", "DecimalValue": _optionalChain([Dividas, 'access', _181 => _181[1], 'optionalAccess', _182 => _182.capitalDeGiroAVencer])},  // T2
                    { "FieldKey": "deal_C0010757-DE1B-49BF-B1BA-4A68BC768128", "DecimalValue": _optionalChain([Dividas, 'access', _183 => _183[2], 'optionalAccess', _184 => _184.capitalDeGiroAVencer])},  // T3
                    { "FieldKey": "deal_59727161-A52A-4284-99A4-B34978A121E3", "DecimalValue": _optionalChain([Dividas, 'access', _185 => _185[3], 'optionalAccess', _186 => _186.capitalDeGiroAVencer])},  // T4

                    // A vencer - 📌 Aquisição de Bens
                    { "FieldKey": "deal_8C12F0CC-48C6-4C6B-9F06-9DC06E2A53D7", "DecimalValue": _optionalChain([Dividas, 'access', _187 => _187[0], 'optionalAccess', _188 => _188.aquisicaoDeBensAVencer])},  // T1
                    { "FieldKey": "deal_D5A5BF1B-E6ED-4579-99D8-05FE7FFC9256", "DecimalValue": _optionalChain([Dividas, 'access', _189 => _189[1], 'optionalAccess', _190 => _190.aquisicaoDeBensAVencer])},  // T2
                    { "FieldKey": "deal_23D3088D-F2D4-4C83-85F5-E336A93EBB1A", "DecimalValue": _optionalChain([Dividas, 'access', _191 => _191[2], 'optionalAccess', _192 => _192.aquisicaoDeBensAVencer])},  // T3
                    { "FieldKey": "deal_9DC0AE0E-2056-4C60-A222-9EF6BC35814F", "DecimalValue": _optionalChain([Dividas, 'access', _193 => _193[3], 'optionalAccess', _194 => _194.aquisicaoDeBensAVencer])},  // T4

                    // A vencer - 📌 Cheque Especial
                    { "FieldKey": "deal_8E818AD0-1E1B-4890-9B12-87F9F7CCC98C", "DecimalValue": _optionalChain([Dividas, 'access', _195 => _195[0], 'optionalAccess', _196 => _196.chequeEspecialAVencer])},  // T1
                    { "FieldKey": "deal_584754BD-A354-4900-B54C-CC2B58FCFF1A", "DecimalValue": _optionalChain([Dividas, 'access', _197 => _197[1], 'optionalAccess', _198 => _198.chequeEspecialAVencer])},  // T2
                    { "FieldKey": "deal_6552393A-8A37-489A-AC3D-372ABCD9FC4B", "DecimalValue": _optionalChain([Dividas, 'access', _199 => _199[2], 'optionalAccess', _200 => _200.chequeEspecialAVencer])},  // T3
                    { "FieldKey": "deal_6873023B-F7C8-4B2A-9FC8-615C5F3EB168", "DecimalValue": _optionalChain([Dividas, 'access', _201 => _201[3], 'optionalAccess', _202 => _202.chequeEspecialAVencer])},  // T4

                    // A vencer - 📌 Financiamento Habitacional
                    { "FieldKey": "deal_8F7E07AE-AE4B-4851-92BE-67D6B15BCDE3", "DecimalValue": _optionalChain([Dividas, 'access', _203 => _203[0], 'optionalAccess', _204 => _204.financiamentoHabitacionalAVencer])},  // T1
                    { "FieldKey": "deal_BD8D690C-BA64-4B1D-8427-340580B86823", "DecimalValue": _optionalChain([Dividas, 'access', _205 => _205[1], 'optionalAccess', _206 => _206.financiamentoHabitacionalAVencer])},  // T2
                    { "FieldKey": "deal_75D1C003-6CE3-4EB0-BDD5-7AFB141FD6CD", "DecimalValue": _optionalChain([Dividas, 'access', _207 => _207[2], 'optionalAccess', _208 => _208.financiamentoHabitacionalAVencer])},  // T3
                    { "FieldKey": "deal_4B93253F-8B87-4F76-B91E-5D9839056C93", "DecimalValue": _optionalChain([Dividas, 'access', _209 => _209[3], 'optionalAccess', _210 => _210.financiamentoHabitacionalAVencer])},  // T4

                    // A vencer - 📌 Rural
                    { "FieldKey": "deal_E2D05635-366D-43DC-8C61-65DD4C69DF9A", "DecimalValue": _optionalChain([Dividas, 'access', _211 => _211[0], 'optionalAccess', _212 => _212.ruralAVencer])},  // T1
                    { "FieldKey": "deal_5ECB84BC-81A7-4B2B-968E-B5A90E0A1E96", "DecimalValue": _optionalChain([Dividas, 'access', _213 => _213[1], 'optionalAccess', _214 => _214.ruralAVencer])},  // T2
                    { "FieldKey": "deal_58D62B09-42C4-4F0E-BC7B-A122AE064B10", "DecimalValue": _optionalChain([Dividas, 'access', _215 => _215[2], 'optionalAccess', _216 => _216.ruralAVencer])},  // T3
                    { "FieldKey": "deal_93702AE6-73EE-473B-87A7-0880486CBAA7", "DecimalValue": _optionalChain([Dividas, 'access', _217 => _217[3], 'optionalAccess', _218 => _218.ruralAVencer])},  // T4

                    // A vencer - 📌 Outros empréstimos
                    { "FieldKey": "deal_011325EA-2A24-48D7-B9B3-CDE81A22681F", "DecimalValue": _optionalChain([Dividas, 'access', _219 => _219[0], 'optionalAccess', _220 => _220.outrosEmprestimosAVencer])},  // T1
                    { "FieldKey": "deal_C0047C3A-4C00-40B9-909F-C3F9FAFB8CBF", "DecimalValue": _optionalChain([Dividas, 'access', _221 => _221[1], 'optionalAccess', _222 => _222.outrosEmprestimosAVencer])},  // T2
                    { "FieldKey": "deal_F3CFB3EC-E8C8-452C-BD32-4D932F29F7FD", "DecimalValue": _optionalChain([Dividas, 'access', _223 => _223[2], 'optionalAccess', _224 => _224.outrosEmprestimosAVencer])},  // T3
                    { "FieldKey": "deal_D71A78F6-1928-4079-A0D2-9ECC81607083", "DecimalValue": _optionalChain([Dividas, 'access', _225 => _225[3], 'optionalAccess', _226 => _226.outrosEmprestimosAVencer])},  // T4

                    // A vencer - 📌 Outras Dívidas 1
                    { "FieldKey": "deal_42E4C01E-7138-4F4B-AC12-CB1D5A299BE8", "DecimalValue": _optionalChain([Dividas, 'access', _227 => _227[0], 'optionalAccess', _228 => _228.outrasDividas1AVencer])},  // T1
                    { "FieldKey": "deal_A50FDEEA-3801-4387-B3BE-3CFEFE78B63A", "DecimalValue": _optionalChain([Dividas, 'access', _229 => _229[1], 'optionalAccess', _230 => _230.outrasDividas1AVencer])},  // T2
                    { "FieldKey": "deal_BE821482-BC02-4599-8FFB-0958E30C99DD", "DecimalValue": _optionalChain([Dividas, 'access', _231 => _231[2], 'optionalAccess', _232 => _232.outrasDividas1AVencer])},  // T3
                    { "FieldKey": "deal_856185E5-5E5F-43DC-B5B1-C2EC074D42D4", "DecimalValue": _optionalChain([Dividas, 'access', _233 => _233[3], 'optionalAccess', _234 => _234.outrasDividas1AVencer])},  // T4

                    // A vencer - 📌 Outras Dívidas 2
                    { "FieldKey": "deal_1713BD8C-A07F-4796-B32B-E0C30BFD1037", "DecimalValue": _optionalChain([Dividas, 'access', _235 => _235[0], 'optionalAccess', _236 => _236.outrasDividas2AVencer])},  // T1
                    { "FieldKey": "deal_8BA3362A-AA53-4529-9F2D-0B8811BC2373", "DecimalValue": _optionalChain([Dividas, 'access', _237 => _237[1], 'optionalAccess', _238 => _238.outrasDividas2AVencer])},  // T2
                    { "FieldKey": "deal_0856A710-EA01-445C-B5EF-C330A143392F", "DecimalValue": _optionalChain([Dividas, 'access', _239 => _239[2], 'optionalAccess', _240 => _240.outrasDividas2AVencer])},  // T3
                    { "FieldKey": "deal_B96E4E0A-24C2-414F-95E6-9B202EB4A657", "DecimalValue": _optionalChain([Dividas, 'access', _241 => _241[3], 'optionalAccess', _242 => _242.outrasDividas2AVencer])},  // T4

                    // A vencer - 📌 Total
                    { "FieldKey": "deal_52B811D5-A209-49D2-AC0B-D3F599D23869", "DecimalValue": _optionalChain([Dividas, 'access', _243 => _243[0], 'optionalAccess', _244 => _244.totalAVencer])},  // T1
                    { "FieldKey": "deal_5EC4DAA7-9D43-4610-B6E1-5636141EB3E7", "DecimalValue": _optionalChain([Dividas, 'access', _245 => _245[1], 'optionalAccess', _246 => _246.totalAVencer])},  // T2
                    { "FieldKey": "deal_17E5FB83-C5CB-41B7-A9FC-49900A26A0AC", "DecimalValue": _optionalChain([Dividas, 'access', _247 => _247[2], 'optionalAccess', _248 => _248.totalAVencer])},  // T3
                    { "FieldKey": "deal_3297C7F9-D26A-42A7-B30D-A8ECCC73454D", "DecimalValue": _optionalChain([Dividas, 'access', _249 => _249[3], 'optionalAccess', _250 => _250.totalAVencer])},  // T4
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

    // Capturando Campos de acordo com alguma palavra padrão no Title.
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

    // Essa API irá realizar a captura dos ID e dos CPF's do cliente.
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
                contactName: _nullishCoalesce(_optionalChain([deal, 'access', _251 => _251.Contact, 'optionalAccess', _252 => _252.Name]), () => ( null)),
                email: _nullishCoalesce(_optionalChain([deal, 'access', _253 => _253.Contact, 'optionalAccess', _254 => _254.Email]), () => ( null)),
                phones: (_optionalChain([deal, 'access', _255 => _255.Contact, 'optionalAccess', _256 => _256.Phones]) || []).map(p => ({
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

 class ApiBacen{
    constructor(){
        this.refreshToken = '';
        this.codigoEmpresa = "e70c0d0c-002a-4b2d-855c-8b131baa79d4";
        this.accessToken = '';
        this.tokenAutenticado = '';
        this.dividas = new Array();
    }

    async main(cpf){
        const functions = new (0, _metodosjs.Objetos)(); // classes que contém objetos e funções para uso;
        const dados = await this.login(); // Primeiro é realizado o login no sistema -> o qual é disponibilizado o token e o refreshToken.

        // Capturando o refreshToken do usuário logado, que no caso é uma chave para atualizar o token de busca.
        // Capturando o Token do usuário logado.
        this.accessToken = dados.accessToken;
        this.refreshToken = dados.refreshToken; // Ainda não autenticado.

        const dadosToken = await this.autenticandoToken(); // RefreshTOken sendo autenticado aqui.

        const periodos = functions.getUltimos24Meses(); // Capturando os últimos 12 meses a partir da data atual;


        for (const { year, month } of periodos) {
            const res = await this.buscaDividas(cpf, dadosToken.accessToken, year, month);
            this.dividas.push({ year, month, dados: res });
        }

        return this.dividas;
    }

    // Fazendo login no sistema do Bacen.
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

    // Prtoblema na busca do token.
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

 class ApiPloomesDocumento{
    constructor(){}

    // Upload de imagem para o endpoint /Images do Ploomes
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
                imageId: _optionalChain([response, 'access', _257 => _257.data, 'optionalAccess', _258 => _258.value, 'optionalAccess', _259 => _259[0], 'optionalAccess', _260 => _260.Id]),
                imageUrl: _optionalChain([response, 'access', _261 => _261.data, 'optionalAccess', _262 => _262.value, 'optionalAccess', _263 => _263[0], 'optionalAccess', _264 => _264.Url]),
                fileName: fileName,
                dealId: dealId
            };

        } catch (error) {
            console.error('❌ Erro ao fazer upload da imagem para Ploomes:');
            console.error('📋 Status:', _optionalChain([error, 'access', _265 => _265.response, 'optionalAccess', _266 => _266.status]));
            console.error('📋 Headers:', _optionalChain([error, 'access', _267 => _267.response, 'optionalAccess', _268 => _268.headers]));
            console.error('📋 Data:', _optionalChain([error, 'access', _269 => _269.response, 'optionalAccess', _270 => _270.data]));
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
                    imageId: _optionalChain([fallbackResponse, 'access', _271 => _271.data, 'optionalAccess', _272 => _272.value, 'optionalAccess', _273 => _273[0], 'optionalAccess', _274 => _274.Id]),
                    imageUrl: _optionalChain([fallbackResponse, 'access', _275 => _275.data, 'optionalAccess', _276 => _276.value, 'optionalAccess', _277 => _277[0], 'optionalAccess', _278 => _278.Url]),
                    fileName: fileName,
                    dealId: dealId,
                    method: 'fallback'
                };

            } catch (fallbackError) {
                console.error('❌ Fallback também falhou:', _optionalChain([fallbackError, 'access', _279 => _279.response, 'optionalAccess', _280 => _280.data]) || fallbackError.message);

                return {
                    success: false,
                    error: {
                        primary: _optionalChain([error, 'access', _281 => _281.response, 'optionalAccess', _282 => _282.data]) || error.message,
                        fallback: _optionalChain([fallbackError, 'access', _283 => _283.response, 'optionalAccess', _284 => _284.data]) || fallbackError.message
                    }
                };
            }
        }
    }

    // Atualizar campos OtherProperties com URL da imagem do gráfico
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
            console.error(`📋 Status:`, _optionalChain([error, 'access', _285 => _285.response, 'optionalAccess', _286 => _286.status]));
            console.error(`📋 Data:`, _optionalChain([error, 'access', _287 => _287.response, 'optionalAccess', _288 => _288.data]));
            console.error(`📋 Message:`, error.message);

            return {
                success: false,
                dealId: dealId,
                tomadorIndex: tomadorIndex,
                error: _optionalChain([error, 'access', _289 => _289.response, 'optionalAccess', _290 => _290.data]) || error.message
            };
        }
    }

} exports.ApiPloomesDocumento = ApiPloomesDocumento;
