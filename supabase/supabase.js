import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const supabase = createClient('https://mqgfubesmocuwtobucgo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZ2Z1YmVzbW9jdXd0b2J1Y2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjU3MTMsImV4cCI6MjA5ODQwMTcxM30.A1zTveUT3bsWB1n5m0oUgIGVyIr_PA6o-7zDroduKvQ')

const { data, error } = await supabase.auth.signInWithPassword({
            email: 'dentesdesabre100@gmail.com',
            password: 'Reino1914#',
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

