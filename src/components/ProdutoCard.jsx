import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const esgotado = Number(produto.estoque) <= 0
  const [adicionado, setAdicionado] = useState(false)
  const cliqueBloqueado = useRef(false)
  const temporizador = useRef(null)

  useEffect(() => {
    return () => window.clearTimeout(temporizador.current)
  }, [])

  function handleAdicionar() {
    if (esgotado || cliqueBloqueado.current) return

    cliqueBloqueado.current = true
    onAdicionar(produto)
    setAdicionado(true)

    temporizador.current = window.setTimeout(() => {
      cliqueBloqueado.current = false
      setAdicionado(false)
    }, 1200)
  }

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      <p className="card-avaliacao">
        ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
      </p>

      <div className="card-precos">
        {produto.precoOriginal && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        <span className="preco">{formatarPreco(produto.price)}</span>
      </div>

      <div className="card-selos">
        {esgotado && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <button
        type="button"
        className="botao"
        onClick={handleAdicionar}
        disabled={esgotado || adicionado}
      >
        {adicionado ? 'Adicionado!' : 'Adicionar ao carrinho'}
      </button>
    </article>
  )
}