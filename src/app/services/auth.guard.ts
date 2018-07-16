import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private as: AuthService, private router: Router) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    let activate: boolean = false;
    if (this.as.userDetails) {
      activate = true;
    }
    return activate;
  }
}

@Injectable()
export class AuthGuardAdmin implements CanActivate {

  constructor(private as: AuthService, private router: Router) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    let activate: boolean = false;
    if (this.as.userDetails) {
      activate = this.as.userDetails.rol.localeCompare('admin') === 0;
    }
    return activate;

  }
}
