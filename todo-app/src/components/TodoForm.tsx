import React, { useState } from 'react';
import { Todo } from '../types/todo';
import { useRouter } from 'next/navigation';

interface TodoFormProps {
  todoData: Todo;
  onSubmit: (todoData: Todo) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todoData, onSubmit }) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Todo>({ ...todoData });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0]; // 無効な日時値の場合は空文字列を返す
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title === '' || formData.description === '' || !formData.status || formData.dueDate === '') {
      setError('All fields are required.');
      return;
    }
    setError('');

    // 新規登録の場合
    if (!formData.id) {
      const id = crypto.randomUUID(); // 新規作成時のID生成
      const createdAt = new Date().toISOString(); // 作成日時を現在の日時に設定
      const updatedAt = createdAt; // 更新日時を作成日時と同じに設定
      onSubmit({ ...formData, id, createdAt, updatedAt, dueDate: formatDate(formData.dueDate) });
    } else {
      // 更新の場合
      const updatedAt = new Date().toISOString(); // 更新日時を現在の日時に設定
      onSubmit({ ...formData, updatedAt, dueDate: formatDate(formData.dueDate) });
    }

    router.push('/todo'); // フォーム送信後にリスト画面に戻る
  };

  const handleChange = (field: keyof Todo, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Title:</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)} // フォームデータを更新
          required
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Description:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)} // フォームデータを更新
          required
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Status:</label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)} // フォームデータを更新
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Due Date:</label>
        <input
          type="date"
          id="dueDate"
          value={formatDate(formData.dueDate)}
          onChange={(e) => handleChange('dueDate', e.target.value)} // フォームデータを更新
          required
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
      <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900">
        Submit
      </button>
    </form>
  );
};

export default TodoForm;