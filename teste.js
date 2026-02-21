const resultado = (function () {
  const datasNascimento = [
    "1952-02-08T21:19:05.581Z",
    "1952-02-08T21:19:05.581Z",
    "1952-02-08T21:19:05.581Z",
    "1952-02-08T21:19:05.581Z"
  ];

  const hoje = new Date();

  function calcularIdade(data) {
    const nascimento = new Date(data);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  }

  let maiorIdade = 0;

  datasNascimento.forEach(data => {
    if (data) {
      const idade = calcularIdade(data);
      if (idade > maiorIdade) {
        maiorIdade = idade;
      }
    }
  });

  if (maiorIdade === 0) return 0;

  if (maiorIdade < 65) return 180;

  const anosRestantes = 80 - maiorIdade;

  if (anosRestantes <= 0) return 0;

  const mesesMaximos = anosRestantes * 12;

  const prazosPadrao = [36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180];

  let prazoFinal = 0;
  prazosPadrao.forEach(prazo => {
    if (prazo <= mesesMaximos) {
      prazoFinal = prazo;
    }
  });

  return prazoFinal;
})();

console.log(resultado);
