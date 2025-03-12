import { useEffect, useState } from "react";
import { TodoItemType } from "../Modal/Modal";
import './Edit.styles.css';

type EditProps = {
    item: TodoItemType | null;
    onClose: () => void;
    onSave: (item: TodoItemType) => void;
    isOpen: boolean;
}

const Edit = ({ isOpen, onClose, onSave, item }: EditProps) => {
    const [todoContent, setTodoContent] = useState<TodoItemType | null>(null);

    useEffect(() => {
        if (item) {
            setTodoContent(item);
        }
    }, [item])

    if (!isOpen || !todoContent) return null;

    const saveItem = () => {
        onSave(todoContent);
        onClose();
    }

    return (
        <div className="edit-modal-backdrop">
            <div className="edit-modal-container">

                <div className="edit-modal-header">
                    <h2>Editar Tarefa</h2>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="edit-modal-imput">
                    <input className="input" maxLength={100} value={todoContent?.text} onChange={(e) => {
                        const newItemOldState = { ...todoContent };
                        newItemOldState.text = e.target.value;
                        setTodoContent(newItemOldState);
                    }} placeholder="Tarefa" />
                    <input type="date" className="input" value={new Date(todoContent.startDate).toISOString().substring(0, 10)} onChange={(e) => {
                        const newItemOldState = { ...todoContent };
                        newItemOldState.startDate = Date.parse(e.target.value);
                        setTodoContent(newItemOldState);
                    }} />
                    <div className="edit-modal-actions">
                        <button onClick={onClose}>Cancelar</button>
                        <button disabled={!todoContent?.startDate || !todoContent?.text} onClick={saveItem}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Edit;