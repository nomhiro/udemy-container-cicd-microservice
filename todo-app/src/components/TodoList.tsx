"use client";

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onEdit, onDelete }) => {

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md h-[calc(100vh-96px)] overflow-y-auto">
      {/* 高さを固定し、スクロールを有効にするために `h-[calc(100vh-96px)]` を使用 */}
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 last:border-none bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 shadow-sm space-x-4 relative group"
          >
            <div className="flex-1">
              <span
                className={`block cursor-pointer text-blue-500 hover:underline ${todo.status === 'Completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-300'}`}
                data-tooltip-id={`tooltip-${todo.id}`}
                onClick={() => onEdit(todo)}
              >
                {todo.title}
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span>Status: {todo.status}</span>
                <span className="ml-4">Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => onEdit(todo)}
              className="text-yellow-500 hover:text-yellow-600"
              aria-label="Edit"
            >
              <FaEdit size={20} />
            </button>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-600 ml-2"
              aria-label="Delete"
            >
              <FaTrash size={20} />
            </button>
            <Tooltip
              id={`tooltip-${todo.id}`}
              className="bg-gray-800 text-white p-2 rounded shadow-lg z-50" // z-index を追加
              anchorSelect={`[data-tooltip-id="tooltip-${todo.id}"]`}
            >
              <p><strong>Description:</strong> {todo.description}</p>
              <p><strong>Status:</strong> {todo.status}</p>
              <p><strong>Due:</strong> {new Date(todo.dueDate).toLocaleString()}</p>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;