import { CommonModule } from '@angular/common';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { Component, effect, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { finalize, retry, take,forkJoin,map, mergeMap, from, toArray, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone:true,
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
  imports:[CommonModule,HttpClientModule,TableModule],
  providers:[UserService]
})
export class ListUserComponent implements OnInit {

  public userList:User[]=[];

  constructor(private readonly userService$:UserService,
    private readonly httpClient:HttpClient

  ) {
    effect(() => {
      console.log("users from signal (after update): ", this.users());
    });
   }
  public users=toSignal(this.userService$.getAllUSers());
  ngOnInit() {
    this.getAllUsers();
    this.loadUsersWithPost();
    this.loadUsersWithPostsV_2();
    this.loadUsersWithPostsV_3();
  }

  getAllUsers():void{
    this.userService$.getAllUSers()
    .pipe(take(1),
          retry(2),
          finalize(() => console.log('finalize: Observable fermé (par completion ou erreur)')))
    .subscribe({
      next:(res)=>{
        this.userList=res;
        console.log(this.userList);
      },
      error:(err)=>{
        console.log("error api ",err)
      }
    })
  }


  loadUsersWithPost()
  {
    forkJoin({
      users:this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/users'),
      posts:this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/posts')
    })
    .pipe(
      map(
        ({users,posts})=>{
          return users.map(user=>({
            ...user,
            posts:posts.filter(post=>post.userId==user.id)
          }))
        }
      ),
      take(1),
      retry(3)
    )
    .subscribe({
      next:(result)=>{
        console.log("resultat from fork" ,result);
      },
      error:(err)=>{
        console.log(err);
      },
      complete:()=>{
        console.log("fork join terminé")
      }
    })
  }


  loadUsersWithPostsV_2()
  {
    this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/users')
    .pipe(
      mergeMap(users=>from(users)),
      mergeMap(user=>
        this.httpClient.get<any[]>(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
      .pipe(map(post=>({...user,post})))
      ),
      toArray()
    )
    .subscribe({
      next:(result)=>{
        console.log("resultat from merge",result)
      },
      error:(err)=>
      {
        console.log(err)
      }
    })
  }

  loadUsersWithPostsV_3(){
    this.httpClient.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        switchMap(users => {
          const userPosts$ = users.map(user =>
            this.httpClient.get<any[]>(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
              .pipe(map(posts => ({ ...user, posts })))
          );
          return forkJoin(userPosts$);
        })
      )
      .subscribe({
        next: (res) => {
          console.log('switchMap result', res);
        },
        error: (err) => console.error('Error with switchMap', err)
      });
  }

}
