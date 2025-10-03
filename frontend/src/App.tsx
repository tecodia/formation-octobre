import './App.css'
import Feed from './components/Feed'
import FeedPaginated from './components/FeedPaginated'
import { useState } from 'react'

function App() {
  const [showPaginated, setShowPaginated] = useState(true)

  return (
    <div className="App">
      <header className="App-header">
        <h1>GraphQL Formation - Step 10</h1>
        <p>Pagination Cursor-based avec Apollo Client</p>
        <div className="mt-4">
          <button
            onClick={() => setShowPaginated(!showPaginated)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showPaginated ? 'Voir Feed Complet' : 'Voir Feed Paginé'}
          </button>
        </div>
      </header>
      <main>
        {showPaginated ? <FeedPaginated /> : <Feed />}
      </main>
    </div>
  )
}

export default App
