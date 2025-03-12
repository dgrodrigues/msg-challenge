import { useState } from "react";
import Modal from "./components/Modal/Modal";
import './App.css'

const App = () => {
  const [username, setUsername] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);


  return (
    <>
      <h1>To Do</h1>
      <div className="user-info">
        <input
          type="text"
          className="input"
          placeholder='O seu nome...'
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <button disabled={!username.trim()} onClick={() => setModalOpen(true)} className="view-tasks-btn">Visualizar Tarefas</button>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} username={username} />
      <p className="info-how-to">
        Preencha o camop para ver as suas taredas.
      </p>
    </>
  )
}

export default App
