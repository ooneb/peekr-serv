declare namespace Tumblr {
  type TumblrClientCallback = (err: unknown, resp: unknown, rawResp?: string) => void;

  interface TumblrClient {
    userInfo(callback?: TumblrClientCallback): void | Promise;

    blogAvatar(
      blogIdentifier: string,
      size: number,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void;
    blogAvatar(blogIdentifier: string, size: number, callback?: TumblrClientCallback): void;
    blogAvatar(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    blogAvatar(blogIdentifier: string, callback?: TumblrClientCallback): void;

    blogDrafts(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    blogDrafts(blogIdentifier: string, callback?: TumblrClientCallback): void;

    blogFollowers(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    blogFollowers(blogIdentifier: string, callback?: TumblrClientCallback): void;

    blogInfo(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    blogInfo(blogIdentifier: string, callback?: TumblrClientCallback): void;

    blogLikes(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    blogLikes(blogIdentifier: string, callback?: TumblrClientCallback): void;

    blogPosts(blogIdentifier: string): void;
    blogPosts(blogIdentifier: string, type: string): void;
    blogPosts(blogIdentifier: string, type: string, params: unknown): void;
    blogPosts(blogIdentifier: string, params: unknown, callback?: TumblrClientCallback): void;
    blogPosts(blogIdentifier: string, callback?: TumblrClientCallback): void;
    blogPosts(blogIdentifier: string, type: string, params: unknown, callback?: TumblrClientCallback): void;

    blogSubmissions(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    blogSubmissions(blogIdentifier: string, callback?: TumblrClientCallback): void;

    blogQueue(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    blogQueue(blogIdentifier: string, callback?: TumblrClientCallback): void;

    createTextPost(blogIdentifier: string, options: TextPostParams, callback?: TumblrClientCallback): void;
    createPhotoPost(blogIdentifier: string, options: PhotoPostParams, callback?: TumblrClientCallback): void;
    createQuotePost(blogIdentifier: string, options: QuotePostParams, callback?: TumblrClientCallback): void;
    createLinkPost(blogIdentifier: string, options: LinkPostParams, callback?: TumblrClientCallback): void;
    createChatPost(blogIdentifier: string, options: ChatPostParams, callback?: TumblrClientCallback): void;
    createAudioPost(blogIdentifier: string, options: AudioPostParams, callback?: TumblrClientCallback): void;
    createVideoPost(blogIdentifier: string, options: VideoPostParams, callback?: TumblrClientCallback): void;

    taggedPosts(tag: string, options: Record<string, unknown>, callback?: TumblrClientCallback): void;
    taggedPosts(tag: string, callback?: TumblrClientCallback): void;

    deletePost(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    deletePost(blogIdentifier: string, id: number | string, callback?: TumblrClientCallback): void;

    editPost(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;

    reblogPost(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void;

    userDashboard(params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    userDashboard(callback?: TumblrClientCallback): void;

    userLikes(params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    userLikes(callback?: TumblrClientCallback): void;

    userFollowing(params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    userFollowing(callback?: TumblrClientCallback): void;

    followBlog(params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    followBlog(blogURL: string, callback?: TumblrClientCallback): void;

    unfollowBlog(params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    unfollowBlog(blogURL: string, callback?: TumblrClientCallback): void;

    likePost(params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    likePost(id: number | string, reblogKey: string, callback?: TumblrClientCallback): void;

    unlikePost(params: Record<string, unknown>, callback?: TumblrClientCallback): void;
    unlikePost(id: number | string, reblogKey: string, callback?: TumblrClientCallback): void;
  }

  function createClient(options: unknown): TumblrClient;

  interface TextPostParams {
    title?: string;
    body: string;
  }

  interface PhotoPostParamsWithSource {
    source: string;
    caption?: string;
  }

  interface PhotoPostParamsWithData {
    data: unknown | Array<string>;
    caption?: string;
  }

  interface PhotoPostParamsWithData64 {
    data64: string;
    caption?: string;
  }

  type PhotoPostParams = PhotoPostParamsWithSource | PhotoPostParamsWithData | PhotoPostParamsWithData64;

  interface QuotePostParams {
    quote: string;
    source?: string;
  }

  interface LinkPostParams {
    title?: string;
    url: string;
    thumbnail?: string;
    excerpt?: string;
    author?: string;
    description?: string;
  }

  interface ChatPostParams {
    title?: string;
    conversation: string;
  }

  interface AudioPostParamsWithExternalUrl {
    external_url: string;
    caption?: string;
  }

  interface AudioPostParamsWithData {
    data: unknown;
    caption?: string;
  }

  type AudioPostParams = AudioPostParamsWithExternalUrl | AudioPostParamsWithData;

  interface VideoPostParamsWithEmbed {
    embed: string;
    caption?: string;
  }

  interface VideoPostParamsWithData {
    data: unknown;
    caption?: string;
  }

  type VideoPostParams = VideoPostParamsWithEmbed | VideoPostParamsWithData;
}

export = Tumblr;
