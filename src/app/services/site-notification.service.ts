import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';

interface ContentSnapshot {
  newsId: string | null;
  newsTitle: string | null;
  newsLink: string | null;
  blogId: string | null;
  blogTitle: string | null;
}

const SUBSCRIBED_KEY = 'srp_site_alerts_subscribed';
const LAST_NEWS_KEY = 'srp_site_alerts_last_news';
const LAST_BLOG_KEY = 'srp_site_alerts_last_blog';

@Injectable({
  providedIn: 'root'
})
export class SiteNotificationService implements OnDestroy {
  private readonly subscribedSubject = new BehaviorSubject<boolean>(false);
  private readonly permissionSubject = new BehaviorSubject<NotificationPermission | 'unsupported'>('default');
  private readonly readySubject = new BehaviorSubject<boolean>(false);
  private pollTimer: number | null = null;
  private initializing = false;

  readonly isSubscribed$ = this.subscribedSubject.asObservable();
  readonly permission$ = this.permissionSubject.asObservable();
  readonly isReady$ = this.readySubject.asObservable();

  constructor(private apiService: ApiService, private ngZone: NgZone) {
    this.syncPermissionState();
    this.subscribedSubject.next(localStorage.getItem(SUBSCRIBED_KEY) === 'true');
  }

  initialize(): void {
    if (this.initializing) {
      return;
    }

    this.initializing = true;
    this.syncPermissionState();
    this.readySubject.next(true);

    if (this.subscribedSubject.value && this.permissionSubject.value === 'granted') {
      this.seedLatestSnapshot().finally(() => this.startPolling());
      return;
    }

    this.stopPolling();
  }

  async toggleSubscription(): Promise<void> {
    if (this.permissionSubject.value === 'unsupported') {
      return;
    }

    if (this.subscribedSubject.value) {
      this.setSubscribed(false);
      this.stopPolling();
      return;
    }

    let permission = this.permissionSubject.value;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
      this.permissionSubject.next(permission);
    }

    if (permission !== 'granted') {
      return;
    }

    this.setSubscribed(true);
    await this.seedLatestSnapshot();
    this.startPolling();
  }

  async checkForUpdates(force = false): Promise<void> {
    if (!force && (!this.subscribedSubject.value || this.permissionSubject.value !== 'granted')) {
      return;
    }

    const snapshot = await this.fetchSnapshot();

    const previousNewsId = localStorage.getItem(LAST_NEWS_KEY);
    const previousBlogId = localStorage.getItem(LAST_BLOG_KEY);

    if (snapshot.newsId && previousNewsId && snapshot.newsId !== previousNewsId) {
      this.fireNotification(
        'New headline just dropped',
        snapshot.newsTitle ?? 'Fresh Samantha update is live.',
        snapshot.newsLink ?? '/'
      );
    }

    if (snapshot.blogId && previousBlogId && snapshot.blogId !== previousBlogId) {
      this.fireNotification(
        'New story added to the journal',
        snapshot.blogTitle ?? 'A new blog update is available.',
        '/blog'
      );
    }

    if (snapshot.newsId) {
      localStorage.setItem(LAST_NEWS_KEY, snapshot.newsId);
    }

    if (snapshot.blogId) {
      localStorage.setItem(LAST_BLOG_KEY, snapshot.blogId);
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private syncPermissionState(): void {
    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      this.permissionSubject.next('unsupported');
      return;
    }

    this.permissionSubject.next(Notification.permission);
  }

  private setSubscribed(isSubscribed: boolean): void {
    this.subscribedSubject.next(isSubscribed);
    localStorage.setItem(SUBSCRIBED_KEY, String(isSubscribed));
  }

  private async seedLatestSnapshot(): Promise<void> {
    const snapshot = await this.fetchSnapshot();

    if (snapshot.newsId) {
      localStorage.setItem(LAST_NEWS_KEY, snapshot.newsId);
    }

    if (snapshot.blogId) {
      localStorage.setItem(LAST_BLOG_KEY, snapshot.blogId);
    }
  }

  private async fetchSnapshot(): Promise<ContentSnapshot> {
    try {
      const [news, blogs] = await Promise.all([
        firstValueFrom(this.apiService.getNews()),
        firstValueFrom(this.apiService.getBlogs())
      ]);

      const latestNews = [...news]
        .sort((left, right) => (right.id ?? 0) - (left.id ?? 0))[0];
      const latestBlog = [...blogs]
        .sort((left, right) => (Number(right.id) || 0) - (Number(left.id) || 0))[0];

      return {
        newsId: latestNews?.id ? String(latestNews.id) : null,
        newsTitle: latestNews?.title ?? null,
        newsLink: latestNews?.link ?? null,
        blogId: latestBlog?.id ? String(latestBlog.id) : null,
        blogTitle: latestBlog?.title ?? null
      };
    } catch {
      return {
        newsId: null,
        newsTitle: null,
        newsLink: null,
        blogId: null,
        blogTitle: null
      };
    }
  }

  private fireNotification(title: string, body: string, targetUrl: string): void {
    if (this.permissionSubject.value !== 'granted' || typeof Notification === 'undefined') {
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: 'assets/images/samantha-login.png',
      badge: 'assets/images/samantha-login.png',
      tag: targetUrl
    });

    notification.onclick = () => {
      window.open(targetUrl, '_blank', 'noopener');
      notification.close();
    };
  }

  private startPolling(): void {
    this.stopPolling();

    this.ngZone.runOutsideAngular(() => {
      this.pollTimer = window.setInterval(() => {
        if (typeof document !== 'undefined' && document.hidden) {
          return;
        }

        void this.checkForUpdates();
      }, 180000);
    });
  }

  private stopPolling(): void {
    if (this.pollTimer !== null) {
      window.clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}
