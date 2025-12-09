import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../frontend/src/ui/tabs';
import { Button } from '../frontend/src//ui/button';
import { Plus, LogOut } from 'lucide-react';
import { MealForm } from '../frontend/src/components/MealForm';
import { TodayView } from '../frontend/src/components/TodayView';
import { HistoryView } from '../frontend/src/components/HistoryView';
import { StatsView } from '../frontend/src/components/StatsView';
import { LoginPage } from '../frontend/src/components/LoginPage';

export interface Meal {
  id: string;
  timestamp: Date;
  type: 'breast' | 'bottle' | 'solid' | 'snack';
  food?: string;
  amount?: string;
  notes?: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      timestamp: new Date(2025, 10, 9, 8, 30),
      type: 'breast',
      amount: '15 minutes',
      notes: 'Left side'
    },
    {
      id: '2',
      timestamp: new Date(2025, 10, 9, 11, 0),
      type: 'solid',
      food: 'Mashed banana',
      amount: '3 spoonfuls',
    },
    {
      id: '3',
      timestamp: new Date(2025, 10, 9, 14, 30),
      type: 'bottle',
      amount: '4 oz',
    },
    {
      id: '4',
      timestamp: new Date(2025, 10, 8, 17, 0),
      type: 'snack',
      food: 'Apple puree',
      amount: '2 oz',
    },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    setMeals([
      {
        ...meal,
        id: Date.now().toString(),
      },
      ...meals,
    ]);
    setIsFormOpen(false);
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="mb-6 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-center flex-1" style={{ color: '#2D3748' }}>Baby Feeding Tracker</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-400 hover:text-[#5FCFD4]"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-center text-gray-600">Track your baby's growth, one feed at a time</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <TodayView meals={meals} onDelete={deleteMeal} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoryView meals={meals} onDelete={deleteMeal} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <StatsView meals={meals} />
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[#5FCFD4] hover:bg-[#4FB9BE]"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Meal Form Dialog */}
        <MealForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={addMeal}
        />
      </div>
    </div>
  );
}
