let rede;

function setup() {
  createCanvas(640, 480);
  let opcoes = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  rede = ml5.neuralNetwork(opcoes);
  rede.loadData('pose1.json', dadosProntos);
}

function dadosProntos() {
  rede.normalizeData();
  rede.train({epochs: 50}, finalizado); 
}

function finalizado() {
  console.log('modelo treinado');
  rede.save();
}