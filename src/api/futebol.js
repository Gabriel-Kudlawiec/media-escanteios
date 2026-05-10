const BASE_URL = 'http://localhost:3001'

// Busca os times do Brasileirão
export async function buscarTimes() {
  const resposta = await fetch(`${BASE_URL}/times`)
  return resposta.json()
}

// Busca os últimos jogos em casa ou fora de um time
export async function buscarJogosTime(timeId, local) {
  const resposta = await fetch(`${BASE_URL}/jogos/${timeId}/${local}`)
  return resposta.json()
}

// Busca as estatísticas de escanteios de um jogo específico
export async function buscarEscanteiosJogo(jogoId, timeId) {
  const resposta = await fetch(`${BASE_URL}/escanteios/${jogoId}/${timeId}`)
  const dados = await resposta.json()
  return dados.corners
}