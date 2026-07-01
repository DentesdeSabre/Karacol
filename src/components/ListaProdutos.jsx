// src/components/ListaUsuarios.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Função para buscar os dados
  const buscarProdutos = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from('produto') // Nome da sua tabela
        .select('*')

      if (error) throw error;

      setProdutos(data);
    } catch (err) {
      setErro(err.message);
      console.error('Erro ao buscar Produtos:', err);
    } finally {
      setCarregando(false);
    }
  };

  // Buscar os dados quando o componente montar
  useEffect(() => {
    buscarProdutos();
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
        <button onClick={buscarProdutos}>Tentar novamente</button>
      </div>
    );
  }

  // Mostrar lista
  return (
    <div className="lista-usuarios">
      <h2>📋 Lista de Usuários</h2>
      
      <button onClick={buscarProdutos} className="btn-atualizar">
        🔄 Atualizar lista
      </button>

      {produtos.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id_produto}>
              <strong>{produto.nome}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}