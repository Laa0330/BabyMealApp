import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Baby, Milk, Utensils, Cookie, Trash2 } from 'lucide-react';
import type { Meal } from '../../App';

interface MealCardProps {
  meal: Meal;
  onDelete: (id: string) => void;
}

const mealTypeConfig = {
  breast: {
    icon: Baby,
    label: 'Breast',
    color: 'bg-[#E0F4F5] text-[#5FCFD4] border-[#B2F5EA]',
  },
  bottle: {
    icon: Milk,
    label: 'Bottle',
    color: 'bg-[#E0F4F5] text-[#5FCFD4] border-[#B2F5EA]',
  },
  solid: {
    icon: Utensils,
    label: 'Solid',
    color: 'bg-[#E0F4F5] text-[#5FCFD4] border-[#B2F5EA]',
  },
  snack: {
    icon: Cookie,
    label: 'Snack',
    color: 'bg-[#E0F4F5] text-[#5FCFD4] border-[#B2F5EA]',
  },
};

export function MealCard({ meal, onDelete }: MealCardProps) {
  const config = mealTypeConfig[meal.type];
  const Icon = config.icon;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow rounded-2xl">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${config.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
            <span className="text-gray-500">{formatTime(meal.timestamp)}</span>
          </div>
          
          {meal.food && (
            <p className="text-gray-900 mb-1">{meal.food}</p>
          )}
          
          {meal.amount && (
            <p className="text-gray-600">{meal.amount}</p>
          )}
          
          {meal.notes && (
            <p className="text-gray-500 mt-2 italic">{meal.notes}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(meal.id)}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
