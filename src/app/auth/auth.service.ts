import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  constructor( private afa: AngularFireAuth ) {
    this.user = afa.authState;
    this.user.subscribe((user) => {
      if (user) {
        this.userDetails = user;
        console.log('userDetails', this.userDetails);
      } else {
        this.userDetails = null;
      }
    });
  }

  requestPass(email) {
    return this.afa.auth.sendPasswordResetEmail(email);
  }

  confirmPasswordReset(code, newPassword) {
    // param: oobCode=<code>
    return this.afa.auth.confirmPasswordReset(code, newPassword);
  }

  signInWithEmail(email, paswword) {
    return this.afa.auth.signInWithEmailAndPassword(email, paswword);
  }

  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    return this.afa.auth.signOut();
  }

  createUser(email, password) {
    this.afa.auth.createUserWithEmailAndPassword(email, password);
  }
}
