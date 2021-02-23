/*!
 * https://www.npmjs.com/package/tumblr.js
 *
 * <3 always,
 *     Tumblr
 */

/**
 * @namespace tumblr
 */

const qs = require('query-string');
const request = require('request');
const URL = require('url').URL;

const get = require('lodash/get');
const set = require('lodash/set');
const keys = require('lodash/keys');
const intersection = require('lodash/intersection');
const extend = require('lodash/extend');
const reduce = require('lodash/reduce');
const partial = require('lodash/partial');
const zipObject = require('lodash/zipObject');
const isString = require('lodash/isString');
const isFunction = require('lodash/isFunction');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const omit = require('lodash/omit');

const CLIENT_VERSION = '3.0.0';
const API_BASE_URL = 'https://api.tumblr.com'; // deliberately no trailing slash

const API_METHODS = {
  GET: {
    blogInfo: '/v2/blog/:blogIdentifier/info',

    blogAvatar: '/v2/blog/:blogIdentifier/avatar/:size',

    blogLikes: '/v2/blog/:blogIdentifier/likes',

    blogFollowers: '/v2/blog/:blogIdentifier/followers',

    blogPosts: '/v2/blog/:blogIdentifier/posts/:type',

    blogQueue: '/v2/blog/:blogIdentifier/posts/queue',

    blogDrafts: '/v2/blog/:blogIdentifier/posts/draft',

    blogSubmissions: '/v2/blog/:blogIdentifier/posts/submission',

    userInfo: '/v2/user/info',

    userDashboard: '/v2/user/dashboard',

    userFollowing: '/v2/user/following',

    userLikes: '/v2/user/likes',

    taggedPosts: ['/v2/tagged', ['tag']],
  },

  POST: {
    createPost: '/v2/blog/:blogIdentifier/post',

    editPost: '/v2/blog/:blogIdentifier/post/edit',

    reblogPost: '/v2/blog/:blogIdentifier/post/reblog',

    deletePost: ['/v2/blog/:blogIdentifier/post/delete', ['id']],

    followBlog: ['/v2/user/follow', ['url']],

    unfollowBlog: ['/v2/user/unfollow', ['url']],

    likePost: ['/v2/user/like', ['id', 'reblog_key']],

    unlikePost: ['/v2/user/unlike', ['id', 'reblog_key']],
  },
};

function forceFullBlogUrl(blogUrl) {
  if (blogUrl.indexOf('.') < 0) {
    blogUrl += '.tumblr.com';
  }
  return blogUrl;
}

function createFunction(name, args, fn) {
  if (isFunction(args)) {
    fn = args;
    args = [];
  }

  return new Function(
    'body',
    'return function ' + name + '(' + args.join(', ') + ') { return body.apply(this, arguments); };'
  )(fn);
}

function promisifyRequest(requestMethod) {
  return function (apiPath, params, callback) {
    const promise = new Promise(
      function (resolve, reject) {
        requestMethod.call(this, apiPath, params, function (err, resp) {
          if (err) {
            reject(err);
          } else {
            resolve(resp);
          }
        });
      }.bind(this)
    );

    if (callback) {
      promise
        .then(function (body) {
          callback(null, body);
        })
        .catch(function (err) {
          callback(err, null);
        });
    }

    return promise;
  };
}

function requestCallback(callback) {
  if (!callback) {
    return undefined;
  }

  return function (err, response, body) {
    if (err) {
      return callback(err, null, response);
    }

    if (response.statusCode >= 400) {
      const errString = body.meta ? body.meta.msg : body.error;
      return callback(new Error('API error: ' + response.statusCode + ' ' + errString), null, response);
    }

    if (body && body.response) {
      return callback(null, body.response, response);
    } else {
      return callback(new Error('API error (malformed API response): ' + body), null, response);
    }
  };
}

function getRequest(requestGet, credentials, baseUrl, apiPath, requestOptions, params, callback) {
  params = params || {};

  if (credentials.consumer_key) {
    params.api_key = credentials.consumer_key;
  }

  // if the apiPath already has query params, use them
  let existingQueryIndex = apiPath.indexOf('?');
  if (existingQueryIndex !== -1) {
    let existingParams = qs.parse(apiPath.substr(existingQueryIndex));

    // extend the existing params with the given params
    extend(existingParams, params);

    // reset the given apiPath to remove those query params for clean reassembly
    apiPath = apiPath.substring(0, existingQueryIndex);
  }

  return requestGet(
    extend(
      {
        url: baseUrl + apiPath + '?' + qs.stringify(params),
        oauth: credentials,
        json: true,
      },
      requestOptions
    ),
    requestCallback(callback)
  );
}

function postRequest(requestPost, credentials, baseUrl, apiPath, requestOptions, params, callback) {
  params = params || {};

  // Sign without multipart data
  const currentRequest = requestPost(
    extend(
      {
        url: baseUrl + apiPath,
        oauth: credentials,
      },
      requestOptions
    ),
    function (err, response, body) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {
          error: 'Malformed Response: ' + body,
        };
      }
      requestCallback(callback)(err, response, body);
    }
  );

  // Sign it with the non-data parameters
  const dataKeys = ['data'];
  currentRequest.form(omit(params, dataKeys));
  currentRequest.oauth(credentials);

  // Clear the side effects from form(param)
  delete currentRequest.headers['content-type'];
  delete currentRequest.body;

  // if 'data' is an array, rename it with indices
  if ('data' in params && Array.isArray(params.data)) {
    for (let i = 0; i < params.data.length; ++i) {
      params['data[' + i + ']'] = params.data[i];
    }
    delete params.data;
  }

  // And then add the full body
  const form = currentRequest.form();
  for (const key in params) {
    form.append(key, params[key]);
  }

  // Add the form header back
  extend(currentRequest.headers, form.getHeaders());

  return currentRequest;
}

function addMethod(client, methodName, apiPath, paramNames, requestType) {
  const apiPathSplit = apiPath.split('/');
  const apiPathParamsCount = apiPath.split(/\/:[^/]+/).length - 1;

  const buildApiPath = function (args) {
    let pathParamIndex = 0;
    return reduce(
      apiPathSplit,
      function (apiPath, apiPathChunk) {
        // Parse arguments in the path
        if (apiPathChunk === ':blogIdentifier') {
          // Blog URLs are special
          apiPathChunk = forceFullBlogUrl(args[pathParamIndex++]);
        } else if (apiPathChunk[0] === ':') {
          apiPathChunk = args[pathParamIndex++];
        }

        if (apiPathChunk) {
          return apiPath + '/' + apiPathChunk;
        } else {
          return apiPath;
        }
      },
      ''
    );
  };

  const namedParams = (apiPath.match(/\/:[^/]+/g) || [])
    .map(function (param) {
      return param.substr(2);
    })
    .concat(paramNames, 'params', 'callback');

  const methodBody = function () {
    const argsLength = arguments.length;
    const args = new Array(argsLength);
    for (let i = 0; i < argsLength; i++) {
      args[i] = arguments[i];
    }

    const requiredParamsStart = apiPathParamsCount;
    const requiredParamsEnd = requiredParamsStart + paramNames.length;
    const requiredParamArgs = args.slice(requiredParamsStart, requiredParamsEnd);

    // Callback is at the end
    const callback = isFunction(args[args.length - 1]) ? args.pop() : null;

    // Required Parmas
    const params = zipObject(paramNames, requiredParamArgs);
    extend(params, isPlainObject(args[args.length - 1]) ? args.pop() : {});

    // Path arguments are determined after required parameters
    const apiPathArgs = args.slice(0, apiPathParamsCount);

    let request = requestType;
    if (isString(requestType)) {
      request = requestType.toUpperCase() === 'POST' ? client.postRequest : client.getRequest;
    } else if (!isFunction(requestType)) {
      request = client.getRequest;
    }

    return request.call(client, buildApiPath(apiPathArgs), params, callback);
  };

  set(client, methodName, createFunction(methodName, namedParams, methodBody));
}

function addMethods(client, methods, requestType) {
  let apiPath, paramNames;
  for (const methodName in methods) {
    apiPath = methods[methodName];
    if (isString(apiPath)) {
      paramNames = [];
    } else if (isPlainObject(apiPath)) {
      paramNames = apiPath.paramNames || [];
      apiPath = apiPath.path;
    } else {
      paramNames = apiPath[1] || [];
      apiPath = apiPath[0];
    }
    addMethod(client, methodName, apiPath, paramNames, requestType || 'GET');
  }
}

function wrapCreatePost(type, validate) {
  return function (blogIdentifier, params, callback) {
    params = extend({ type: type }, params);

    if (isArray(validate)) {
      validate = partial(
        function (params, requireKeys) {
          if (requireKeys.length) {
            const keyIntersection = intersection(keys(params), requireKeys);
            if (requireKeys.length === 1 && !keyIntersection.length) {
              throw new Error('Missing required field: ' + requireKeys[0]);
            } else if (!keyIntersection.length) {
              throw new Error('Missing one of: ' + requireKeys.join(', '));
            } else if (keyIntersection.length > 1) {
              throw new Error('Can only use one of: ' + requireKeys.join(', '));
            }
          }
          return true;
        },
        params,
        validate
      );
    }

    if (isFunction(validate)) {
      if (!validate(params)) {
        throw new Error('Error validating parameters');
      }
    }

    if (arguments.length > 2) {
      return this.createPost(blogIdentifier, params, callback);
    } else {
      return this.createPost(blogIdentifier, params);
    }
  };
}

function TumblrClient(options) {
  // Support for `TumblrClient(credentials, baseUrl, requestLibrary)`
  if (arguments.length > 1) {
    options = {
      credentials: arguments[0],
      baseUrl: arguments[1],
      request: arguments[2],
      returnPromises: false,
    };
  }

  options = options || {};

  this.version = CLIENT_VERSION;
  this.credentials = get(options, 'credentials', omit(options, 'baseUrl', 'request'));
  this.baseUrl = get(options, 'baseUrl', API_BASE_URL);

  // if someone is providing a custom baseUrl with a path, show a message
  // to help them debug if they run into errors.
  if (this.baseUrl !== API_BASE_URL && this.baseUrl !== '') {
    const baseUrl = new URL(this.baseUrl);
    if (baseUrl.pathname !== '/') {
      /* eslint-disable no-console */
      console.warn('WARNING! Path detected in your custom baseUrl!');
      console.warn('As of version 3.0.0, tumblr.js no longer includes a path in the baseUrl.');
      console.warn('If you encounter errors, please try to omit the path.');
      /* eslint-enable no-console */
    }
  }

  this.request = get(options, 'request', request);
  this.requestOptions = {
    followRedirect: false,
    headers: {
      'User-Agent': 'tumblr.js/' + CLIENT_VERSION,
    },
  };

  this.addGetMethods(API_METHODS.GET);
  this.addPostMethods(API_METHODS.POST);

  this.createTextPost = wrapCreatePost('text', ['body']);

  this.createPhotoPost = wrapCreatePost('photo', ['data', 'data64', 'source']);

  this.createQuotePost = wrapCreatePost('quote', ['quote']);

  this.createLinkPost = wrapCreatePost('link', ['url']);

  this.createChatPost = wrapCreatePost('chat', ['conversation']);

  this.createAudioPost = wrapCreatePost('audio', ['data', 'data64', 'external_url']);

  this.createVideoPost = wrapCreatePost('video', ['data', 'data64', 'embed']);

  // Enable Promise mode
  if (get(options, 'returnPromises', false)) {
    this.returnPromises();
  }
}

TumblrClient.prototype.getRequest = function (apiPath, params, callback) {
  if (isFunction(params)) {
    callback = params;
    params = {};
  }
  return getRequest(this.request.get, this.credentials, this.baseUrl, apiPath, this.requestOptions, params, callback);
};

TumblrClient.prototype.postRequest = function (apiPath, params, callback) {
  if (isFunction(params)) {
    callback = params;
    params = {};
  }
  return postRequest(this.request.post, this.credentials, this.baseUrl, apiPath, this.requestOptions, params, callback);
};

/**
 * Sets the client to return Promises instead of Request objects by patching the `getRequest` and
 * `postRequest` methods on the client
 */
TumblrClient.prototype.returnPromises = function () {
  this.getRequest = promisifyRequest(this.getRequest);
  this.postRequest = promisifyRequest(this.postRequest);
};

TumblrClient.prototype.addGetMethods = function (methods) {
  addMethods(this, methods, 'GET');
};

TumblrClient.prototype.addPostMethods = function (methods) {
  addMethods(this, methods, 'POST');
};

/*
 * Please, enjoy our luxurious exports.
 */
module.exports = {
  Client: TumblrClient,

  createClient: function (options) {
    // Support for `TumblrClient(credentials, baseUrl, requestLibrary)`
    if (arguments.length > 1) {
      options = {
        credentials: arguments[0],
        baseUrl: arguments[1],
        request: arguments[2],
        returnPromises: false,
      };
    }

    // Create the Tumblr Client
    const client = new TumblrClient(options);

    return client;
  },
};
