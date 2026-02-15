export interface SearchResult {
  name: string;
  displayName: string;
  sprite: string;
  fallbackSprite: string;
}

export interface SearchData {
  search: SearchResult[];
}

export interface SearchBarProps {
  onSelect: (name: string) => void;
}

// Auth types
export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    username: string;
  };
}

export interface LoginData {
  login: AuthResponse;
}

export interface SignupData {
  signup: AuthResponse;
}
