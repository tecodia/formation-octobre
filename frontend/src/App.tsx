import './App.css'
import Comments from './components/Comment'
import Feed from './components/Feed'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>GraphQL Formation - Step 9</h1>
        <p>Frontend React + Apollo Client</p>
      </header>
      <main>
        <Comments/>
        <Feed />

      </main>
    </div>
  )
}

export default App
