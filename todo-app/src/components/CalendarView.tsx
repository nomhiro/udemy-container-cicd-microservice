"use client";

import React from 'react';
import { Todo } from '../types/todo';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';

const locales = {
  'ja': ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  todos: Todo[];
  onEdit: (todo: Todo) => void; // onEdit プロップを追加
}

const CalendarView: React.FC<CalendarViewProps> = ({ todos, onEdit }) => {
  const events = todos.map(todo => ({
    title: todo.title,
    start: new Date(todo.dueDate),
    end: new Date(todo.dueDate),
    allDay: true,
    description: todo.description,
    status: todo.status,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    todo, // 元のTodoデータを保持
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">カレンダー</h2>
      <div className="rbc-calendar bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          culture="ja"
          views={['month', 'week', 'day', 'agenda']} // カレンダーの切り替えを有効化
          components={{
            event: ({ event }) => (
              <div
                className="cursor-pointer"
                onClick={() => onEdit(event.todo)} // クリック時にonEditを呼び出す
              >
                {event.title}
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
