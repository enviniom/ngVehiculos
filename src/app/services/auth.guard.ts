import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authS: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authS.user$.pipe(
      take(1),
      map(authState => !!authState),
      tap(authenticated => {
        if (!authenticated) {
            this.router.navigate(['auth/login']);
        }})
    );
  }
}

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(private authS: AuthService, private router: Router) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    let activate: boolean = false;
    if (this.authS.userDetails) {
      activate = this.authS.userDetails.rol.localeCompare('admin') === 0;
    }
    return activate;

  }
}
