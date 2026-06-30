# Guia Prático: Supabase + JS Vanilla + HTML

> Cada exemplo deste guia é **isolado e funcional sozinho**. A ideia é você
> criar um arquivo `.html` pra cada um, testar, entender o que está
> acontecendo, e só depois partir pra um CRUD completo (como o seu
> `admin.html` + `admin.js`).
>
> Estrutura recomendada: crie uma pasta `estudos-supabase/` e dentro dela
> um arquivo por exemplo (`01-conexao.html`, `02-select.html`, etc).

---

## 0. Setup que se repete em todo exemplo

Todo arquivo vai precisar disso no `<head>` ou antes do `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = "SUA_URL_AQUI";
  const SUPABASE_ANON_KEY = "SUA_CHAVE_AQUI";

  // ATENÇÃO: o objeto global criado pelo CDN se chama "supabase".
  // Se você nomear sua instância também de "supabase", ela vai sobrescrever
  // o objeto global e dar erro de "supabase.createClient is not a function"
  // na segunda vez que o script rodar. Por isso, use outro nome:
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>
```

> 💡 Isso já resolve um bug clássico que confunde muita gente: usar `supabase`
> como nome da variável e depois não entender por que parou de funcionar.

Tabela usada nos exemplos abaixo (rode isso 1x no SQL Editor do Supabase):

```sql
create table tarefas (
  id bigint generated always as identity primary key,
  titulo text not null,
  concluida boolean default false,
  created_at timestamptz default now()
);
```

---

## 1. Conexão simples — testar se está tudo certo

Objetivo: só confirmar que a chave/URL estão corretas, sem mexer em tabela nenhuma.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<body>
  <h2>Teste de Conexão</h2>
  <p id="status">Verificando...</p>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const db = window.supabase.createClient(
      "SUA_URL_AQUI",
      "SUA_CHAVE_AQUI"
    );

    async function testarConexao() {
      const { error } = await db.from('tarefas').select('id').limit(1);
      document.getElementById('status').innerText = error
        ? "❌ Erro: " + error.message
        : "✅ Conectado com sucesso!";
    }

    testarConexao();
  </script>
</body>
</html>
```

---

## 2. SELECT — listar dados (READ)

```html
<ul id="lista"></ul>

<script>
async function carregarTarefas() {
  const { data, error } = await db
    .from('tarefas')
    .select('*')
    .order('created_at', { ascending: false }); // mais novas primeiro

  if (error) {
    console.error(error);
    return;
  }

  const lista = document.getElementById('lista');
  lista.innerHTML = data.map(t => `<li>${t.titulo}</li>`).join('');
}

carregarTarefas();
</script>
```

**Variações úteis para treinar:**

```js
// Buscar só 1 registro pelo ID
await db.from('tarefas').select('*').eq('id', 5).single();

// Filtrar onde concluida = false
await db.from('tarefas').select('*').eq('concluida', false);

// Buscar por texto parecido (LIKE)
await db.from('tarefas').select('*').ilike('titulo', '%relatório%');

// Contar quantos registros existem
const { count } = await db.from('tarefas').select('*', { count: 'exact', head: true });
```

---

## 3. INSERT — criar dados (CREATE)

```html
<input type="text" id="novoTitulo" placeholder="Nova tarefa">
<button onclick="criarTarefa()">Adicionar</button>

<script>
async function criarTarefa() {
  const titulo = document.getElementById('novoTitulo').value.trim();

  if (!titulo) {
    alert("Digite um título!");
    return;
  }

  const { data, error } = await db
    .from('tarefas')
    .insert([{ titulo: titulo }])
    .select(); // .select() no final retorna o registro criado, com o ID gerado

  if (error) {
    alert("Erro: " + error.message);
    return;
  }

  console.log("Criado com ID:", data[0].id);
  document.getElementById('novoTitulo').value = "";
}
</script>
```

> 💡 `.select()` depois do `.insert()` é o que te dá o ID novo de volta —
> útil quando você precisa, por exemplo, fazer upload de uma imagem
> vinculada a esse registro logo em seguida.

---

## 4. UPDATE — editar dados

```html
<button onclick="marcarConcluida(3)">Marcar tarefa 3 como concluída</button>

<script>
async function marcarConcluida(id) {
  const { error } = await db
    .from('tarefas')
    .update({ concluida: true })
    .eq('id', id);

  if (error) {
    alert("Erro ao atualizar: " + error.message);
  } else {
    alert("Atualizado!");
  }
}
</script>
```

> ⚠️ Erro clássico (igual o que você já corrigiu no seu projeto): se o `id`
> vier de um `input` de texto, ele chega como **string**. Compare sempre
> convertendo: `parseInt(id, 10)`. O Supabase até costuma converter sozinho,
> mas em filtros combinados isso pode causar resultado vazio silenciosamente.

---

## 5. DELETE — apagar dados

```html
<script>
async function deletarTarefa(id) {
  if (!confirm(`Excluir tarefa ${id}?`)) return;

  const { error } = await db
    .from('tarefas')
    .delete()
    .eq('id', id);

  if (error) {
    alert("Erro: " + error.message);
  } else {
    carregarTarefas(); // recarrega a lista
  }
}
</script>
```

---

## 6. Combinando filtros (treino de query builder)

```js
// concluida = false E criada nos últimos 7 dias
const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

await db
  .from('tarefas')
  .select('*')
  .eq('concluida', false)
  .gte('created_at', seteDiasAtras)
  .order('created_at', { ascending: true });
```

| Método      | O que faz                  |
|-------------|-----------------------------|
| `.eq()`     | igual a                    |
| `.neq()`    | diferente de                |
| `.gt()` `.gte()` | maior que / maior ou igual |
| `.lt()` `.lte()` | menor que / menor ou igual |
| `.like()` `.ilike()` | contém texto (ilike ignora maiúsc/minúsc) |
| `.in()`     | está dentro de uma lista    |
| `.is()`     | usado para `null` (`.is('coluna', null)`) |

---

## 7. Realtime — atualizar a tela sozinha quando o banco muda

Isso é algo que o seu Tkinter não faz nativamente, mas no navegador é simples:

```html
<ul id="listaRealtime"></ul>

<script>
// Carrega uma vez ao abrir a página
carregarTarefas();

// Escuta mudanças na tabela e re-renderiza automaticamente
db
  .channel('tarefas-mudancas')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tarefas' },
    (payload) => {
      console.log('Mudança detectada:', payload);
      carregarTarefas(); // simples: recarrega tudo de novo
    }
  )
  .subscribe();
</script>
```

> Abra a mesma página em duas abas do navegador, insira uma tarefa numa
> aba e veja ela aparecer sozinha na outra — sem dar F5.

---

## 8. Upload de imagem isolado (Storage)

Só o upload, sem misturar com formulário de produto:

```html
<input type="file" id="arquivo" accept="image/*">
<button onclick="enviarArquivo()">Enviar</button>
<img id="preview" width="150">

<script>
async function enviarArquivo() {
  const input = document.getElementById('arquivo');
  if (input.files.length === 0) {
    alert("Selecione um arquivo!");
    return;
  }

  const arquivo = input.files[0];
  const nomeUnico = `${Date.now()}-${arquivo.name}`;

  const { error: erroUpload } = await db
    .storage
    .from('imagens-produtos') // nome do bucket
    .upload(nomeUnico, arquivo);

  if (erroUpload) {
    alert("Erro no upload: " + erroUpload.message);
    return;
  }

  const { data } = db.storage.from('imagens-produtos').getPublicUrl(nomeUnico);
  document.getElementById('preview').src = data.publicUrl;
  console.log("URL pública:", data.publicUrl);
}
</script>
```

**Para apagar um arquivo do Storage:**

```js
await db.storage.from('imagens-produtos').remove(['nome-do-arquivo.png']);
```

---

## 9. Autenticação básica (email/senha)

Útil se um dia seu painel de admin precisar de login em vez de ficar aberto:

```html
<input type="email" id="email" placeholder="Email">
<input type="password" id="senha" placeholder="Senha">
<button onclick="login()">Entrar</button>

<script>
async function login() {
  const { data, error } = await db.auth.signInWithPassword({
    email: document.getElementById('email').value,
    password: document.getElementById('senha').value
  });

  if (error) {
    alert("Login falhou: " + error.message);
    return;
  }

  alert("Bem-vindo, " + data.user.email);
}

async function logout() {
  await db.auth.signOut();
}

// Verificar se já existe sessão ativa ao abrir a página
async function verificarSessao() {
  const { data: { session } } = await db.auth.getSession();
  console.log(session ? "Logado como: " + session.user.email : "Não logado");
}
</script>
```

---

## 10. Tratamento de erro — padrão recomendado

Pra você usar como modelo em qualquer função do projeto real:

```js
async function operacaoSegura() {
  try {
    const { data, error } = await db.from('tarefas').select('*');

    if (error) throw error; // joga pro catch

    // sucesso: processa "data" aqui
    return data;

  } catch (err) {
    console.error("Falha na operação:", err.message);
    alert("Algo deu errado: " + err.message);
    return null;
  }
}
```

---

## Erros comuns e como diagnosticar

| Sintoma | Causa provável |
|---|---|
| `supabase.createClient is not a function` | Você nomeou sua variável de `supabase`, sobrescrevendo o objeto global do CDN |
| Lista sempre vazia mesmo com dados na tabela | RLS (Row Level Security) ativada sem política de leitura liberada |
| Erro 400 ao filtrar por `id` | ID está chegando como string de um input — use `parseInt()` |
| Upload funciona mas imagem não carrega | Bucket não está marcado como "Public" |
| `403 Forbidden` no insert/update/delete | RLS bloqueando escrita — crie uma policy ou desative RLS só para testes locais |
| Mudança no banco não aparece na tela | Esqueceu de chamar a função de recarregar a lista depois da operação, ou Realtime não está com `.subscribe()` no final |

---

## Ordem sugerida de estudo

1. Exemplo 1 (conexão) → confirma que as credenciais estão certas
2. Exemplo 2 (SELECT) → entender como os dados voltam (`data`/`error`)
3. Exemplo 3 e 4 (INSERT/UPDATE) → manipular dados
4. Exemplo 5 (DELETE)
5. Exemplo 6 (filtros) → deixar as queries mais poderosas
6. Exemplo 8 (Storage) → só depois de já dominar o CRUD básico
7. Exemplo 7 (Realtime) e 9 (Auth) → opcionais, conforme a necessidade do projeto

Só depois disso faz sentido juntar tudo num único `admin.js` como no seu
compilado — fica bem mais fácil debugar quando você já sabe o que cada
peça faz isoladamente.