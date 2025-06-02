import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private readonly httpClient:HttpClient) { }
url="https://jsonplaceholder.typicode.com/users"

getAllUSers():Observable<User[]>{
  return this.httpClient.get<User[]>(this.url);
}

}
