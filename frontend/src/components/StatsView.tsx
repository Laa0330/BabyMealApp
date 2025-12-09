import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Baby, Milk, Utensils, Cookie, TrendingUp } from 'lucide-react';
import type { Meal } from '../../App';

interface StatsViewProps {
  meals: Meal[];
}

export function StatsView({ meals }: StatsViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.timestamp);
    mealDate.setHours(0, 0, 0, 0);
    return mealDate.getTime() === today.getTime();
  });

  const mealTypeCounts = meals.reduce((acc, meal) => {
    acc[meal.type] = (acc[meal.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const todayTypeCounts = todaysMeals.reduce((acc, meal) => {
    acc[meal.type] = (acc[meal.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  // Get the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const dailyCounts = last7Days.map((date) => {
    const dateKey = date.toISOString().split('T')[0];
    const count = meals.filter((meal) => {
      const mealDate = new Date(meal.timestamp);
      const mealDateKey = mealDate.toISOString().split('T')[0];
      return mealDateKey === dateKey;
    }).length;
    return { date, count };
  });

  const avgMealsPerDay = meals.length > 0 
    ? (dailyCounts.reduce((sum, day) => sum + day.count, 0) / 7).toFixed(1)
    : 0;

  if (meals.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No data to show yet</p>
        <p className="text-gray-400 mt-2">Start logging meals to see statistics</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Today's Summary */}
      <Card className="p-5 rounded-2xl">
        <h2 className="text-gray-700 mb-4">Today's Summary</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Feedings</span>
          <span className="text-[#5FCFD4]">{todaysMeals.length}</span>
        </div>
      </Card>

      {/* Meal Type Breakdown (Today) */}
      <Card className="p-5 rounded-2xl">
        <h2 className="text-gray-700 mb-4">Today's Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(mealTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const count = todayTypeCounts[type] || 0;
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">{config.label}</span>
                </div>
                <Badge variant="outline" className={config.color}>
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 7-Day Overview */}
      <Card className="p-5 rounded-2xl">
        <h2 className="text-gray-700 mb-4">7-Day Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Average per day</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#5FCFD4]" />
              <span className="text-[#5FCFD4]">{avgMealsPerDay}</span>
            </div>
          </div>
          <div className="space-y-2">
            {dailyCounts.map(({ date, count }) => {
              const isToday = date.getTime() === today.getTime();
              const dayLabel = isToday 
                ? 'Today' 
                : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              return (
                <div key={date.toISOString()} className="flex items-center gap-2">
                  <span className={`text-gray-600 flex-1 ${isToday ? 'text-[#5FCFD4]' : ''}`}>
                    {dayLabel}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#5FCFD4] h-full rounded-full transition-all"
                      style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className={`text-gray-600 w-8 text-right ${isToday ? 'text-[#5FCFD4]' : ''}`}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* All Time Stats */}
      <Card className="p-5 rounded-2xl">
        <h2 className="text-gray-700 mb-4">All Time</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Feedings</span>
            <span className="text-[#5FCFD4]">{meals.length}</span>
          </div>
          {Object.entries(mealTypeConfig).map(([type, config]) => {
            const count = mealTypeCounts[type] || 0;
            return (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-600">{config.label}</span>
                <span className="text-gray-700">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
