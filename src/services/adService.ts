/**
 * Rewarded Ad Service Configuration and Manager
 * Allows easy configuration of Test and Production Ad Unit IDs
 */

export interface AdConfig {
  rewardedAdUnitId: string;
  isTestMode: boolean;
}

// Google AdMob standard test rewarded video ad unit ID
export const DEFAULT_AD_CONFIG: AdConfig = {
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test Ad Unit ID
  isTestMode: true
};

class RewardedAdService {
  private config: AdConfig = { ...DEFAULT_AD_CONFIG };
  private isAdPlaying: boolean = false;
  private isAdAvailable: boolean = true;

  /**
   * Set production or custom ad unit ID dynamically
   */
  public setConfig(customConfig: Partial<AdConfig>): void {
    this.config = { ...this.config, ...customConfig };
  }

  public getConfig(): AdConfig {
    return { ...this.config };
  }

  public checkIsAdAvailable(): boolean {
    return this.isAdAvailable;
  }

  public setAdAvailable(available: boolean): void {
    this.isAdAvailable = available;
  }

  public isPlaying(): boolean {
    return this.isAdPlaying;
  }

  public setPlaying(playing: boolean): void {
    this.isAdPlaying = playing;
  }
}

export const adService = new RewardedAdService();
