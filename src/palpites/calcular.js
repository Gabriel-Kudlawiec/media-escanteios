// Calcula a média de escanteios de uma lista de jogos
export function calcularMedia(escanteiosPorJogo) {
  if (escanteiosPorJogo.length === 0) return 0

  const total = escanteiosPorJogo.reduce((soma, valor) => soma + valor, 0)
  const media = total / escanteiosPorJogo.length

  return parseFloat(media.toFixed(1))
}

// Gera 5 palpites baseado nas médias dos dois times
export function gerarPalpites(mediaMandante, mediaVisitante) {
  const previsaoBase = mediaMandante + mediaVisitante

  return [
    { mandante: Math.round(mediaMandante + 1), visitante: Math.round(mediaVisitante + 1), total: Math.round(previsaoBase + 2) },
    { mandante: Math.round(mediaMandante + 0.5), visitante: Math.round(mediaVisitante + 0.5), total: Math.round(previsaoBase + 1) },
    { mandante: Math.round(mediaMandante), visitante: Math.round(mediaVisitante), total: Math.round(previsaoBase) },
    { mandante: Math.round(mediaMandante - 0.5), visitante: Math.round(mediaVisitante - 0.5), total: Math.round(previsaoBase - 1) },
    { mandante: Math.round(mediaMandante - 1), visitante: Math.round(mediaVisitante - 1), total: Math.round(previsaoBase - 2) },
  ]
}