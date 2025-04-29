"use client";

import React from 'react';
import TodoForm from '../../../components/TodoForm';
import { useRouter } from 'next/navigation';
import { Todo } from '../../../types/todo';

const CreateTodoPage = () => {
  const router = useRouter();

  const handleSubmit = async (todoData: Todo) => {
    // const apiBaseUrl = process.env.API_BASE_URL;

    const response = await fetch(`/api/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });

    if (response.ok) {
      router.push('/todo');
    } else {
      console.error('Failed to create todo');
    }
  };

  const initialTodo: Todo = {
    id: '',
    title: '',
    description: '',
    status: 'Not Started',
    dueDate: '', // 空文字列を設定
    createdAt: '',
    updatedAt: '',
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Create New Task</h1>
        <TodoForm todoData={initialTodo} onSubmit={handleSubmit} />
        <button
          onClick={() => router.back()} // 戻るボタンの動作
          className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          戻る
        </button>
      </div>
    </div>
  );
};

export default CreateTodoPage;
