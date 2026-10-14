export default function Estoque({ produtos, avisosEsgotados = [] }) {
  const ordenados = produtos
    .slice()
    .sort((a, b) => Number(a.estoque) - Number(b.estoque))

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Clientes aguardando</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const estoque = Number(produto.estoque)
              const clientesAguardando = avisosEsgotados.filter(
                (aviso) => String(aviso.produtoId) === String(produto.id)
              )

              return (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {estoque <= 0 && (
                      <span className="selo selo-esgotado">Esgotado</span>
                    )}
                    {estoque > 0 && estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                  <td>
                    {clientesAguardando.length === 0
                      ? 'Nenhum cliente aguardando'
                      : clientesAguardando.map((aviso, index) => (
                        <p key={`${aviso.email}-${index}`}>
                          {aviso.nome} ({aviso.email})
                        </p>
                      ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}