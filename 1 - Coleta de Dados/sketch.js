let video;
let poseNet;
let pose;
let corpo;                                              //Objeto para armazenar a rede neural

let rede;
let poseLabel = "";

let estado = 'Aguardando';
let targetLabel;

/*
Máquina de estado onde é definida uma variavel de estado para coleta e 1 segundo depois para de coletar
Durante esse tempo é adicionado dados a rede neural ML5
*/
function teclaPressionada() {
  if (key == 't') {
    // normaliza os dados
    rede.normalizeData();
    // Treina o modelo
    rede.train({epochs: 50}, treinamentoConcluido); 
  } else if (key == 's') {
    // Salva os dados
    rede.saveData();
  } else {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
      console.log('Coletando');
      estado = 'Coletando';
      setTimeout(function() {
        console.log('Não Coletando');
        estado = 'Aguardando';
      }, 2000);
    }, 1000);
  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  poseNet = ml5.poseNet(video, modeloCarregado);                  
  poseNet.on('pose', obterPoses);

  let opcoes = {
    inputs: 34,                                            //34 entradas tendo em vista que temos 17 pontos-chave onde cada uma possui 2 coordenadas, x e y. A rede vai capturar todos os x e y e classifica uma determinada pose que possua um target
    outputs: 4,                                            //Saídas
    task: 'classification',                                //tarefa
    debug: true                                            //Mostrar a depuração
  }
  rede = ml5.neuralNetwork(opcoes);                        //Rede neural 
  
  //Carregando modelo pré-treinado
  const modelInfo = {
    model: 'model2/model.json',
    metadata: 'model2/model_meta.json',
    weights: 'model2/model.weights.bin',
  };
  rede.load(modelInfo, redeCarregada);
  // Carregando treinamento de dados
  rede.loadData('pose1.json', redeCarregada);
}

function redeCarregada() {
  console.log('Pose classificação pronta!');
  classificarPose();
}

function classificarPose() {
  if (pose) {
    let entradas = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      entradas.push(x);
      entradas.push(y);
    }
    rede.classify(entradas, obterResultado);
  } else {
    setTimeout(classificarPose, 100);
  }
}

function obterResultado(error, results) {  
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  classificarPose();
}

function dadosProntos() {
  rede.normalizeData();
  rede.train({
    epochs: 50
  }, treinamentoConcluido);
}

function treinamentoConcluido() {
  console.log('Modelo Treinado');
  rede.save();
  classificarPose();
}


function obterPoses(poses) {
  // console.log(poses); 
  /*
  Se for identificado uma pose (verificando se o comprimento da matriz for maior que 0),
  então atribuo a variavel pose como a posição 0 da matriz
  */
  if (poses.length > 0) {
    pose = poses[0].pose;
    corpo = poses[0].skeleton;
    /*
    Passando a matriz de dados para a entrada da rede (só é feito a coleta se
    o estado da máquina de estados for = Coletando) 
    */
    if (estado == 'Coletando') {
      let entradas = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        entradas.push(x);
        entradas.push(y);
      }
      let target = [targetLabel];
      rede.addData(entradas, target);
    }
  }
}


function modeloCarregado() {
  console.log('poseNet pronta');
}

function draw() {
  push();
  //Espelhando a imagem para que fique invertida
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);
  
  if (pose) {
    for (let i = 0; i < corpo.length; i++) {
      //Desenhando as linhas dos pontos-chave ligando os pontos x's
      let a = corpo[i][0];
      let b = corpo[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    //Adicionando um círculo em cada ponto-chave encontrado
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(512);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2);
}