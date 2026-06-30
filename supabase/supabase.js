import { createClient } from "https://esm.sh/@supabase/supabase-js@2";



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const { data, error } = await supabase.auth.signInWithPassword({
            email: 'process.env.Email_login',
            password: 'process.env.Senha_login',
        });

        if (error) {
            alert("Erro ao logar: " + error.message);
        }

document.getElementById('enviar').addEventListener("click",enviar);
document.getElementById('confDel').addEventListener("click",deletar);

const listaClientes = document.getElementById('listarClientes');

document.addEventListener("DOMContentLoaded", listarClientes); 
async function listarClientes(){
    const { data, error } = await supabase
        .from('produto')
        .select('*');
    listaClientes.innerHTML='';
    data.forEach(cliente => {
        const li = document.createElement('li');
        li.innerHTML = `<div>${cliente.id_produto}   ${cliente.nome}</div>`
        listaClientes.appendChild(li);
    })
}




async function enviar(){
    const nome = document.getElementById("nome").value;
    const { data, error } = await supabase
        .from('produto')
        .insert([
            {
                nome: nome
            }
        ]);
    listarClientes();
}
async function deletar(){
    const valor = document.getElementById("numDel").value;
    const id = parseInt(valor, 10);
    const { data, error } = await supabase
        .from('produto')
        .delete()
        .eq('id_produto', id);
    listarClientes();
    alert(typeof(id))
}

