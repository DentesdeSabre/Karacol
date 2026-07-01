
import { useState } from 'react';
import { ListaProdutos } from './components/ListarProdutos';

import './App.css';

function App() {
  
  return (
    <div className="app">
      <header>
        <h1>🚀 Gerenciador de Produtos</h1>
      </header>
      
      <main>
        <div className="container">
          <ListaProdutos ListaProdutos></ListaProdutos>
        </div>
      </main>
    </div>
  );
}

export default App;