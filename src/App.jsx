import './App.css'
import Titulo from './components/Titulo'
import Subtitulo from './components/Subtitulo'
import BloqueJuego from './BloqueJuego'

function App() {
  const titulo = "El sabio guerrero"
  const subTitulo = "Guerrero, el mundo ha sido caputrado por un malefico demonio. Tu misión es responderle las 5 preguntas y salva al mundo del caos."

  return (
    <>
      <Titulo texto={titulo}></Titulo>
      <Subtitulo texto={subTitulo}></Subtitulo>
      <main>
        <BloqueJuego></BloqueJuego>
      </main>
    </>
  )
}

export default App
