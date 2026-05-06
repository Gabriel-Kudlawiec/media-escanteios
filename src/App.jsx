import { useEffect, useState } from 'react'
import { buscarTimes, buscarJogosTime, buscarEscanteiosJogo } from './api/futebol'
import { calcularMedia, gerarPalpites } from './palpites/calcular'

// Pausa entre requisições para não sobrecarregar a API
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function App() {
  const [times, setTimes] = useState([])
  const [timeMandante, setTimeMandante] = useState('')
  const [timeVisitante, setTimeVisitante] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [calculando, setCalculando] = useState(false)
  const [palpites, setPalpites] = useState(null)
  const [medias, setMedias] = useState(null)

  useEffect(() => {
    async function carregar() {
      const dados = await buscarTimes()
      setTimes(dados)
      setCarregando(false)
    }
    carregar()
  }, [])

  async function calcularPalpites() {
    if (!timeMandante || !timeVisitante) {
      alert('Selecione os dois times!')
      return
    }

    setCalculando(true)
    setPalpites(null)

    // Busca os últimos 5 jogos em casa do mandante
    const jogosMandante = await buscarJogosTime(timeMandante, 'home')
    console.log('quantidade de jogos mandante:', jogosMandante.length)

    // Busca os últimos 5 jogos fora do visitante
    const jogosVisitante = await buscarJogosTime(timeVisitante, 'away')

    // Busca escanteios de cada jogo do mandante
const escanteiosMandante = []
for (const jogo of jogosMandante) {
  const corners = await buscarEscanteiosJogo(jogo.fixture.id, timeMandante)
  console.log('escanteios do jogo:', corners)
  escanteiosMandante.push(Number(corners))
}

    // Busca escanteios de cada jogo do visitante
const escanteiosVisitante = []
for (const jogo of jogosVisitante) {
  await esperar(500)
  const corners = await buscarEscanteiosJogo(jogo.fixture.id, timeVisitante)
  escanteiosVisitante.push(Number(corners))
}

    // Calcula as médias
    const mediaMandante = calcularMedia(escanteiosMandante)
    const mediaVisitante = calcularMedia(escanteiosVisitante)

    // Gera os palpites
    const resultado = gerarPalpites(mediaMandante, mediaVisitante)

    setMedias({ mandante: mediaMandante, visitante: mediaVisitante })
    setPalpites(resultado)
    setCalculando(false)
  }

  const nomeMandante = times.find(t => t.team.id === Number(timeMandante))?.team.name || ''
  const nomeVisitante = times.find(t => t.team.id === Number(timeVisitante))?.team.name || ''

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white text-center mb-2">
        Média de Escanteios ⚽
      </h1>
      <p className="text-gray-400 text-center mb-10">
        Selecione os times para ver a previsão de escanteios
      </p>

      <div className="max-w-2xl mx-auto">

        {/* Time Mandante */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-2">
            🏠 Time Mandante
          </label>
          <select
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600"
            value={timeMandante}
            onChange={(e) => setTimeMandante(e.target.value)}
          >
            <option value="">Selecione o time da casa</option>
            {times.map((item) => (
              <option key={item.team.id} value={item.team.id}>
                {item.team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Visitante */}
        <div className="mb-8">
          <label className="text-white font-semibold block mb-2">
            ✈️ Time Visitante
          </label>
          <select
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600"
            value={timeVisitante}
            onChange={(e) => setTimeVisitante(e.target.value)}
          >
            <option value="">Selecione o time visitante</option>
            {times.map((item) => (
              <option key={item.team.id} value={item.team.id}>
                {item.team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botão */}
        <button
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          onClick={calcularPalpites}
          disabled={calculando}
        >
          {calculando ? 'Calculando...' : 'Ver Previsão de Escanteios'}
        </button>

        {/* Médias */}
        {medias && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">🏠 {nomeMandante}</p>
              <p className="text-white text-2xl font-bold">{medias.mandante}</p>
              <p className="text-gray-400 text-xs">média escanteios em casa</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">✈️ {nomeVisitante}</p>
              <p className="text-white text-2xl font-bold">{medias.visitante}</p>
              <p className="text-gray-400 text-xs">média escanteios fora</p>
            </div>
          </div>
        )}

        {/* Palpites */}
        {palpites && (
          <div className="mt-6">
            <h2 className="text-white font-bold text-xl mb-4 text-center">
              🎯 Palpites de Escanteios
            </h2>
            <div className="space-y-3">
              {palpites.map((palpite, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg flex justify-between items-center ${index === 2 ? 'bg-green-700' : 'bg-gray-800'}`}
                >
                  <span className="text-gray-400 text-sm">#{index + 1}</span>
                  <span className="text-white font-bold text-lg">
                    {palpite.mandante} x {palpite.visitante}
                  </span>
                  <span className="text-gray-400 text-sm">
                    total: {palpite.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App