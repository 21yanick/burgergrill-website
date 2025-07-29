import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpeningHoursData } from "./types";

interface OpeningHoursProps {
  hours: OpeningHoursData;
}

export function OpeningHours({ hours }: OpeningHoursProps) {
  const daysConfig = [
    { key: 'monday' as keyof OpeningHoursData, label: 'Montag' },
    { key: 'tuesday' as keyof OpeningHoursData, label: 'Dienstag' },
    { key: 'wednesday' as keyof OpeningHoursData, label: 'Mittwoch' },
    { key: 'thursday' as keyof OpeningHoursData, label: 'Donnerstag' },
    { key: 'friday' as keyof OpeningHoursData, label: 'Freitag' },
    { key: 'saturday' as keyof OpeningHoursData, label: 'Samstag' },
    { key: 'sunday' as keyof OpeningHoursData, label: 'Sonntag' },
  ];

  // Check if current day (for highlighting)
  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sunday = 0, but we want Monday = 0
    return dayMap[today];
  };

  const currentDayIndex = getCurrentDay();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          Öffnungszeiten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {daysConfig.map((day, index) => {
            const isToday = index === currentDayIndex;
            const isClosedToday = hours[day.key].toLowerCase().includes('geschlossen');
            
            return (
              <div 
                key={day.key}
                className={`flex justify-between items-center py-2 px-3 rounded-md ${
                  isToday 
                    ? 'bg-accent/10 border border-accent/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <span className={`text-sm font-medium ${
                  isToday ? 'text-accent' : ''
                }`}>
                  {day.label}
                  {isToday && (
                    <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      Heute
                    </span>
                  )}
                </span>
                <span className={`text-sm ${
                  isClosedToday 
                    ? 'text-muted-foreground' 
                    : isToday 
                      ? 'text-accent font-medium' 
                      : ''
                }`}>
                  {hours[day.key]}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <p>* Feiertage können abweichen</p>
        </div>
      </CardContent>
    </Card>
  );
}