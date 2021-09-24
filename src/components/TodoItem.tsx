import React, {useReducer, useState, useRef} from "react";
import { useHistory } from "react-router-dom";

import {isTodoCompleted} from "../utils";
import {Todo} from '../models/todo';

import reducer, {initialState} from '../store/reducer';
import {
    deleteTodo,
    updateTodoStatus,
    updateTodoContent
} from '../store/actions';

type Props = {
    index: number,
    todo: Todo
};

const TodoItem = ({index, todo} : Props) => {

    const [{}, dispatch] = useReducer(reducer, initialState);
    const [textToggle, setTextToggle] = useState({ toggle: false, item: -1 });
    const editTodoRef = useRef<HTMLInputElement>(null);

    const [tempInput, setTempInput] = useState('');

    const history = useHistory();

    const onUpdateTodoStatus = (e: React.ChangeEvent<HTMLInputElement>, todoId: string) => {
        dispatch(updateTodoStatus(todoId, e.target.checked))
    }

    const setEditToggle = (bool: boolean, index: number, content: string) => {
        setTempInput(content);
        setTextToggle({ ...textToggle, toggle: bool, item: index });
    };

    const updateTodo = async (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter' && editTodoRef.current) {
            try {

                if (editTodoRef.current.value.trim() !== '')
                    dispatch(updateTodoContent(index, editTodoRef.current.value));

                setEditToggle(false, -1, '');
                editTodoRef.current.value = '';
            } catch (e) {
                if (e.response.status === 401) {
                    history.push('/')
                }
            }
        }
    }

    const displayInput = (value: string) => {
        setTempInput(value);
    };

    return (
        <div key={index} className="ToDo__item">
            <input
                type="checkbox"
                checked={isTodoCompleted(todo)}
                onChange={(e) => onUpdateTodoStatus(e, todo.id)}
            />
            {
                textToggle.item === index ?
                <input
                    ref={editTodoRef}
                    className="Todo__edit"
                    placeholder={todo.content}
                    value={tempInput}
                    onChange={e => displayInput(e.target.value)}
                    onKeyDown={(e) => updateTodo(e, index)}
                /> :
                <span
                    className="Todo__item__text"
                    onDoubleClick={() => {setEditToggle(false, index, todo.content)}}>
                        {todo.content}
                </span>
            }

            <button
                className="Todo__delete"
                onClick={() => dispatch(deleteTodo(todo.id))}
            >
                x
            </button>
        </div>
    );
};

export default TodoItem;