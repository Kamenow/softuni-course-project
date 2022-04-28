import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-your-posts',
  templateUrl: './your-posts.component.html',
  styleUrls: ['./your-posts.component.css'],
})
export class YourPostsComponent implements OnInit {
  posts: Post[] = [];
  isLoading: boolean = false;

  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription = new Subscription();
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsService
      .getUserPost(this.userId)
      .subscribe((postData: { posts: Post[] }) => {
        this.posts = postData.posts;
        console.log(this.posts);
      });

    // this.postsService
    //   .getPostUpdateListener()
    //   .subscribe((postData: { posts: Post[]; postCount: any }) => {
    //     this.isLoading = false;
    //     this.posts = postData.posts;
    //   });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.isLoading = false;
  }
}
