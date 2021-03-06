import {Todo, TodoStatus} from '../models/todo';
import {
  AppActions,
  SET_TODO,
  CREATE_TODO,
  DELETE_ALL_TODOS,
  DELETE_TODO,
  TOGGLE_ALL_TODOS,
  UPDATE_TODO_STATUS,
  UPDATE_TODO_CONTENT
} from './actions';

export interface AppState {
  todos: Array<Todo>
}

export const initialState: AppState = {
  todos: []
}

const saveToLocalStorage = (todos: Array<Todo>) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};


function reducer(state: AppState, action: AppActions): AppState {
  switch (action.type) {
    // added
    case SET_TODO:
      state.todos = [...action.payload];
      return {
        ...state
      };
    case CREATE_TODO:
      state.todos.push(action.payload);
      // added
      saveToLocalStorage(state.todos);
      return {
        ...state
      };

    case UPDATE_TODO_STATUS:
      const index2 = state.todos.findIndex((todo) => todo.id === action.payload.todoId);
      state.todos[index2].status = action.payload.checked ? TodoStatus.COMPLETED : TodoStatus.ACTIVE;
      // added
      saveToLocalStorage(state.todos);

      return {
        ...state,
        todos: state.todos
      }
    
    // added
    case UPDATE_TODO_CONTENT:
      const index = action.payload.index;
      state.todos[index].content = action.payload.todoContent;
      // added
      saveToLocalStorage(state.todos);

      return {
        ...state,
        todos: state.todos
      }

    case TOGGLE_ALL_TODOS:
      const tempTodos = state.todos.map((e)=>{
        return {
          ...e,
          status: action.payload ? TodoStatus.COMPLETED : TodoStatus.ACTIVE
        }
      })

      // added
      saveToLocalStorage(tempTodos);

      return {
        ...state,
        todos: tempTodos
      }

    case DELETE_TODO:
      const index1 = state.todos.findIndex((todo) => todo.id === action.payload);
      state.todos.splice(index1, 1);
      // added
      saveToLocalStorage(state.todos);

      return {
        ...state,
        todos: state.todos
      }
    case DELETE_ALL_TODOS:
      // added
      saveToLocalStorage([]);

      return {
        ...state,
        todos: []
      }
    default:
      return state;
  }
}

export default reducer;