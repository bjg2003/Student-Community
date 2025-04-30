import { Injectable } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

export interface Post {
  id?: string;
  content: string;
  image?: string;
  authorId: string;
  authorName: string;
  authorPic?: string;
  timestamp: any;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPic?: string;
  timestamp: any;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  async createPost(content: string, image?: File): Promise<void> {
    const user = getAuth().currentUser;
    if (!user) throw new Error('User must be logged in to create a post');

    let imageUrl: string | undefined;

    if (image) {
      const storageRef = ref(this.storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const postData: Post = {
      content,
      image: imageUrl,
      authorId: user.uid,
      authorName: user.displayName || 'Anonymous',
      authorPic: user.photoURL || undefined,
      timestamp: serverTimestamp(),
      likes: 0,
      comments: []
    };

    const postsRef = collection(this.firestore, 'posts');
    await addDoc(postsRef, postData);
  }

  async getPosts(): Promise<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  }
}