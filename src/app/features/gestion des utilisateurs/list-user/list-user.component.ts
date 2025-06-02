import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, effect, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { finalize, retry, take } from 'rxjs';
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

  constructor(private readonly userService$:UserService) {
    effect(() => {
      console.log("users from signal (after update): ", this.users());
    });
   }
  public users=toSignal(this.userService$.getAllUSers());
  ngOnInit() {
    this.getAllUsers();
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


}
