import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private readonly httpClient:HttpClient) { }
  url="https://jsonplaceholder.typicode.com/posts"

  getAllPosts():Observable<Post[]>{
    return this.httpClient.get<Post[]>(this.url);
  }

  getPostByUser(userId:number):Observable<Post[]>{
    return this.httpClient.get<Post[]>(this.url+'/'+userId)
  }

}
