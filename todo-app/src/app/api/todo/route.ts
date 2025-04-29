import { NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

console.log('COSMOS_DB_ENDPOINT:', endpoint || 'Not Defined');
console.log('COSMOS_DB_KEY:', key ? 'Defined' : 'Not Defined'); // セキュリティのため値は表示しない

if (!endpoint || !key) {
  throw new Error('COSMOS_DB_ENDPOINT or COSMOS_DB_KEY is not defined in environment variables.');
}

const databaseId = 'ToDoApp';
const containerId = 'ToDo';

const client = new CosmosClient({ endpoint, key });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    if (id) {
      // 特定のIDのTODOを取得
      const { resource } = await container.item(id, id).read();
      if (!resource) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
      }
      return NextResponse.json(resource);
    } else {
      // 全TODOを取得
      const { resources: todos } = await container.items.readAll().fetchAll();
      todos.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      return NextResponse.json(todos);
    }
  } catch (error) {
    console.error('Error fetching todos from Cosmos DB:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const body = await req.json(); // リクエストボディを一度だけ読み取る
    console.log('Request body:', body); // デバッグ用ログ

    const { id, title, description, status, dueDate, createdAt, updatedAt } = body;

    // 必須フィールドの検証
    if (!id || !title || !description || !status || !dueDate || !createdAt || !updatedAt) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // フィールドの形式を検証
    if (typeof id !== 'string' || typeof title !== 'string' || typeof description !== 'string' || typeof status !== 'string') {
      return NextResponse.json({ error: 'Invalid data types for fields' }, { status: 400 });
    }

    if (isNaN(Date.parse(dueDate)) || isNaN(Date.parse(createdAt)) || isNaN(Date.parse(updatedAt))) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const todo = { id, title, description, status, createdAt, updatedAt, dueDate };
    console.log('Creating todo:', todo); // デバッグ用ログ

    const { resource } = await container.items.create(todo);

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating todo in Cosmos DB:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const { id, title, description, status, createdAt, dueDate } = await req.json(); // dueDateを追加

    if (!id) {
      return NextResponse.json({ error: 'ID is required for updating a todo' }, { status: 400 });
    }

    const updatedAt = new Date().toISOString(); // 更新日時を現在の日時に設定
    const todo = { id, title, description, status, createdAt, updatedAt, dueDate }; // dueDateを含める

    console.log('Updating todo:', todo); // デバッグ用ログ

    // PartitionKeyを指定してアイテムを更新
    const { resource } = await container.item(id, id).replace(todo);

    return NextResponse.json(resource);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating todo in Cosmos DB:', error.message, error);
    } else {
      console.error('Error updating todo in Cosmos DB:', error);
    }

    // エラーの詳細をレスポンスに含める
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update todo', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required for deleting a todo' }, { status: 400 });
    }

    await container.item(id, id).delete();

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo from Cosmos DB:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
