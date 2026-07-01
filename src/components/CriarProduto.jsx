import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ListaProdutos } from './ListarProdutos';

export function CriacaoProduto() {
    const [nome, setNome] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const criarProduto = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const { data, error } = await supabase
                .from("produto")
                .insert([
                    {
                        nome
                    }
                ])

            if(error) throw error;
            
            setNome("");    
                
            
            await buscarProdutos();


        }catch (err) {
            setErro(err.message);
            console.error('Erro ao Adicionar produto:', err);
        } finally {
        setCarregando(false);
    }
    }
}