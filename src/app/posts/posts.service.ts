import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private HttpClient: HttpClient) {}

  getPosts() {
    this.HttpClient.get<{ message: string; posts: any }>(
      'http://localhost:3000/api/posts'
    )
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.HttpClient.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPost(title: string, content: string) {
    const post: Post = { id: 'null', title, content };
    this.HttpClient.post<{ message: string; postId: string }>(
      'http://localhost:3000/api/posts',
      post
    ).subscribe((responseData) => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id,
      title,
      content,
    };

    this.HttpClient.put(
      'http://localhost:3000/api/posts/' + id,
      post
    ).subscribe((responseData) => {
      console.log(responseData);
      const updatedPosts = [...this.posts];
      const oldPostIndex = this.posts.findIndex((p) => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.HttpClient.delete(
      'http://localhost:3000/api/posts/' + postId
    ).subscribe(() => {
      console.log('deleted');
      const updatedPosts = this.posts.filter((post) => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}