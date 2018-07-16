import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  redirectDelay: number = 1500;

  constructor(private as: AuthService, private router: Router) { }

  ngOnInit() {
    /* this.logout(); */
  }

  /* logout() {
    this.as.logout().subscribe((result: NbAuthResult) => {
      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    })
  } */

}
