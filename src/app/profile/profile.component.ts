import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  posts: any = [];
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
    this.postsService.getPosts(100, 1);
    this.userId = this.authService.getUserId();
    this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: any }) => {
        this.isLoading = false;
        const postLiked = [];
        postData.posts.forEach((post) => {
          if (post.liked.includes(this.userId)) {
            postLiked.push(post);
          }
        });

        this.posts = postLiked;
        console.log(this.posts);
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPosts(100, 1);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  OnLike(postId: string) {
    this.isLoading = true;
    this.postsService.likePost(postId).subscribe(
      () => {
        this.postsService.getPosts(100, 1);
      },
      () => {
        this.isLoading = false;
      }
    );
    this.isLoading = false;
  }

  OnUnLike(postId: string) {
    this.isLoading = true;
    this.postsService.unlikePost(postId).subscribe(
      () => {
        this.postsService.getPosts(100, 1);
      },
      () => {
        this.isLoading = false;
      }
    );
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
