import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = 'https://v3.football.api-sports.io'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apisports-key': API_KEY
  }
})

// Busca os times do Brasileirão
export async function buscarTimes() {
  const resposta = await api.get('/teams', {
    params: {
      league: 71,
      season: 2024
    }
  })
  return resposta.data.response
}

export async function buscarJogosTime(timeId, local) {
  const resposta = await api.get('/fixtures', {
    params: {
      team: timeId,
      season: 2024,
      league: 71,
    }
  })

  const todos = resposta.data.response
  console.log('total de jogos retornados:', todos.length)

  const filtrados = todos.filter(jogo => {
    if (local === 'home') {
      return jogo.teams.home.id === Number(timeId)
    } else {
      return jogo.teams.away.id === Number(timeId)
    }
  })

  return filtrados.slice(0, 5)
}

// Busca as estatísticas de escanteios de um jogo específico
export async function buscarEscanteiosJogo(jogoId, timeId) {
  const resposta = await api.get('/fixtures/statistics', {
    params: {
      fixture: jogoId,
      team: timeId
    }
  })

  const stats = resposta.data.response
  if (!stats || stats.length === 0) return 0

  // Procura o Corner Kicks dentro da lista de estatísticas
  const estatisticas = stats[0].statistics
  const corners = estatisticas.find(s => s.type === 'Corner Kicks')

  return corners?.value || 0
}