import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "../../../../services/auth.service";

export interface NavItem {
    displayName?: string;
    divider?: boolean;
    iconName?: string;
    navCap?: string;
    route?: string;
    condition?: (authService: AuthService) => boolean | Observable<boolean>;
  }
  