import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanLoad {
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor(private authService: AuthService,
    private router: Router) { }

canLoad(): Observable<boolean> {
return this.authService.isAuthenticated.pipe(
filter(val => val !== null), // Filter out initial Behaviour subject value
take(1), // Otherwise the Observable doesn't complete!
map(isAuthenticated => {
if (isAuthenticated) {
// Directly open inside area
this.router.navigateByUrl('/tabs', { replaceUrl: true });
} else {
// Simply allow access to the login
return true;
}
})
);
}
}
