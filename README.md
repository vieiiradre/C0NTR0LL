# C0NTR0LL
Versão beta do sistema C0NTR0LL (poseNet())

O PoseNet é um modelo de aprendizado de máquina que permite a estimativa da pose humana em tempo real. Neste trabalho o PoseNet foi utilizado para reconhecer uma pessoa, pois a ênfase é aplicar essa técnica para controlar um jogo e atribuir essa interação a reabilitação de pacientes. A rede neural PoseNet identifica 17 pontos-chave para detectar a pose do corpo humano. Esses pontos são obtidos em uma matriz de coordenadas processada pelo modelo.

A implementação da rede neural responsável pela captura da pose do corpo humano é feita através do modelo PoseNet e da biblioteca ml5.js.

A implementação da captura da pose humana possui duas redes neurais:
1. uma rede neural do tipo PoseNet para detectar os pontos-chave do corpo
2. outra rede neural do tipo ml5 que recebe a saída da primeira rede permitindo criar e treinar um novo modelo.

A rede neural PoseNet envia as 17 combinações de números que representam a pose humana. Cada combinação possui duas coordenadas na matriz: uma coordenada x e uma coordenada y, resultando em 34 entradas. Essas 34 entradas são classificadas pela rede neural da biblioteca ml5.js para que sejam feitas as devidas atribuições de saídas para as teclas do teclado. A implementação adiciona os 17 pares de pontos-chave em uma matriz simples. A rede neural faz o escaneamento de toda a pose, recebendo todos os x e y. Além de identificar os pontos-chave, através de uma máquina de estado, é possível criar, salvar e carregar novas poses através do arquivo compacto do tipo .JSON (JavaScript Object Notation).

A implementação está dividida entre as seguintes estruturas: 
- Coleta de dados
- Carregamento de dados
- Modelo treinado
- Bibliotecas


** Nas próximas horas estarei anexando a atribuição da rede a uma tecla **
