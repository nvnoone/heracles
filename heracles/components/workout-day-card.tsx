import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type WorkoutActivity = {
  type: string;
  distance?: string;
  duration: string;
};

type WorkoutDayCardProps = {
  day: string;
  planned: WorkoutActivity[];
  actual: WorkoutActivity[];
};

const WorkoutDayCard = ({ day, planned, actual }: WorkoutDayCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{day}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-semibold">Planned</h3>
          {planned.map((activity, index) => (
            <div key={index}>
              {activity.type} {activity.distance && `| ${activity.distance}`} | {activity.duration}
            </div>
          ))}
        </div>
        {actual.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Actual</h3>
            {actual.map((activity, index) => (
              <div key={index}>
                {activity.type} {activity.distance && `| ${activity.distance}`} | {activity.duration}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutDayCard;