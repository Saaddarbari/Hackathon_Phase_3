import TodoItem from './TodoItem';

interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
}

interface TodoListProps {
  todos: Todo[];
  onUpdate: () => void;
}

export default function TodoList({ todos, onUpdate }: TodoListProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

