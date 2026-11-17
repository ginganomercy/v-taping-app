import React, { useState } from 'react';
import { UserProfile } from '@/types/profile.types';
import { Exercise } from '@/types/workout.types';
import { GpsTrackingResult } from '@/types/telemetry.types';
import { CardioPhase } from '@/constants/cardio.constants';
import { WORKOUT_SCHEDULE } from '@/data/workoutData';
import { localStorageService } from '@/infrastructure/storage/localStorage.service';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useAcousticTimer } from '@/hooks/useAcousticTimer';
import { Header, BottomNav, TabType } from '@/components/layout';
import { DayCarousel } from '@/components/workout';
import { WorkoutView, VTaperView, HipShieldView, LibraryView } from '@/components/views';
import { SuperModal, TimerModal, ProfileModal, LiveCardioTrackerModal } from '@/components/modals';

export const App: React.FC = () => {
  // Synchronous Profile Hydration (Instant load without FOUC)
  const [profile, setProfile] = useState<UserProfile>(() => localStorageService.getProfileSync());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('workout');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [activeCardioPhase, setActiveCardioPhase] = useState<CardioPhase>(1);

  // Application Hooks Layer
  const { currentDay, setCurrentDay, dayData, handleUpdateSet } = useWorkoutSession();
  const { isTimerOpen, timerType, timerDuration, openRestTimer, openNegativeTimer, closeTimer } =
    useAcousticTimer();
  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(
    currentDay,
    setCurrentDay,
    activeTab === 'workout'
  );

  const handleSaveProfile = async (updated: UserProfile) => {
    setProfile(updated);
    await localStorageService.saveProfile(updated);
  };

  const handleCardioFinish = async (result: GpsTrackingResult) => {
    setIsGpsModalOpen(false);
    const currentSession = WORKOUT_SCHEDULE[currentDay];
    const cardioExercise = currentSession.exercises.find((ex) => ex.isCardio);
    if (cardioExercise) {
      await handleUpdateSet(cardioExercise.id, 1, 'distanceKm', result.distanceKm);
      await handleUpdateSet(cardioExercise.id, 1, 'kg', result.distanceKm);
      await handleUpdateSet(cardioExercise.id, 1, 'durationMin', result.durationMin);
      await handleUpdateSet(cardioExercise.id, 1, 'reps', result.durationMin);
      await handleUpdateSet(cardioExercise.id, 1, 'done', true);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] bg-white shadow-2xl border-x border-zinc-200/80 flex flex-col relative overflow-hidden pb-24">
      {/* Top Header with Profile Avatar and Quick Rest Timer */}
      <Header
        profile={profile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenRestTimer={() => openRestTimer(60)}
        quickTimerSeconds={timerDuration}
      />

      {/* Main Viewport with Horizontal Touch Swipe */}
      <main
        className="flex-1 px-4 pt-3 pb-6 swipe-area"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 'workout' && (
          <div className="space-y-4">
            <DayCarousel currentDay={currentDay} onSelectDay={setCurrentDay} />
            <WorkoutView
              session={WORKOUT_SCHEDULE[currentDay]}
              dayData={dayData}
              baselinePullUps={profile.baselinePullUps}
              backpackPresets={profile.backpackPresetsKg}
              onUpdateSet={handleUpdateSet}
              onOpenModal={setSelectedExercise}
              onOpenNegativeTimer={openNegativeTimer}
              onPromptRestTimer={() => openRestTimer(60)}
              onOpenGpsTracker={(phase = 1) => {
                setActiveCardioPhase(phase);
                setIsGpsModalOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'metrics' && <VTaperView profile={profile} />}
        {activeTab === 'hip' && <HipShieldView />}
        {activeTab === 'library' && <LibraryView onOpenModal={setSelectedExercise} />}
      </main>

      {/* Sticky Bottom Thumb-Zone Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Standalone Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <SuperModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        onOpenNegativeTimer={openNegativeTimer}
      />

      <TimerModal
        isOpen={isTimerOpen}
        type={timerType}
        initialSeconds={timerDuration}
        onClose={closeTimer}
      />

      <LiveCardioTrackerModal
        isOpen={isGpsModalOpen}
        phase={activeCardioPhase}
        userWeightKg={profile.currentWeightKg}
        onClose={() => setIsGpsModalOpen(false)}
        onFinish={handleCardioFinish}
      />
    </div>
  );
};

export default App;
