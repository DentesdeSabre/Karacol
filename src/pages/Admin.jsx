import { useState } from 'react';
import { ListaProdutos } from '../components/ListaProdutos';

function App(){
    return (
        <div>
          <header>
            <h1>🚀 Gerenciador de Produtos</h1>
            <h1>Aqui é admin</h1>
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