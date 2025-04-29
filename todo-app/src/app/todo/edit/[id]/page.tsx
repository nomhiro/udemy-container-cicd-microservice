"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import TodoForm from '../../../../components/TodoForm';
import { Todo } from '../../../../types/todo';

const EditTodoPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      const response = await fetch(`/api/todo?id=${id}`);
      if (response.ok) {
        const data: Todo = await response.json();
        setTodo(data);
      } else {
        console.error('Failed to fetch todo');
      }
    };

    if (id) {
      fetchTodo();
    }
  }, [id]);

  const handleSubmit = async (todoData: Todo) => {
    const response = await fetch(`/api/todo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });

    if (response.ok) {
      router.push('/todo');
    } else {
      console.error('Failed to update todo');
    }
  };

  const handleDelete = async () => {
    if (confirm('本当にこのTODOを削除しますか？')) {
      const response = await fetch(`/api/todo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        router.push('/todo');
      } else {
        console.error('Failed to delete todo');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-10 relative">
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          aria-label="Delete Todo"
        >
          <FaTrash />
        </button>
        <h1 className="text-3xl font-bold mb-6">Edit TODO</h1>
        {todo && (
          <TodoForm
            todoData={todo}
            onSubmit={handleSubmit}
          />
        )}
        <button
          onClick={() => router.back()}
          className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default EditTodoPage;
