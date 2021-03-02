declare namespace Tumblr {
  type TumblrClientCallback = (err: unknown, resp: unknown, rawResp?: string) => void;

  interface TumblrClient {
    userInfo(callback?: TumblrClientCallback): void | Promise;

    blogAvatar(
      blogIdentifier: string,
      size: number,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void | Promise;
    blogAvatar(blogIdentifier: string, size: number, callback?: TumblrClientCallback): void | Promise;
    blogAvatar(
      blogIdentifier: string,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void | Promise;
    blogAvatar(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;

    blogDrafts(
      blogIdentifier: string,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void | Promise;
    blogDrafts(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;

    blogFollowers(
      blogIdentifier: string,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void | Promise;
    blogFollowers(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;

    blogInfo(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    blogInfo(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;

    blogLikes(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    blogLikes(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;

    blogPosts(blogIdentifier: string): void | Promise;
    blogPosts(blogIdentifier: string, type: string): void | Promise;
    blogPosts(blogIdentifier: string, type: string, params: unknown): void | Promise;
    blogPosts(blogIdentifier: string, params: unknown, callback?: TumblrClientCallback): void | Promise;
    blogPosts(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;
    blogPosts(blogIdentifier: string, type: string, params: unknown, callback?: TumblrClientCallback): void | Promise;

    blogSubmissions(
      blogIdentifier: string,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void | Promise;
    blogSubmissions(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;

    blogQueue(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    blogQueue(blogIdentifier: string, callback?: TumblrClientCallback): void | Promise;

    createTextPost(blogIdentifier: string, options: TextPostParams, callback?: TumblrClientCallback): void | Promise;
    createPhotoPost(blogIdentifier: string, options: PhotoPostParams, callback?: TumblrClientCallback): void | Promise;
    createQuotePost(blogIdentifier: string, options: QuotePostParams, callback?: TumblrClientCallback): void | Promise;
    createLinkPost(blogIdentifier: string, options: LinkPostParams, callback?: TumblrClientCallback): void | Promise;
    createChatPost(blogIdentifier: string, options: ChatPostParams, callback?: TumblrClientCallback): void | Promise;
    createAudioPost(blogIdentifier: string, options: AudioPostParams, callback?: TumblrClientCallback): void | Promise;
    createVideoPost(blogIdentifier: string, options: VideoPostParams, callback?: TumblrClientCallback): void | Promise;

    taggedPosts(tag: string, options: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    taggedPosts(tag: string, callback?: TumblrClientCallback): void | Promise;

    deletePost(
      blogIdentifier: string,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void | Promise;
    deletePost(blogIdentifier: string, id: number | string, callback?: TumblrClientCallback): void | Promise;

    editPost(blogIdentifier: string, params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;

    reblogPost(
      blogIdentifier: string,
      params: Record<string, unknown>,
      callback?: TumblrClientCallback
    ): void | Promise;

    userDashboard(params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    userDashboard(callback?: TumblrClientCallback): void | Promise;

    userLikes(params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    userLikes(callback?: TumblrClientCallback): void | Promise;

    userFollowing(params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    userFollowing(callback?: TumblrClientCallback): void | Promise;

    followBlog(params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    followBlog(blogURL: string, callback?: TumblrClientCallback): void | Promise;

    unfollowBlog(params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    unfollowBlog(blogURL: string, callback?: TumblrClientCallback): void | Promise;

    likePost(params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    likePost(id: number | string, reblogKey: string, callback?: TumblrClientCallback): void | Promise;

    unlikePost(params: Record<string, unknown>, callback?: TumblrClientCallback): void | Promise;
    unlikePost(id: number | string, reblogKey: string, callback?: TumblrClientCallback): void | Promise;
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
