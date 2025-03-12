import { useMemo, useState } from "react";
import Edit from "../Edit/Edit";
import './Modal.styles.css';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    username?: string;
}

export type TodoItemType = {
    id: string;
    startDate: number;
    completed: boolean;
    completionDate?: number;
    text: string;
    isEditing: boolean;
}

type ItemType = {
    startDate: number;
    text?: string;
}

type FilterType = "all" | "done" | "progress";

const Modal = ({ isOpen, onClose, username }: ModalProps) => {
    const [todosList, setTodosList] = useState<TodoItemType[]>([]);
    const [filter, setFilter] = useState<FilterType>("all");
    const [newTodo, setNewTodo] = useState<ItemType>({
        startDate: Date.now(),
        text: "",
    });
    const [todoEditing, setTodoEditing] = useState<TodoItemType | null>(null);

    const filteredTodos = useMemo(
        () => {
            switch (filter) {
                case "done":
                    return todosList.filter(todo => todo.completed)
                case "progress":
                    return todosList.filter(todo => !todo.completed)
                    break;
                default:
                    return todosList;
            }
        },
        [todosList, filter]
    );

    const addItem = () => {
        const newItem: TodoItemType = {
            id: (Date.now()).toString(),
            startDate: newTodo?.startDate || Date.now(),
            completed: false,
            text: newTodo?.text || "",
            isEditing: false
        };
        setTodosList([...todosList, newItem]);
        setNewTodo({
            text: "",
            startDate: Date.now()
        });
    }

    const deleteItem = (id: string) => {
        const newTodoList = [...todosList];
        const index = newTodoList.findIndex(todo => todo.id === id);
        newTodoList.splice(index, 1);
        setTodosList([...newTodoList]);
    }

    const toggleCompletion = (id: string) => {
        const newTodoList = [...todosList];
        const index = newTodoList.findIndex(todo => todo.id === id);
        const newItem = newTodoList[index];
        newItem.completed = !newItem.completed;

        if (newItem.completed) {
            newItem.completionDate = Date.now();
        } else {
            delete newItem.completionDate;
        }

        newTodoList[index] = newItem;
        setTodosList(newTodoList);
    }

    const onSaveEditingTodo = (item: TodoItemType) => {
        const newTodoList = [...todosList];
        const index = newTodoList.findIndex(todo => todo.id === item.id);
        newTodoList[index] = item;
        setTodosList(newTodoList);
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    }

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container">

                <div className="modal-header">
                    <h2>{`Tarefas de ${username}`}</h2>
                    <div>
                        <select className="todos-filter" onChange={(e) => setFilter(e.target.value as FilterType)}>
                            <option value="all">Todas</option>
                            <option value="progress">Não Concluídas</option>
                            <option value="done">Concluídas</option>
                        </select>
                    </div>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="modal-imput">
                    <input className="input" maxLength={100} value={newTodo?.text} onChange={(e) => {
                        const newItemOldState = { ...newTodo };
                        newItemOldState.text = e.target.value;
                        setNewTodo(newItemOldState);
                    }} placeholder="Adicionar tarefa..." />
                    <input type="date" className="input" value={new Date(newTodo.startDate).toISOString().substring(0, 10)} onChange={(e) => {
                        const newItemOldState = { ...newTodo };
                        newItemOldState.startDate = Date.parse(e.target.value);
                        setNewTodo(newItemOldState);
                    }} />
                    <button className="todo-add-btn" disabled={!newTodo?.startDate || !newTodo?.text} onClick={addItem}>+</button>
                </div>

                <ul className="modal-list">
                    {filteredTodos.length == 0 && <div className="no-to-dos">
                        <p>Sem tarefas, ainda!</p>
                    </div>}
                    {filteredTodos.map(item => {
                        return (
                            <li key={item.id} className="todo-item">
                                <input className="todo-checkbox" type="checkbox" disabled={new Date() < new Date(item.startDate)} checked={item.completed} onChange={() => toggleCompletion(item.id)} />
                                <div className={`todo-item-info ${item.completed && "completed"}`}>
                                    <div className="todo-title">{item.text}</div>
                                    <div><b>Início:</b> {formatDate(item.startDate)}</div>
                                    {item?.completionDate && <div><b>Conclusão:</b> {formatDate(item.completionDate)}</div>}
                                </div>
                                <div className="todo-item-actions">
                                    <button onClick={() => setTodoEditing(item)}>Editar</button>
                                    <button onClick={() => deleteItem(item.id)}>Remover</button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <Edit isOpen={!!todoEditing} onClose={() => setTodoEditing(null)} item={todoEditing} onSave={onSaveEditingTodo} />
        </div>
    );
}

export default Modal;