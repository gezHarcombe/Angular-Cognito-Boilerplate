import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthService {

  public loggedIn: BehaviorSubject<boolean>;

  constructor(
    private router: Router
  ) {
    Amplify.configure(environment.amplify);
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  public signUp(email, password): Observable<any> {
    return fromPromise(Auth.signUp(email, password));
  }

  public confirmSignUp(email, code): Observable<any> {
    return fromPromise(Auth.confirmSignUp(email, code));
  }

  public signIn(email, password): Observable<any> {
    return fromPromise(Auth.signIn(email, password))
      .pipe(
        tap(() => this.loggedIn.next(true))
      );
  }

  public isAuthenticated(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.loggedIn.next(true);
          return true;
        }),
        catchError(error => {
          this.loggedIn.next(false);
          return of(false);
        })
      );
  }

  // this is the token you need to pass in the 'auth' field of headers to apigateway
  public getToken(): Observable<string> {
    return fromPromise(Auth.currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.loggedIn.next(true);
          return result.signInUserSession.idToken.jwtToken;
        }),
        catchError(error => {
          this.loggedIn.next(false);
          return of('');
        })
      )
  }

  public signOut() {
    Auth.signOut()
    .then(
        result => {
          this.loggedIn.next(false);
          this.router.navigate(['/login']);
        },
    ).catch(
      error => console.log(error)
    );
  }
}
