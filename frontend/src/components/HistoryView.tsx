import { Card } from '../ui/card';
import { MealCard } from '../components/MealCard';
import type { Meal } from '../../App';

interface HistoryViewProps {
  meals: Meal[];
  onDelete: (id: string) => void;
}

export function HistoryView({ meals, onDelete }: HistoryViewProps) {
  // Group meals by date
  const mealsByDate = meals.reduce((acc, meal) => {
    const date = new Date(meal.timestamp);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  const sortedDates = Object.keys(mealsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (sortedDates.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No meals logged yet</p>
        <p className="text-gray-400 mt-2">Start tracking your baby's meals!</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-700">{formatDate(dateKey)}</h2>
            <span className="text-[#5FCFD4]">{mealsByDate[dateKey].length} feedings</span>
          </div>
          <div className="space-y-3">
            {mealsByDate[dateKey].map((meal) => (
              <MealCard key={meal.id} meal={meal} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
