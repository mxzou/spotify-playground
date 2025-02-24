import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/globals.css'

console.log('Client script loaded')
console.log('React initialization starting...')
console.log('Document ready state:', document.readyState)
console.log('DOM content:', document.body.innerHTML)

const root = document.getElementById('root')
console.log('Root element found:', !!root)

if (root) {
  console.log('Mounting React app')
  createRoot(root).render(<App />)
} else {
  console.error('Root element not found!')
} 