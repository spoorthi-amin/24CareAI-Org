import { ThemeColor, AppearanceMode, FontSize, LayoutDensity, CardRadius } from './theme';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredTheme?: ThemeColor;
  appearanceMode?: AppearanceMode;
  fontSize?: FontSize;
  layoutDensity?: LayoutDensity;
  cardRadius?: CardRadius;
  reducedMotion?: boolean;
  dataSharingConsent?: boolean;
  specialty?: string;
  licenseNumber?: string;
  clinicAddress?: string;
  qualifications?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
