/**
 * Hardware Screen WakeLock service to prevent display sleep during active workout or GPS sessions.
 */

class ScreenWakeLockService {
  private sentinel: unknown = null;

  public async requestLock(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return false;
    }

    try {
      const nav = navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } };
      this.sentinel = await nav.wakeLock.request('screen');
      return true;
    } catch {
      // WakeLock request rejected or not supported by power saver
      return false;
    }
  }

  public releaseLock(): void {
    if (this.sentinel) {
      try {
        const lock = this.sentinel as { release: () => Promise<void> };
        lock.release();
      } catch {
        // Sentinel release fallback
      }
      this.sentinel = null;
    }
  }
}

export const wakeLockService = new ScreenWakeLockService();
