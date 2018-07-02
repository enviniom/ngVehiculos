import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  redirectDelay: number = 1000;
  errors: string[] = [];
  messages: string[] = [];
  user: any = { rememberMe: true };
  submitted: boolean = false;
  errorCodes : Object = {
    "auth/wrong-password": "Contraseña errada o el usuario no tiene contraseña",
    "auth/user-disabled": "Usuario deshabilitado",
    "auth/invalid-email": "El email no es válido",
    "auth/user-not-found": "El usuario no existe"
  }

  constructor(
    private fb: FormBuilder,
    protected as: AuthService,
    protected router: Router,
  ) {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      pass: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(25)])],
    });
  }

  ngOnInit() {
  }

  submitLogin(): void {
    const email = this.loginForm.get('email').value;
    const pass = this.loginForm.get('pass').value;
    this.errors = this.messages = [];
    this.submitted = true;

    this.as.signInWithEmail(email, pass).then( (res) => {
      this.messages = ["Último ingreso: ",res.user.metadata.lastSignInTime]
      this.submitted = false;
      this.redirectToDashboard();
    }).catch( (err) => {
      this.submitted = false;
      if (this.errorCodes.hasOwnProperty(err.code)) {
        this.errors = [this.errorCodes[err.code]]
      } else {
        this.errors = [err]
      }
    })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get pass() {
    return this.loginForm.get('pass');
  }

  redirectToDashboard() {
    setTimeout(() => {
      this.router.navigate(['/pages/dashboard']);
    }, this.redirectDelay);
  }

  test(): void {
    console.log('loginForm', this.loginForm);
    const email = this.loginForm.get('email').value;
    const pass = this.loginForm.get('pass').value;
    this.as.signInWithEmail(email, pass).then( (res) => {
      this.submitted = false;
      console.log('res', res);
      this.messages = ["Último ingreso: ",res.user.metadata.lastSignInTime]
    }).catch( (err) => {
      this.submitted = false;
      if (this.errorCodes.hasOwnProperty(err.code)) {
        this.errors = [this.errorCodes[err.code]]
      } else {
        this.errors = [err]
      }
      console.log('error(es)', err);
    })
  }

}
