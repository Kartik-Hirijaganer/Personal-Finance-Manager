import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export const AuthGuard: CanActivateFn = (
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const authService: AuthService = inject(AuthService);
  return authService.token ? true : inject(Router).createUrlTree(['/login']);
}