export class Objetos{
  criaTomador(
    cpfTomador,
    creditoRotativoVencido = 0,           creditoRotativoAVencer = 0,
    homeEquityVencido = 0,                homeEquityAVencer = 0,
    cartaoCreditoVencido = 0,             cartaoCreditoAVencer = 0,
    cartaoCreditoNaoMigradoVencido = 0,   cartaoCreditoNaoMigradoAVencer = 0,
    creditoPessoalConsignadoVencido = 0,  creditoPessoalConsignadoAVencer = 0,
    creditoPessoalSemConsignacaoVencido = 0, creditoPessoalSemConsignacaoAVencer = 0,
    capitalDeGiroVencido = 0,             capitalDeGiroAVencer = 0,
    aquisicaoDeBensVencido = 0,           aquisicaoDeBensAVencer = 0,
    chequeEspecialVencido = 0,            chequeEspecialAVencer = 0,
    financiamentoHabitacionalVencido = 0, financiamentoHabitacionalAVencer = 0,
    ruralVencido = 0,                     ruralAVencer = 0,
    outrosEmprestimosVencido = 0,         outrosEmprestimosAVencer = 0,
    outrasDividas1Vencido = 0,            outrasDividas1AVencer = 0,
    outrasDividas2Vencido = 0,            outrasDividas2AVencer = 0,
    totalVencido = 0,                     totalAVencer = 0,
    preencherZeroVencido = 0,             preencherZeroAVencer = 0,
    prejuizo = 0
  ) {
    return {
      cpfTomador,
      creditoRotativoVencido,           creditoRotativoAVencer,
      homeEquityVencido,                homeEquityAVencer,
      cartaoCreditoVencido,             cartaoCreditoAVencer,
      cartaoCreditoNaoMigradoVencido,   cartaoCreditoNaoMigradoAVencer,
      creditoPessoalConsignadoVencido,  creditoPessoalConsignadoAVencer,
      creditoPessoalSemConsignacaoVencido, creditoPessoalSemConsignacaoAVencer,
      capitalDeGiroVencido,             capitalDeGiroAVencer,
      aquisicaoDeBensVencido,           aquisicaoDeBensAVencer,
      chequeEspecialVencido,            chequeEspecialAVencer,
      financiamentoHabitacionalVencido, financiamentoHabitacionalAVencer,
      ruralVencido,                     ruralAVencer,
      outrosEmprestimosVencido,         outrosEmprestimosAVencer,
      outrasDividas1Vencido,            outrasDividas1AVencer,
      outrasDividas2Vencido,            outrasDividas2AVencer,
      totalVencido,                     totalAVencer,
      preencherZeroVencido,             preencherZeroAVencer,
      prejuizo
    };
  }

  getUltimos24Meses(refDate = new Date()) {
    const base = new Date(refDate);
    const dia = base.getDate(); // dia do mês
    if (dia < 25) {
      base.setMonth(base.getMonth() - 1);
    }

    const periodos = [];
    for (let i = 0; i < 24; i++) {
      const d = new Date(base);
      d.setMonth(base.getMonth() - i);

      const year = String(d.getFullYear());
      const month = String(d.getMonth() + 1).padStart(2, '0'); // 01–12

      periodos.push({ year, month });
    }

    return periodos;
  }

  capturandoDividas(data){

    let totalVencido = data.dados.ResumoDoClienteTraduzido.CarteiraVencido;
    let totalVencer = data.dados.ResumoDoClienteTraduzido.CarteiraVencer;
	let prejuizo = data.dados.ResumoDoClienteTraduzido.Prejuizo;
    
    let teste = data.dados.ResumoModalidade; // Array de dividas;
    
    var creditoRotativoVencido = 0;
    var homeEquityVencido = 0;
    var cartaoCreditoVencido = 0;
    var cartaoCreditoNaoMigradoVencido = 0;
    var creditoPessoalConsignadoVencido = 0;
    var creditoPessoalSemConsignacaoVencido = 0;
    var capitalDeGiroVencido = 0;
    var aquisicaoDeBensVencido = 0;
    var chequeEspecialVencido = 0;
    var financiamentoHabitacionalVencido = 0;
    var ruralVencido = 0;
    var outrosEmprestimosVencido = 0;
    var outrasDividas1Vencido = 0;
    var outrasDividas2Vencido = 0;
    var totalCarteiraVencido = totalVencido; 

    var creditoRotativoAVencer = 0;
    var homeEquityAVencer = 0;
    var cartaoCreditoAVencer = 0;
    var cartaoCreditoNaoMigradoAVencer = 0;
    var creditoPessoalConsignadoAVencer = 0;
    var creditoPessoalSemConsignacaoAVencer = 0;
    var capitalDeGiroAVencer = 0;
    var aquisicaoDeBensAVencer = 0;
    var chequeEspecialAVencer = 0;
    var financiamentoHabitacionalAVencer = 0;
    var ruralAVencer = 0;
    var outrosEmprestimosAVencer = 0;
    var outrasDividas1AVencer = 0;
    var outrasDividas2AVencer = 0;
    var totalCarteiraAVencer = totalVencer; 

	const arrayAntecipacao = [
		'Adiantamento sobre cambiais entregues',
		'ARO - adiantamento de receitas orçamentárias',
		'Recebíveis adquiridos',
		'Antecipação de fatura de cartão de crédito',
		'Outros títulos descontados',
		'Títulos e créditos a receber',
		'Recebíveis de arranjo de pagamento',
		'Adiantamentos a depositantes',
		'Desconto de duplicatas',
		'Desconto de cheques',
		'Adiantamento sobre contratos de câmbio'
	]

	const arrayAquisicao = [
		'Aquisição de bens – veículos automotores',
		'Aquisição de bens – outros bens',
		'Aquisição de bens com interveniência – veículos autom.',
		'Aquisição de bens com interveniência – outros bens',
		'Aquisição de bens – veículos automotores acima de 2 toneladas'
	]

	const arrayCapitalGiro = [
		'Capital de giro com prazo de vencimento inferior a 30 d',
		'Capital de giro com prazo vencim. igual ou superior 30 d',
		'Capital de giro com prazo de vencimento até 365 d',
		'Capital de giro com prazo vencimento superior 365 d',
		'Capital de giro com teto rotativo'
	]

	const arrayCartaoCredito = [
		'Cartão de crédito – compra, fatura parcelada ou saque financiado pela instituição emitente do cartão ',
		'Cartão de crédito – compra ou fatura parcelada pela instituição financeira emitente do cartão',
		'Cartão de crédito - compra à vista e parcelado lojista'
	]

	const arrayCartaoCreditoNaoMigrado = [
		'Cartão de crédito - não migrado'
	]

	const arrayChequeEspecial = [
		'Cheque especial e conta garantida',
		'Cheque especial',
		'Conta garantida'
	]

	const arrayCreditoPessoalComConsignacao = [
		'Crédito pessoal - com consignação em folha de pagam.'
	]

	const arrayCreditoPessoalSemConsignacao = [
		'Crédito pessoal - sem consignação em folha de pagam.'
	]

	const arrayCreditoRotativo = [
		'Crédito rotativo vinculado a cartão de crédito'
	]

	const arrayFinanciamentoHabitacional = [
		'Financiamento habitacional – SFH',
		'Financiamento habitacional – exceto SFH',
		'Financiamento imobiliário – empreendim, exceto habitac.',
		'Arrendamento financeiro imobiliário'
	]

	const arrayHomeEquity = [
		'Home equity'
	]

	const arrayRural = [
		'Investimento e capital de giro de financiam. agroindustr.',
		'Comercialização e pré-comercialização',
		'Industrialização',
		'CPR - Cédula de Produto Rural',
		'Financiamentos agroindustriais',
		'Custeio e pré-custeio'
	]

	const arrayOutrosEmprestimos = [
		'Outros empréstimos'
	]

	const arrayDividasExtras = [
		'Adiantamento sobre cambiais entregues',
		'ARO - adiantamento de receitas orçamentárias',
		'Recebíveis adquiridos',
		'Antecipação de fatura de cartão de crédito',
		'Outros títulos descontados',
		'Títulos e créditos a receber',
		'Recebíveis de arranjo de pagamento',
		'Adiantamentos a depositantes',
		'Desconto de duplicatas',
		'Desconto de cheques',
		'Adiantamento sobre contratos de câmbio',
		'Microcrédito',
		'Financiamento de projeto',
		'Outros direitos creditórios descontados',
		'Moeda Estrangeira',
		'Financiamento à exportação',
		'Créd decorrentes de contratos de exportação-export note',
		'Outros financiamentos à exportação',
		'Financiamento à importação',
		'Outros financiamentos com interveniência',
		'Financiamento de TVM',
		'Financiamento de infraestrutura e desenvolvimento',
		'Arrendamento financeiro exceto veículos automotores e imóveis',
		'1204',
		'Devedores por compra de valores e bens',
		'Outros com característica de crédito',
		'Repasses interfinanceiros',
		'EN - Nota de Exportação',
		'Debêntures',
		'Outros (títulos de crédito fora da carteira)',
		'Limite contratado e não utilizado',
		'Retenção de risco assumida por aquisição de cotas de fundos',
		'Retenção de risco assumida por aquisição de instrumentos com lastros em operações de crédito',
		'Avais e fianças honrados'
	]

  const dividasExtrasSomenteVencido = [
    	'Beneficiários de garantias prestadas para operações com PJ financeira',
		'Beneficiários de garantias prestadas para fundos constitucionais',
		'Beneficiários de garantias prestadas para participação em processo licitatório',
		'Coobrigação assumida em cessão com coobrigação para pessoa integrante do SFN',
		'Coobrigação assumida em cessão com coobrigação para pessoa não integrante do SFN, inclusive securitizadora e fundos de investimento',
		'Beneficiários de outras coobrigações',
		'Beneficiários de outras garantias prestadas',
		'Beneficiários de garantias prestadas para operações com outras pessoas'
  ]

  for(const value of teste){

    // Antecipação	
		for(const antecipacao of arrayAntecipacao){
			if((value.subdominio == antecipacao) && value.tipo == 'VENCIDO'){
				outrasDividas1Vencido+=value.valorVencimento;
			}
			if((value.subdominio == antecipacao) && value.tipo == 'A VENCER'){
				outrasDividas1AVencer+=value.valorVencimento;
			}
		}

    // Dividas Extras	
		for(const DividasExtras of arrayDividasExtras){
			if((value.subdominio == DividasExtras) && value.tipo == 'VENCIDO'){
				outrasDividas2Vencido+=value.valorVencimento;
				console.log(outrasDividas2Vencido)
			}
			if((value.subdominio == DividasExtras) && value.tipo == 'A VENCER'){
				outrasDividas2AVencer+=value.valorVencimento;
			}
		}

		// Dividas Extras somar somente o que for vencido, nunca somar o "a vencer" junto com vencido.
		for(const DividasExtrasSomenteVencido of dividasExtrasSomenteVencido){
			if(value.subdominio == DividasExtrasSomenteVencido && value.tipo == 'VENCIDO'){
				outrasDividas2Vencido+=value.valorVencimento;
			}
		}

		// Aquisição de Bens
		for(const aquisicao of arrayAquisicao){
			if((value.subdominio == aquisicao) && value.tipo == 'VENCIDO'){
				aquisicaoDeBensVencido+=value.valorVencimento;
			}
			if((value.subdominio == aquisicao) && value.tipo == 'A VENCER'){
				aquisicaoDeBensAVencer+=value.valorVencimento;
			}
		}

		// Capital de Giro
		for(const CapitalGiro of arrayCapitalGiro){
			if((value.subdominio == CapitalGiro) && value.tipo == 'VENCIDO'){
				capitalDeGiroVencido+=value.valorVencimento;
			}
			if((value.subdominio == CapitalGiro) && value.tipo == 'A VENCER'){
				capitalDeGiroAVencer+=value.valorVencimento;
			}
		}

		// Cartão de Crédito
		for(const cartaoCredito of arrayCartaoCredito){
			if((value.subdominio == cartaoCredito) && value.tipo == 'VENCIDO'){
				cartaoCreditoVencido+=value.valorVencimento;
			}
			if((value.subdominio == cartaoCredito) && value.tipo == 'A VENCER'){
				cartaoCreditoAVencer+=value.valorVencimento;
			}
		}

		// Cartão de Crédito Não Migrado
		for(const cartaoCreditoNaoMigrado of arrayCartaoCreditoNaoMigrado){
			if((value.subdominio == cartaoCreditoNaoMigrado) && value.tipo == 'VENCIDO'){
				cartaoCreditoNaoMigradoVencido+=value.valorVencimento;
			}
			if((value.subdominio == cartaoCreditoNaoMigrado) && value.tipo == 'A VENCER'){
				cartaoCreditoNaoMigradoAVencer+=value.valorVencimento;
			}
		}

		// Cheque Especial
		for(const chequeEspecial of arrayChequeEspecial){
			if((value.subdominio == chequeEspecial) && value.tipo == 'VENCIDO'){
				chequeEspecialVencido+=value.valorVencimento;
			}
			if((value.subdominio == chequeEspecial) && value.tipo == 'A VENCER'){
				chequeEspecialAVencer+=value.valorVencimento;
			}
		}

		// Crédito Pessoal Com Consignação
		for(const creditoPessoalComConsignacao of arrayCreditoPessoalComConsignacao){
			if((value.subdominio == creditoPessoalComConsignacao) && value.tipo == 'VENCIDO'){
				creditoPessoalConsignadoVencido+=value.valorVencimento;
			}
			if((value.subdominio == creditoPessoalComConsignacao) && value.tipo == 'A VENCER'){
				creditoPessoalConsignadoAVencer+=value.valorVencimento;
			}
		}

		// Crédito Pessoal Sem Consignação
		for(const creditoPessoalSemConsignacao of arrayCreditoPessoalSemConsignacao){
			if((value.subdominio == creditoPessoalSemConsignacao) && value.tipo == 'VENCIDO'){
				creditoPessoalSemConsignacaoVencido+=value.valorVencimento;
			}
			if((value.subdominio == creditoPessoalSemConsignacao) && value.tipo == 'A VENCER'){
				creditoPessoalSemConsignacaoAVencer+=value.valorVencimento;
			}
		}

		// Crédito Rotativo
		for(const creditoRotativo of arrayCreditoRotativo){
			if((value.subdominio == creditoRotativo) && value.tipo == 'VENCIDO'){
				creditoRotativoVencido+=value.valorVencimento;
			}
			if((value.subdominio == creditoRotativo) && value.tipo == 'A VENCER'){
				creditoRotativoAVencer+=value.valorVencimento;
			}
		}

		// Financiamento Habitacional
		for(const financiamentoHabitacional of arrayFinanciamentoHabitacional){
			if((value.subdominio == financiamentoHabitacional) && value.tipo == 'VENCIDO'){
				financiamentoHabitacionalVencido+=value.valorVencimento;
			}
			if((value.subdominio == financiamentoHabitacional) && value.tipo == 'A VENCER'){
				financiamentoHabitacionalAVencer+=value.valorVencimento;
			}
		}

		// Home Equity
		for(const homeEquity of arrayHomeEquity){
			if((value.subdominio == homeEquity) && value.tipo == 'VENCIDO'){
				homeEquityVencido+=value.valorVencimento;
			}
			if((value.subdominio == homeEquity) && value.tipo == 'A VENCER'){
				homeEquityAVencer+=value.valorVencimento;
			}
		}

		// Rural
		for(const rural of arrayRural){
			if((value.subdominio == rural) && value.tipo == 'VENCIDO'){
				ruralVencido+=value.valorVencimento;
			}
			if((value.subdominio == rural) && value.tipo == 'A VENCER'){
				ruralAVencer+=value.valorVencimento;
			}
		}

		// Outros Empréstimos
		for(const outrosEmprestimos of arrayOutrosEmprestimos){
			if((value.subdominio == outrosEmprestimos) && value.tipo == 'VENCIDO'){
				outrosEmprestimosVencido+=value.valorVencimento;
			}
			if((value.subdominio == outrosEmprestimos) && value.tipo == 'A VENCER'){
				outrosEmprestimosAVencer+=value.valorVencimento;
			}
		}

    }

    // Exibir resultados
	// console.log('=== RESULTADOS DAS CATEGORIAS ===');
	// console.log('AQUISIÇÃO DE BENS:');
	// console.log('  A Vencer:', aquisicaoDeBensAVencer);
	// console.log('  Vencido:', aquisicaoDeBensVencido);
	
	// console.log('CAPITAL DE GIRO:');
	// console.log('  A Vencer:', capitalDeGiroAVencer);
	// console.log('  Vencido:', capitalDeGiroVencido);
	
	// console.log('CARTÃO DE CRÉDITO:');
	// console.log('  A Vencer:', cartaoCreditoAVencer);
	// console.log('  Vencido:', cartaoCreditoVencido);
	
	// console.log('CARTÃO DE CRÉDITO NÃO MIGRADO:');
	// console.log('  A Vencer:', cartaoCreditoNaoMigradoAVencer);
	// console.log('  Vencido:', cartaoCreditoNaoMigradoVencido);
	
	// console.log('CHEQUE ESPECIAL:');
	// console.log('  A Vencer:', chequeEspecialAVencer);
	// console.log('  Vencido:', chequeEspecialVencido);
	
	// console.log('CRÉDITO PESSOAL COM CONSIGNAÇÃO:');
	// console.log('  A Vencer:', creditoPessoalConsignadoAVencer);
	// console.log('  Vencido:', creditoPessoalConsignadoVencido);
	
	// console.log('CRÉDITO PESSOAL SEM CONSIGNAÇÃO:');
	// console.log('  A Vencer:', creditoPessoalSemConsignacaoAVencer);
	// console.log('  Vencido:', creditoPessoalSemConsignacaoVencido);
	
	// console.log('CRÉDITO ROTATIVO:');
	// console.log('  A Vencer:', creditoRotativoAVencer);
	// console.log('  Vencido:', creditoRotativoVencido);
	
	// console.log('FINANCIAMENTO HABITACIONAL:');
	// console.log('  A Vencer:', financiamentoHabitacionalAVencer);
	// console.log('  Vencido:', financiamentoHabitacionalVencido);
	
	// console.log('HOME EQUITY:');
	// console.log('  A Vencer:', homeEquityAVencer);
	// console.log('  Vencido:', homeEquityVencido);
	
	// console.log('RURAL:');
	// console.log('  A Vencer:', ruralAVencer);
	// console.log('  Vencido:', ruralVencido);
	
	// console.log('OUTROS EMPRÉSTIMOS:');
	// console.log('  A Vencer:', outrosEmprestimosAVencer);
	// console.log('  Vencido:', outrosEmprestimosVencido);

    return {
      creditoRotativoVencido,
      creditoRotativoAVencer,
      homeEquityVencido,
      homeEquityAVencer,
      cartaoCreditoVencido,
      cartaoCreditoAVencer,
      cartaoCreditoNaoMigradoVencido,
      cartaoCreditoNaoMigradoAVencer,
      creditoPessoalConsignadoVencido,
      creditoPessoalConsignadoAVencer,
      creditoPessoalSemConsignacaoVencido,
      creditoPessoalSemConsignacaoAVencer,
      capitalDeGiroVencido,
      capitalDeGiroAVencer,
      aquisicaoDeBensVencido,
      aquisicaoDeBensAVencer,
      chequeEspecialVencido,
      chequeEspecialAVencer,
      financiamentoHabitacionalVencido,
      financiamentoHabitacionalAVencer,
      ruralVencido,
      ruralAVencer,
      outrosEmprestimosVencido,
      outrosEmprestimosAVencer,
      outrasDividas1Vencido,
      outrasDividas1AVencer,
      outrasDividas2Vencido,
      outrasDividas2AVencer,
      totalCarteiraVencido,
      totalCarteiraAVencer,
      preencherZeroVencido: 0,
      preencherZeroAVencer: 0,
	  prejuizo
    };
  }

  // Método para processar dados dos 12 meses e extrair valores para gráfico
  processarDadosParaGrafico(dados12Meses) {
    const dadosGrafico = [];
    
    for (const periodo of dados12Meses) {
      const { year, month, dados } = periodo;
      
      // Verificar se há dados válidos
      if (dados && dados.Erro === false && dados.ResumoDoClienteTraduzido) {
        const carteiraVencido = dados.ResumoDoClienteTraduzido.CarteiraVencido || 0;
        const carteiraVencer = dados.ResumoDoClienteTraduzido.CarteiraVencer || 0;
		const prejuizo = dados.ResumoDoClienteTraduzido.Prejuizo || 0;
        
        // Formatar data para exibição (MM/YYYY)
        const dataFormatada = `${month.padStart(2, '0')}/${year}`;
        
        dadosGrafico.push({
          periodo: dataFormatada,
          vencido: carteiraVencido,
          aVencer: carteiraVencer,
          prejuizo: prejuizo,
          total: carteiraVencido + carteiraVencer + prejuizo
        });
      }
    }
    
    // Ordenar por período (mais antigo primeiro)
    dadosGrafico.sort((a, b) => {
      const [mesA, anoA] = a.periodo.split('/');
      const [mesB, anoB] = b.periodo.split('/');
      return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
    });
    
    return dadosGrafico;
  }
}