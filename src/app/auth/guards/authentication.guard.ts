import { Injectable } from '@angular/core';
// import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import firebase from 'firebase/app';
import 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router) { }

  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  // canLoad(): Observable<boolean> {
  //   return this.authService.isAuthenticated.pipe(
  //     filter(val => val !== null),
  //     take(1),
  //     map(isAuthenticated => {
  //       console.log('GUARD: ', isAuthenticated);
  //       if (isAuthenticated) {
  //         return true;
  //       } else {
  //         this.router.navigateByUrl('/login');
  //         return false;
  //       }
  //     })
  //   );
  // }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise( (resolve, reject)=>{
      firebase.auth().onAuthStateChanged((user: firebase.User)=>{
         if(user){
          resolve(true);
          console.log(user);
        }else{
          reject(true);
          this.router.navigate(['login']);
        }
      })
    })
  }
}
