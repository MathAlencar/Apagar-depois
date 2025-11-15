import { Chart, registerables } from 'chart.js';
import { createCanvas } from 'canvas';

// Registrar todos os componentes do Chart.js
Chart.register(...registerables);

/**
 * Classe para geração de gráficos usando Chart.js e Canvas
 * Objetivo: Gerar gráficos de evolução de dívidas em formato PNG
 * Como funciona: Usa Chart.js para criar gráfico de linha em canvas Node.js, renderiza e converte para buffer PNG em memória
 */
export class GeradorGrafico {
  constructor() {
    this.largura = 800;
    this.altura = 600;
  }

  /**
   * Objetivo: Gerar gráfico de linha mostrando evolução das dívidas (vencidas, a vencer e prejuízo) ao longo do tempo
   * Como funciona: Cria canvas, configura Chart.js com dados processados, renderiza gráfico de linha com 3 datasets (vencido em vermelho, prejuízo em laranja, a vencer em verde), aguarda renderização, converte para buffer PNG, e retorna sem salvar em disco
   */
  async gerarGraficoEvolucaoDividas(dadosGrafico, cpf) {
    try {
      // Configurar canvas
      const canvas = createCanvas(this.largura, this.altura);
      const ctx = canvas.getContext('2d');

      // Preparar dados para o gráfico
      const labels = dadosGrafico.map(d => d.periodo);
      const dadosVencido = dadosGrafico.map(d => d.vencido);
      const dadosAVencer = dadosGrafico.map(d => d.aVencer);
      const dadosPrejuizo = dadosGrafico.map(d => d.prejuizo);

      // Configuração do gráfico
      const config = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Vencidos',
              data: dadosVencido,
              borderColor: 'rgb(255, 44, 44)', // Vermelho
              backgroundColor: 'rgba(255, 44, 44, 0.2)',
              tension: 0.1,
              fill: false,
              pointStyle: 'circle'
            },
            {
              label: 'Prejuízo',
              data: dadosPrejuizo,
              borderColor: 'rgb(255, 165, 0)', // Laranja
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              tension: 0.1,
              fill: false,
              pointStyle: 'circle'
            },
            {
              label: 'Carteira a Vencer',
              data: dadosAVencer,
              borderColor: 'rgb(25, 240, 61)', // Verde
              backgroundColor: 'rgba(25, 240, 61, 0.2)',
              tension: 0.1,
              fill: false,
              pointStyle: 'circle'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Histórico de Dívidas - CPF/CNPJ: ${cpf}`,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Período (Mês/Ano)',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              ticks: {
                maxRotation: 45,
                minRotation: 0
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Valor (R$)',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              min: 0,
              ticks: {
                callback: function(value) {
                  return 'R$ ' + value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  });
                }
              }
            }
          },
          elements: {
            point: {
              radius: 4,
              hoverRadius: 6
            }
          }
        }
      };

      // Criar o gráfico
      const chart = new Chart(ctx, config);

      // Aguardar um momento para o gráfico ser renderizado
      await new Promise(resolve => setTimeout(resolve, 100));

      // Gerar nome do arquivo com timestamp (apenas para referência)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `grafico_evolucao_${cpf}_${timestamp}.png`;

      // Gerar buffer PNG (sem salvar no disco)
      const buffer = canvas.toBuffer('image/png');

      // Destruir o gráfico para liberar memória
      chart.destroy();

      return {
        success: true,
        fileName: fileName,
        buffer: buffer,
        message: `Gráfico gerado com sucesso em memória: ${fileName}`
      };

    } catch (error) {
      console.error('Erro ao gerar gráfico:', error);
      return {
        success: false,
        error: error.message,
        message: 'Erro ao gerar gráfico'
      };
    }
  }

}
