import { useState } from "react"
import "./App.css"
import HomePage from "./pages/HomePage"
import Header from "./components/Header"

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <HomePage searchQuery={searchQuery} />
    </>
  )
}

export default App
