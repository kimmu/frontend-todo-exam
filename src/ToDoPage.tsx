import React, {useEffect, useReducer, useRef, useState} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import reducer, {initialState} from './store/reducer';
import {
    setTodos,
    createTodo,
    toggleAllTodos,
    deleteAllTodos,
} from './store/actions';
import Service from './service';
import {TodoStatus} from './models/todo';
import {isTodoCompleted} from './utils';

import TodoToolbar from './components/TodoToolbar';
import TodoItem from './components/TodoItem';
import { ReactComponent as ReminderSVG } from './reminder.svg';

type EnhanceTodoStatus = TodoStatus | 'ALL';

const ToDoPage = ({history}: RouteComponentProps) => {
    const [{todos}, dispatch] = useReducer(reducer, initialState);
    const [showing, setShowing] = useState<EnhanceTodoStatus>('ALL');
    const inputRef = useRef<HTMLInputElement>(null);
    const [activeClass, setActiveClass] = useState({
        'ALL': true,
        'ACTIVE': false,
        'COMPLETED': false
    });

    useEffect(()=>{
        (async ()=>{
            const resp = await Service.getTodos();

            // local storage
            dispatch(setTodos(resp || []));
        })()
    }, [])

    const onCreateTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputRef.current) {
            try {
                const resp = await Service.createTodo(inputRef.current.value);
                dispatch(createTodo(resp));
                inputRef.current.value = '';
            } catch (e) {
                if (e.response.status === 401) {
                    history.push('/')
                }
            }
        }
    }

    const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleAllTodos(e.target.checked))
    }

    const onDeleteAllTodo = () => {
        dispatch(deleteAllTodos());
    }

    const showTodos = todos.filter((todo) => {
        switch (showing) {
            case TodoStatus.ACTIVE:
                return todo.status === TodoStatus.ACTIVE;
            case TodoStatus.COMPLETED:
                return todo.status === TodoStatus.COMPLETED;
            default:
                return true;
        }
    });

    const activeTodos = todos.reduce(function (accum, todo) {
        return isTodoCompleted(todo) ? accum : accum + 1;
    }, 0);

    const toggleActiveBtn = (status: EnhanceTodoStatus) => {
        const obj = {
            'ALL': false,
            'ACTIVE': false,
            'COMPLETED': false
        };
        setActiveClass({ ...obj, [status]: true });
        setShowing(status);
    }

    return (
        <div className="ToDo__container">
            <div className="Todo__creation">
                <ReminderSVG height={50} width={90}></ReminderSVG>
                <input
                    ref={inputRef}
                    className="Todo__input"
                    placeholder="What needs to be done?"
                    onKeyDown={onCreateTodo}
                />
            </div>
            <div className="ToDo__list">
                {
                    showTodos.map((todo, index) => {
                        return <TodoItem key={index} index={index} todo={todo} />
                    })
                }
            </div>
            <TodoToolbar 
                todos={todos}
                activeTodos={activeTodos}
                onToggleAllTodo={onToggleAllTodo}
                activeClass={activeClass}
                toggleActiveBtn={toggleActiveBtn}
                onDeleteAllTodo={onDeleteAllTodo}
            />
        </div>
    );
};

export default ToDoPage;