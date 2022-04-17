import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: any }>();

  constructor(private HttpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.HttpClient.get<{
      message: string;
      posts: any;
      maxPosts: number;
      liked: any;
    }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                liked: post.liked.map((p) => {
                  return p;
                }),
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.HttpClient.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
      liked: any;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.HttpClient.post<{ message: string; post: Post }>(
      'http://localhost:3000/api/posts',
      postData
    ).subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string,
    liked: any
  ) {
    let postData: Post | FormData;

    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      postData.append('liked', liked);
    } else {
      postData = { id, title, content, imagePath: image, creator: null, liked };
    }

    this.HttpClient.put(
      'http://localhost:3000/api/posts/' + id,
      postData
    ).subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.HttpClient.delete('http://localhost:3000/api/posts/' + postId);
  }

  likePost(postId: string) {
    console.log(postId);

    return this.HttpClient.put(
      'http://localhost:3000/api/posts/like/' + postId,
      postId
    );
  }

  unlikePost(postId: string) {
    console.log(postId);

    return this.HttpClient.put(
      'http://localhost:3000/api/posts/unlike/' + postId,
      postId
    );
  }
}
