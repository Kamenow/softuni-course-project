import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  enteredValue: string = '';
  newPost: string = 'NO CONTENT';

  constructor() {}

  onAddPost() {
    this.newPost = this.enteredValue;
    console.log(this.enteredValue);
  }
}
