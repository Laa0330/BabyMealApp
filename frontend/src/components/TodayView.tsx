import { Card } from '../ui/card';
import { MealCard } from './MealCard';
import type { Meal } from '../../App';

interface TodayViewProps {
  meals: Meal[];
  onDelete: (id: string) => void;
}

export function TodayView({ meals, onDelete }: TodayViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp);
    mealDate.setHours(0, 0, 0, 0);
    return mealDate.getTime() === today.getTime();
  });

  if (todaysMeals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No meals logged today yet</p>
        <p className="text-gray-400 mt-2">Tap the + button to add a meal</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-700">Today's Feedings</h2>
        <span className="text-[#5FCFD4]">{todaysMeals.length} feedings</span>
      </div>
      {todaysMeals.map((meal) => (
        <MealCard key={meal.id} meal={meal} onDelete={onDelete} />
      ))}
    </div>
  );
}
