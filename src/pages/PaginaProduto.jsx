import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({
  produtos,
  onAdicionar,
  onSolicitarAviso,
}) {
  const { id } = useParams()
  const [produtoNotificadoId, setProdutoNotificadoId] = useState(null)
  const [produtosAdicionados, setProdutosAdicionados] = useState({})
  const cliquesBloqueados = useRef(new Set())
  const temporizadores = useRef({})
  const produto = produtos.find((item) => String(item.id) === id)
  const esgotado = produto ? Number(produto.estoque) <= 0 : false

  useEffect(() => {
    return () => {
      Object.values(temporizadores.current).forEach((temporizador) => {
        window.clearTimeout(temporizador)
      })
    }
  }, [])

  function adicionarComFeedback(item) {
    const produtoId = String(item.id)

    if (cliquesBloqueados.current.has(produtoId)) return

    cliquesBloqueados.current.add(produtoId)
    onAdicionar(item)
    setProdutosAdicionados((atuais) => ({ ...atuais, [produtoId]: true }))

    temporizadores.current[produtoId] = window.setTimeout(() => {
      cliquesBloqueados.current.delete(produtoId)
      setProdutosAdicionados((atuais) => {
        const atualizados = { ...atuais }
        delete atualizados[produtoId]
        return atualizados
      })
      delete temporizadores.current[produtoId]
    }, 1200)
  }

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        String(item.id) !== id &&
        Number(item.estoque) > 0
    )
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            R$ {Number(produto.price).toFixed(2).replace('.', ',')}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {Number(produto.estoque)} unidades disponíveis
          </p>

          <button
            type="button"
            className="botao botao-grande"
            onClick={() => adicionarComFeedback(produto)}
            disabled={esgotado || Boolean(produtosAdicionados[String(produto.id)])}
          >
            {produtosAdicionados[String(produto.id)]
              ? 'Adicionado!'
              : 'Adicionar ao carrinho'}
          </button>

          {esgotado && (
            <form
              className="aviso-esgotado"
              onSubmit={(evento) => {
                evento.preventDefault()
                const dados = new FormData(evento.currentTarget)

                onSolicitarAviso({
                  produtoId: produto.id,
                  nome: String(dados.get('nome') || '').trim(),
                  email: String(dados.get('email') || '').trim(),
                })

                setProdutoNotificadoId(produto.id)
                evento.currentTarget.reset()
              }}
            >
              <p>
                Produto esgotado. Informe seus dados para receber um aviso
                quando voltar.
              </p>

              <label>
                Nome
                <input type="text" name="nome" required />
              </label>

              <label>
                E-mail
                <input type="email" name="email" required />
              </label>

              <button type="submit" className="botao botao-secundario">
                Avise-me quando voltar
              </button>

              {String(produtoNotificadoId) === String(produto.id) && (
                <p role="status">Pedido registrado.</p>
              )}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">
              R$ {Number(item.price).toFixed(2).replace('.', ',')}
            </p>
            <button
              type="button"
              className="botao"
              onClick={() => adicionarComFeedback(item)}
              disabled={Boolean(produtosAdicionados[String(item.id)])}
            >
              {produtosAdicionados[String(item.id)]
                ? 'Adicionado!'
                : 'Adicionar ao carrinho'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}