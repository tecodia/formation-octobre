import './App.css'
import Feed from './components/Feed'
import FeedPaginated from './components/FeedPaginated'
import PostDetail from './components/PostDetail'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

function App() {
  const [showPaginated, setShowPaginated] = useState(true)

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="App-header">
                <h1>GraphQL Formation - Step 11</h1>
                <p>Page détail post avec commentaires et mutation</p>
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
            </>
          }
        />
        <Route
          path="/post/:postId"
          element={
            <>
              <header className="App-header">
                <h1>GraphQL Formation - Step 11</h1>
                <p>Détail du post</p>
              </header>
              <main>
                <PostDetail />
              </main>
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
