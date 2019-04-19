import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http'; 

import { String } from 'aws-sdk/clients/signer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public response: String;
  constructor(
    private auth: AuthService,
    private httpClient: HttpClient
    ) {
  }

  public logOut(){
    this.auth.signOut();
    console.log('signed out');
  }

  public secureRequest() {
    this.auth.getToken().subscribe(token => {
      let httpHeaders = new HttpHeaders()
        .set('Authorization', token);

      let url = 'some_secure_url'
      this.httpClient.get(url, {headers: httpHeaders})
        .subscribe(res => {this.response = JSON.stringify(res)});
  });
};

  ngOnInit() {
  }

}
