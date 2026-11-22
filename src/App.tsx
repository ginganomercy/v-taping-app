import React, { useState } from 'react';
import { UserProfile, Exercise, GpsTrackingResult } from '@/types';
import { CardioPhase, CARDIO_PHASES } from '@/constants';
import { WORKOUT_SCHEDULE } from '@/data/workoutData';
import { localStorageService } from '@/infrastructure';
import { indexedDbService } from '@/infrastructure/db/indexedDb.service';
import { useWorkoutSession, useSwipeNavigation, useAcousticTimer } from '@/hooks';
import { Header, BottomNav, TabType } from '@/components/layout';
import { DayCarousel } from '@/components/workout';
import { WorkoutView, VTaperView, HipShieldView, LibraryView } from '@/components/views';
import {
  SuperModal,
  TimerModal,
  ProfileModal,
  LiveCardioTrackerModal,
  CardioHistoryModal
} from '@/components/modals';

export const App: React.FC = () => {
  // Synchronous Profile Hydration (Instant load without FOUC)
  const [profile, setProfile] = useState<UserProfile>(() => localStorageService.getProfileSync());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('workout');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false);
  const [isCardioHistoryOpen, setIsCardioHistoryOpen] = useState(false);
  const [activeCardioPhase, setActiveCardioPhase] = useState<CardioPhase>(1);

  // Application Hooks Layer
  const { currentDay, setCurrentDay, dayData, handleUpdateSet, handleUpdateSetRecord } =
    useWorkoutSession();
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

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    const phaseConfig = CARDIO_PHASES[activeCardioPhase];

    // 1. Permanently save to Dedicated Cardio History Store in IndexedDB
    await indexedDbService.saveCardioLog({
      timestamp: now.getTime(),
      dateFormatted,
      phase: activeCardioPhase,
      phaseName: phaseConfig.name,
      distanceKm: result.distanceKm,
      durationSeconds: result.durationSeconds,
      durationMin: result.durationMin,
      averageSpeedKmh: result.averageSpeedKmh,
      paceMinKm: result.paceMinKm,
      caloriesKcal: result.caloriesKcal
    });

    // 2. Also update current workout session if it has a cardio exercise (e.g. Saturday)
    const currentSession = WORKOUT_SCHEDULE[currentDay];
    const cardioExercise = currentSession.exercises.find((ex) => ex.isCardio);
    if (cardioExercise) {
      await handleUpdateSetRecord(cardioExercise.id, 1, {
        distanceKm: result.distanceKm,
        kg: result.distanceKm,
        durationMin: result.durationMin,
        reps: result.durationMin,
        phase: activeCardioPhase,
        done: true
      });
    }

    // 3. Automatically open history modal so user gets immediate visual confirmation
    setIsCardioHistoryOpen(true);
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
              onUpdateSetRecord={handleUpdateSetRecord}
              onOpenModal={setSelectedExercise}
              onOpenNegativeTimer={openNegativeTimer}
              onPromptRestTimer={() => openRestTimer(60)}
              onOpenGpsTracker={(phase = 1) => {
                setActiveCardioPhase(phase);
                setIsGpsModalOpen(true);
              }}
              onOpenCardioHistory={() => setIsCardioHistoryOpen(true)}
            />
          </div>
        )}

        {activeTab === 'metrics' && (
          <VTaperView
            profile={profile}
            onOpenCardioHistory={() => setIsCardioHistoryOpen(true)}
          />
        )}
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
        onOpenHistory={() => setIsCardioHistoryOpen(true)}
      />

      <CardioHistoryModal
        isOpen={isCardioHistoryOpen}
        onClose={() => setIsCardioHistoryOpen(false)}
      />
    </div>
  );
};

export default App;
