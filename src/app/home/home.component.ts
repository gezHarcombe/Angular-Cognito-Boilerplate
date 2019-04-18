import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { String } from 'aws-sdk/clients/signer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public token: String;
  constructor(private auth: AuthService) { }

  public logOut(){
    this.auth.signOut();
    console.log('signed out');
  }

  public getUserName() {
    this.auth.getUser().subscribe( res => {

      // this is the token you need to pass in the 'auth' field of headers
      console.log(res.signInUserSession.idToken.jwtToken);
      this.token = res.signInUserSession.idToken.jwtToken})
  }

  ngOnInit() {
  }

}
