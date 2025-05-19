import CommentSection from "./components/CommentSection"
import { ThemeProvider } from "./components/ThemeProvider"
import "./App.css"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Discussion</h1>
        <CommentSection />
      </div>
    </ThemeProvider>
  )
}

export default App
