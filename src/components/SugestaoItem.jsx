import { useEffect, useRef, useState } from 'react'
import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  const [adicionado, setAdicionado] = useState(false)
  const cliqueBloqueado = useRef(false)
  const temporizador = useRef(null)

  useEffect(() => {
    return () => window.clearTimeout(temporizador.current)
  }, [])

  function handleAdicionar() {
    if (cliqueBloqueado.current) return

    cliqueBloqueado.current = true
    onAdicionar(produto)
    setAdicionado(true)

    temporizador.current = window.setTimeout(() => {
      cliqueBloqueado.current = false
      setAdicionado(false)
    }, 1200)
  }

  return (
    <div className="sugestao">
      <div className="sugestao-imagem-moldura">
        <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
      </div>
      <div className="sugestao-info">
        <p className="sugestao-titulo">{produto.title}</p>
        <p className="preco preco-pequeno">{formatarPreco(produto.price)}</p>
      </div>
      <button
        type="button"
        className="botao botao-pequeno"
        onClick={handleAdicionar}
        disabled={adicionado}
      >
        {adicionado ? 'Adicionado!' : 'Comprar'}
      </button>
    </div>
  )
}