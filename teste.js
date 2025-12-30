import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buscandoPopulacao(cidade, uf) {
  const arquivo = path.resolve(__dirname, '..', 'RPA - FINAL', 'json', 'geral.json');

  if (!fs.existsSync(arquivo)) {
    console.error('Arquivo não existe:', arquivo);
    return;
  }

  fs.readFile(arquivo, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    const toJson = JSON.parse(data);

    const result = toJson.filter((value) => value.Cidade == cidade && value.uf == uf);

    if(result.length > 0){
      const populacao = result[0]["População"]
      return populacao;
    }else{
      console.log('Nenhuma cidade encontrada');
      return;
    }

  });

}

async function main() {
  await buscandoPopulacao('São Paulo', 'SP');
}

main();




