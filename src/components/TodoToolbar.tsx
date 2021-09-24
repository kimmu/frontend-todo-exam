import React from "react";
import {Todo, TodoStatus} from '../models/todo';

type Props = {
    todos: Array<Todo>,
    activeTodos: number,
    activeClass: ActiveClass,
    onToggleAllTodo: (e: React.ChangeEvent<HTMLInputElement>) => void,
    toggleActiveBtn: (status: EnhanceTodoStatus) => void,
    onDeleteAllTodo: () => void
};

interface ActiveClass {
    ALL: boolean,
    ACTIVE: boolean,
    COMPLETED: boolean
};

type EnhanceTodoStatus = TodoStatus | 'ALL';

const TodoToolbar = ({ todos, activeTodos, onToggleAllTodo, activeClass, toggleActiveBtn, onDeleteAllTodo} : Props) => {

    return (
        <div className="Todo__toolbar">
            {todos.length > 0 ?
                <input
                    type="checkbox"
                    checked={activeTodos === 0}
                    onChange={onToggleAllTodo}
                /> : <div/>
            }
            <div className="Todo__tabs">
                <button className={"Action__btn " + (activeClass['ALL'] ? 'active' : '')} onClick={()=>toggleActiveBtn('ALL')}>
                    All
                </button>
                <button className={"Action__btn " + (activeClass['ACTIVE'] ? 'active' : '')} onClick={()=>toggleActiveBtn(TodoStatus.ACTIVE)}>
                    Active
                </button>
                <button className={"Action__btn " + (activeClass['COMPLETED'] ? 'active' : '')} onClick={()=>toggleActiveBtn(TodoStatus.COMPLETED)}>
                    Completed
                </button>
            </div>
            <button className="Action__btn" onClick={onDeleteAllTodo}>
                Clear todos
            </button>
        </div>
    );
};


export default TodoToolbar;