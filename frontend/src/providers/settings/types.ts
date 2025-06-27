export type SettingKey =
  | 'WALLET_CONNECT_PROJECT_ID'
  | 'API_URL'
  | 'EXPLORER_URL'
  | 'HOODI_EXPLORER_URL'
  | 'GITHUB_REPOSITORY';

export type SettingsContextType = {
  get: <T>(key: SettingKey) => T;
};
