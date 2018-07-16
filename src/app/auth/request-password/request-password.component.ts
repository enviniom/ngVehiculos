import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent implements OnInit {

  reqPassForm: FormGroup;
  redirectDelay: number = 1000;
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  errorCodes : Object = {
    "auth/wrong-password": "Contraseña errada o el usuario no tiene contraseña",
    "auth/user-disabled": "Usuario deshabilitado",
    "auth/invalid-email": "El email no es válido",
    "auth/user-not-found": "El usuario no existe"
  }
  actionCodeSettings = {
    url: 'https://vehiculoscens.firebaseapp.com/#/auth/login'
  }

  constructor(
    private fb: FormBuilder,
    protected as: AuthService,
    protected router: Router,
  ) {
    this.buildForm();
  }

  buildForm() {
    this.reqPassForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  ngOnInit() {
  }

  // TODO: Pasar el submitRequest() { } de Promise a Observable

  /* submitRequest(): void {
    const email = this.reqPassForm.get('email').value;
    this.errors = this.messages = [];
    this.submitted = true;

    this.as.requestPass(email, this.actionCodeSettings).then( (res) => {
      this.messages = ["Último ingreso: ",]
      this.submitted = false;
      console.log('res', res);
      // this.redirectToDashboard();
    }).catch( (err) => {
      this.submitted = false;
      if (this.errorCodes.hasOwnProperty(err.code)) {
        this.errors = [this.errorCodes[err.code]]
      } else {
        this.errors = [err]
      }
    })
  } */

  get email() {
    return this.reqPassForm.get('email');
  }

  redirectToDashboard() {
    setTimeout(() => {
      this.router.navigate(['/pages/dashboard']);
    }, this.redirectDelay);
  }

}
