"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import WorkoutDayCard from "@/components/workout-day-card";
import axios from 'axios';

const WeeklyWorkoutPlan = () => {
  const [weekDays, setWeekDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStravaData = async () => {
      try {
        const response = await axios.post('/api/strava?action=fetch_activities');
        const activities = response.data;

        // Process the activities and create the weekDays array
        const processedWeekDays = processActivities(activities);
        setWeekDays(processedWeekDays);
      } catch (error) {
        console.error('Error fetching Strava data:', error);
        if (error.response && error.response.status === 401) {
          // Redirect to Strava authorization if unauthorized
          router.push('/strava-auth');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStravaData();
  }, [router]);

  const processActivities = (activities) => {
    // TODO: Implement logic to process activities and create weekDays array
    // This is a placeholder implementation
    return activities.slice(0, 7).map((activity, index) => ({
      day: new Date(activity.start_date_local).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      planned: [],
      actual: [{
        type: activity.type,
        distance: `${(activity.distance / 1000).toFixed(2)} km`,
        duration: formatDuration(activity.moving_time)
      }]
    }));
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {weekDays.map((day, index) => (
        <WorkoutDayCard key={index} {...day} />
      ))}
    </div>
  );
};

export default WeeklyWorkoutPlan;