// src/components/ListaUsuarios.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function ListaProdutos() {
  const [produto, setProduto] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Função para buscar os dados
  const buscarProduto = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from('produto') // Nome da sua tabela
        .select('*')

      if (error) throw error;

      setProduto(data);
    } catch (err) {
      setErro(err.message);
      console.error('Erro ao buscar Produtos:', err);
    } finally {
      setCarregando(false);
    }
  };

  // Buscar os dados quando o componente montar
  useEffect(() => {
    buscarProduto();
  }, []);

  // Mostrar loading
  if (carregando) {
    return (
      <div className="loading">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  // Mostrar erro
  if (erro) {
    return (
      <div className="error">
        <p>❌ Erro: {erro}</p>
        <button onClick={buscarProduto}>Tentar novamente</button>
      </div>
    );
  }

  // Mostrar lista
  return (
    <div className="lista-usuarios">
      <h2>📋 Lista de Usuários</h2>
      
      <button onClick={buscarProduto} className="btn-atualizar">
        🔄 Atualizar lista
      </button>

      {produto.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {produto.map((usuario) => (
            <li key={produto.id_produto}>
              <strong>{produto.nome}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}