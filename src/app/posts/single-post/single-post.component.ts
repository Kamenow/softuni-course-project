import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
})
export class SinglePostComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  post: any;
  postID: string;
  isLoading: boolean = false;
  userIsAuthenticated = false;
  userId: string;
  user: any;
  text = new FormControl('', [Validators.required, Validators.minLength(1)]);
  private postsSub: Subscription = new Subscription();
  private authStatusSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postID = this.route.snapshot.params['postID'];

    this.isLoading = true;
    this.postsService.getPost(this.postID).subscribe((post) => {
      this.post = { id: post._id, ...post };
    });

    this.userId = this.authService.getUserId();
    this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: any }) => {
        this.isLoading = false;
        this.posts = postData.posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.isLoading = false;
  }

  logId() {
    console.log(this.post);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPost(this.postID);
        this.router.navigateByUrl('/');
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
        this.postsService.getPost(this.postID).subscribe((post) => {
          this.post = { id: post._id, ...post };
        });
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
        this.postsService.getPost(this.postID).subscribe((post) => {
          this.post = { id: post._id, ...post };
        });
      },
      () => {
        this.isLoading = false;
      }
    );
    this.isLoading = false;
  }

  comment(form: NgForm) {
    if (this.text.invalid) {
      return;
    }

    this.postsService
      .comment(this.postID, this.text.value)
      .subscribe((post) => {
        this.postsService.getPost(this.postID).subscribe((post) => {
          this.post = { id: post._id, ...post };
        });
        this.text.reset();
        form.resetForm();
      });
  }

  deleteComment(postID: string, commentId: string) {
    console.log(postID);
    console.log(commentId);
    this.postsService
      .deleteComment(this.postID, commentId)
      .subscribe((post) => {
        console.log(post);
        this.postsService.getPost(this.postID).subscribe((post) => {
          this.post = { id: post._id, ...post };
        });
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
