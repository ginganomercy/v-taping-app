import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vtaper.athlete',
  appName: 'V-Taper Protocol',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
