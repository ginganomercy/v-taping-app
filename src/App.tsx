import React, { useState, useEffect, useRef } from 'react';
import { DayIndex, Exercise, SetRecord } from './types/workout';
import { UserProfile } from './types/profile';
import { WORKOUT_SCHEDULE, DAY_ORDER } from './data/workoutData';
import { dbService } from './services/db';
import { storage } from './services/storage';
import { sound } from './services/sound';
import { Header } from './components/Header';
import { DaySelector } from './components/DaySelector';
import { WorkoutView } from './components/WorkoutView';
import { VTaperView } from './components/VTaperView';
import { HipShieldView } from './components/HipShieldView';
import { LibraryView } from './components/LibraryView';
import { SuperModal } from './components/SuperModal';
import { TimerModal } from './components/TimerModal';
import { ProfileModal } from './components/ProfileModal';
import { LiveCardioTrackerModal } from './components/LiveCardioTrackerModal';
import { BottomNav, TabType } from './components/BottomNav';

export const App: React.FC = () => {
  // Synchronous Profile Hydration (Instant load without FOUC)
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfileSync());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [currentDay, setCurrentDay] = useState<DayIndex>(() => {
    const today = new Date().getDay() as DayIndex;
    return (today >= 0 && today <= 6) ? today : 1;
  });

  const [activeTab, setActiveTab] = useState<TabType>('workout');
  const [dayData, setDayData] = useState<Record<string, Record<number, SetRecord>>>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Timer States
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerType, setTimerType] = useState<'rest' | 'negative'>('rest');
  const [timerDuration, setTimerDuration] = useState(60);

  // GPS Cardio Tracker State
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);

  // Touch Swipe Coordinate Refs
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Load Day Data from IndexedDB / Local Storage
  useEffect(() => {
    dbService.getDayData(currentDay).then(setDayData);
  }, [currentDay]);

  const handleUpdateSet = async (
    exerciseId: string,
    setNum: number,
    field: keyof SetRecord,
    value: unknown
  ) => {
    await dbService.saveSetField(currentDay, exerciseId, setNum, field, value);
    const updated = await dbService.getDayData(currentDay);
    setDayData(updated);
  };

  const handleSaveProfile = async (updated: UserProfile) => {
    setProfile(updated);
    await storage.saveProfile(updated);
  };

  const handleCardioFinish = async (result: { distanceKm: number; durationMin: number; caloriesKcal: number }) => {
    setIsGpsModalOpen(false);
    const currentSession = WORKOUT_SCHEDULE[currentDay];
    const cardioExercise = currentSession.exercises.find((ex) => ex.isCardio);
    if (cardioExercise) {
      await dbService.saveSetField(currentDay, cardioExercise.id, 1, 'distanceKm', result.distanceKm);
      await dbService.saveSetField(currentDay, cardioExercise.id, 1, 'kg', result.distanceKm);
      await dbService.saveSetField(currentDay, cardioExercise.id, 1, 'durationMin', result.durationMin);
      await dbService.saveSetField(currentDay, cardioExercise.id, 1, 'reps', result.durationMin);
      await dbService.saveSetField(currentDay, cardioExercise.id, 1, 'done', true);
      const updated = await dbService.getDayData(currentDay);
      setDayData(updated);
    }
  };

  // Swipe Gesture Handling for Workout Days
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    touchStartX.current = e.changedTouches[0].screenX;
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (activeTab !== 'workout') return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    const deltaX = e.changedTouches[0].screenX - touchStartX.current;
    const deltaY = e.changedTouches[0].screenY - touchStartY.current;

    const minDistance = 45;
    if (Math.abs(deltaX) > minDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      const curIdx = DAY_ORDER.indexOf(currentDay);
      if (deltaX < 0) {
        // Swipe Left -> Next Day
        const nextIdx = (curIdx + 1) % DAY_ORDER.length;
        setCurrentDay(DAY_ORDER[nextIdx]);
        sound.playBeep(480, 'sine', 0.08);
      } else {
        // Swipe Right -> Prev Day
        const prevIdx = (curIdx - 1 + DAY_ORDER.length) % DAY_ORDER.length;
        setCurrentDay(DAY_ORDER[prevIdx]);
        sound.playBeep(420, 'sine', 0.08);
      }
    }
  };

  const openRestTimer = (seconds = 60) => {
    setTimerType('rest');
    setTimerDuration(seconds);
    setIsTimerOpen(true);
  };

  const openNegativeTimer = () => {
    setTimerType('negative');
    setTimerDuration(4);
    setIsTimerOpen(true);
  };

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-white shadow-2xl border-x border-zinc-200/80 flex flex-col relative overflow-hidden pb-24">
      {/* Top Header with Profile Badge and Safe-Area Support */}
      <Header
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenRestTimer={() => openRestTimer(60)}
        quickTimerSeconds={timerDuration}
      />

      {/* Main Swipable Viewport */}
      <main
        className="flex-1 px-4 pt-3 pb-6 swipe-area"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 'workout' && (
          <div className="space-y-4">
            <DaySelector
              currentDay={currentDay}
              onSelectDay={(day) => setCurrentDay(day)}
            />
            <WorkoutView
              session={WORKOUT_SCHEDULE[currentDay]}
              dayData={dayData}
              baselinePullUps={profile.baselinePullUps}
              backpackPresets={profile.backpackPresetsKg}
              onUpdateSet={handleUpdateSet}
              onOpenModal={(ex) => setSelectedExercise(ex)}
              onOpenNegativeTimer={openNegativeTimer}
              onPromptRestTimer={() => openRestTimer(60)}
              onOpenGpsTracker={() => setIsGpsModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'metrics' && <VTaperView profile={profile} />}
        {activeTab === 'hip' && <HipShieldView />}
        {activeTab === 'library' && (
          <LibraryView onOpenModal={(ex) => setSelectedExercise(ex)} />
        )}
      </main>

      {/* Bottom Sticky Thumb Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Profile Calibration Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Movement Detail Blueprint Modal */}
      <SuperModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        onOpenNegativeTimer={openNegativeTimer}
      />

      {/* Acoustic Countdown / Rest Timer Modal */}
      <TimerModal
        isOpen={isTimerOpen}
        type={timerType}
        initialSeconds={timerDuration}
        onClose={() => setIsTimerOpen(false)}
      />

      {/* Live GPS Cardio Speedometer Tracker Modal */}
      <LiveCardioTrackerModal
        isOpen={isGpsModalOpen}
        userWeightKg={profile.currentWeightKg}
        onClose={() => setIsGpsModalOpen(false)}
        onFinish={handleCardioFinish}
      />
    </div>
  );
};

export default App;
