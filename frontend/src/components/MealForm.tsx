import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Baby, Milk, Utensils, Cookie } from 'lucide-react';
import type { Meal } from '../../App';

interface MealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (meal: Omit<Meal, 'id'>) => void;
}

export function MealForm({ open, onOpenChange, onSubmit }: MealFormProps) {
  const [type, setType] = useState<Meal['type']>('breast');
  const [food, setFood] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [hours, minutes] = time.split(':').map(Number);
    const timestamp = new Date();
    timestamp.setHours(hours, minutes, 0, 0);

    onSubmit({
      timestamp,
      type,
      food: food || undefined,
      amount: amount || undefined,
      notes: notes || undefined,
    });

    // Reset form
    setFood('');
    setAmount('');
    setNotes('');
    setTime(new Date().toTimeString().slice(0, 5));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a Meal</DialogTitle>
          <DialogDescription>
            Record your baby's feeding with details about type, time, and amount
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Meal Type */}
          <div className="space-y-3">
            <Label>Meal Type</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as Meal['type'])}>
              <div className="grid grid-cols-2 gap-3">
                <label
                  htmlFor="breast"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    type === 'breast'
                      ? 'border-[#5FCFD4] bg-[#E0F4F5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="breast" id="breast" className="sr-only" />
                  <Baby className={type === 'breast' ? 'text-[#5FCFD4]' : 'text-gray-400'} />
                  <span>Breast</span>
                </label>

                <label
                  htmlFor="bottle"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    type === 'bottle'
                      ? 'border-[#5FCFD4] bg-[#E0F4F5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="bottle" id="bottle" className="sr-only" />
                  <Milk className={type === 'bottle' ? 'text-[#5FCFD4]' : 'text-gray-400'} />
                  <span>Bottle</span>
                </label>

                <label
                  htmlFor="solid"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    type === 'solid'
                      ? 'border-[#5FCFD4] bg-[#E0F4F5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="solid" id="solid" className="sr-only" />
                  <Utensils className={type === 'solid' ? 'text-[#5FCFD4]' : 'text-gray-400'} />
                  <span>Solid</span>
                </label>

                <label
                  htmlFor="snack"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    type === 'snack'
                      ? 'border-[#5FCFD4] bg-[#E0F4F5]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="snack" id="snack" className="sr-only" />
                  <Cookie className={type === 'snack' ? 'text-[#5FCFD4]' : 'text-gray-400'} />
                  <span>Snack</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Food (for solid/snack) */}
          {(type === 'solid' || type === 'snack') && (
            <div className="space-y-2">
              <Label htmlFor="food">Food</Label>
              <Input
                id="food"
                placeholder="e.g., Mashed banana"
                value={food}
                onChange={(e) => setFood(e.target.value)}
              />
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder={
                type === 'breast'
                  ? 'e.g., 15 minutes'
                  : type === 'bottle'
                  ? 'e.g., 4 oz'
                  : 'e.g., 3 spoonfuls'
              }
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#5FCFD4] hover:bg-[#4FB9BE] rounded-xl">
              Save Meal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
