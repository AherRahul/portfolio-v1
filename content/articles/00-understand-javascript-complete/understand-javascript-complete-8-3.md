---
title: Fetch API & Network Requests
description: Master modern HTTP communication with the Fetch API. Learn to
  handle different request types, manage headers, process responses, and
  implement robust error handling for network operations.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: MDN - Fetch API
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    description: Complete Fetch API reference and usage patterns
  - title: MDN - Response Interface
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/API/Response
    description: Understanding Response objects and methods
  - title: HTTP Status Codes
    type: reference
    url: https://httpstatuses.com/
    description: Complete reference of HTTP status codes
  - title: Network Error Handling
    type: article
    url: https://web.dev/fetch-api/
    description: Best practices for fetch error handling and resilience
published: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811627/Portfolio/javaScriptCourse/images/all%20title%20images/34_ij8qbd.png)

Fetch API & Network Requests – Modern HTTP Communication Mastery
================================================================

Imagine you're running a **sophisticated international courier service** 📦 that can handle any type of delivery request:

- **Flexible Requests** 📋 - Accept packages of any size, shape, or content type with custom delivery instructions
- **Global Delivery** 🌍 - Send packages anywhere in the world with proper routing and tracking
- **Smart Packaging** 📦 - Automatically format packages according to destination requirements
- **Delivery Confirmation** ✅ - Get detailed receipts with delivery status, timing, and any issues
- **Error Handling** 🚨 - Gracefully handle lost packages, wrong addresses, or service outages
- **Real-time Tracking** 📍 - Monitor delivery progress and handle updates dynamically
- **Secure Transport** 🔒 - Ensure packages are properly authenticated and encrypted in transit

**The Fetch API works exactly like this modern courier service.** It replaced the old, clunky XMLHttpRequest with a clean, Promise-based interface for HTTP communication that handles:

- **Any HTTP method** (GET, POST, PUT, DELETE, PATCH, etc.)
- **Flexible data formats** (JSON, FormData, text, blobs, streams)
- **Custom headers and authentication** 
- **Comprehensive response handling** with status codes and metadata
- **Robust error handling** for network failures and HTTP errors
- **Request cancellation** and timeout management
- **Streaming responses** for large data transfers

Understanding the Fetch API is essential for building modern web applications that communicate with servers, consume APIs, and handle real-time data updates. It's the foundation of all modern web communication patterns.

## The Theoretical Foundation: HTTP Protocol and Network Communication 📐

### Understanding HTTP as Application Protocol

**HTTP (HyperText Transfer Protocol) is the foundation of web communication** - an application-layer protocol built on top of TCP/IP that defines how clients and servers exchange data.

**Core HTTP Concepts:**

1. **Request-Response Model**: Stateless communication pattern where client initiates
2. **Methods**: Semantic verbs (GET, POST, PUT, DELETE) that describe the intended action
3. **Status Codes**: Standardized response codes that indicate success, errors, or redirections
4. **Headers**: Metadata that provides context about the request or response
5. **Body**: The actual data being transmitted

**Why Understanding HTTP Matters:**
- **Predictable Behavior**: HTTP defines standard semantics for all operations
- **Caching Strategy**: HTTP headers control browser and proxy caching
- **Security Model**: Understanding CORS, authentication, and secure communication
- **Performance Optimization**: Efficient use of HTTP features for speed

### The Evolution of JavaScript HTTP APIs

**JavaScript HTTP communication has evolved through several paradigms:**

1. **XMLHttpRequest (2000s)**: Callback-based, complex API, limited functionality
2. **jQuery.ajax (2010s)**: Simplified interface but still callback-based
3. **Fetch API (2015+)**: Promise-based, modern, extensible

**Fetch represents modern web principles:**
- **Promise-Based**: Natural async/await support
- **Stream-Oriented**: Built for streaming data
- **Request/Response Objects**: Object-oriented design
- **Extensible**: Service Workers can intercept and modify requests

### Network Programming Theory

**Fetch API embodies fundamental network programming concepts:**

**Asynchronous I/O**: Network operations don't block the main thread
- **Non-blocking**: UI remains responsive during network requests
- **Concurrent**: Multiple requests can be in-flight simultaneously
- **Error Handling**: Network failures are separated from HTTP errors

**Resource Management**: Proper handling of network resources
- **Connection Pooling**: Browser manages TCP connections efficiently
- **Request Cancellation**: AbortController enables request cancellation
- **Memory Management**: Streaming prevents large responses from overwhelming memory

**Error Recovery**: Robust handling of network failures
- **Retry Logic**: Exponential backoff for transient failures
- **Circuit Breaker**: Preventing cascade failures
- **Graceful Degradation**: Fallback strategies when network fails

### RESTful Architecture Principles

**Fetch API is designed around REST principles:**

1. **Stateless**: Each request contains all necessary information
2. **Uniform Interface**: Consistent use of HTTP methods and status codes
3. **Resource-Based**: URLs identify resources, methods specify actions
4. **Representation**: Data can be transmitted in multiple formats (JSON, XML, etc.)

Understanding these principles helps design better APIs and use Fetch effectively.

## Understanding HTTP and the Fetch API 🌐

### The Evolution from XMLHttpRequest to Fetch 📈

```javascript
// The old way: XMLHttpRequest (XMLHttpRequest)
function oldAjaxRequest(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    callback(null, data);
                } catch (error) {
                    callback(error, null);
                }
            } else {
                callback(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`), null);
            }
        }
    };
    
    xhr.onerror = function() {
        callback(new Error('Network error'), null);
    };
    
    xhr.send();
}

// Modern way: Fetch API
async function modernFetchRequest(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

// Compare the complexity and readability
// oldAjaxRequest('/api/users', (error, data) => {
//     if (error) {
//         console.error('Error:', error);
//     } else {
//         console.log('Users:', data);
//     }
// });

// modernFetchRequest('/api/users')
//     .then(users => console.log('Users:', users))
//     .catch(error => console.error('Error:', error));
```

### Basic Fetch Syntax and Concepts 💡

**What is the Fetch API?** It's a modern web API that provides an interface for making HTTP requests and handling responses using Promises.

**Mental Model:** Think of fetch as a **smart postal service** - you give it a destination (URL) and package details (request options), and it returns a **delivery receipt** (Response object) that you can examine and unpack.

```javascript
// Basic fetch syntax
// fetch(url, options) returns a Promise<Response>

// Simple GET request
const response = await fetch('/api/users');
const users = await response.json();

// The above is equivalent to:
fetch('/api/users')
    .then(response => response.json())
    .then(users => console.log(users))
    .catch(error => console.error(error));

// Basic request options
const response = await fetch('/api/users', {
    method: 'GET',                    // HTTP method
    headers: {                        // Request headers
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    },
    body: JSON.stringify(data),       // Request body (for POST/PUT)
    mode: 'cors',                     // CORS mode
    credentials: 'include',           // Include credentials (cookies)
    cache: 'no-cache',               // Caching behavior
    redirect: 'follow'               // Redirect handling
});
```

### Understanding Response Objects 📄

```javascript
// Comprehensive response handling
async function handleResponse(url) {
    try {
        const response = await fetch(url);
        
        // Response properties
        console.log('URL:', response.url);
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('OK:', response.ok); // true if status is 200-299
        console.log('Redirected:', response.redirected);
        console.log('Type:', response.type); // 'basic', 'cors', 'error', etc.
        
        // Response headers
        console.log('Content-Type:', response.headers.get('content-type'));
        console.log('Content-Length:', response.headers.get('content-length'));
        
        // Iterate through all headers
        for (let [key, value] of response.headers) {
            console.log(`${key}: ${value}`);
        }
        
        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Parse response based on content type
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType && contentType.includes('text/')) {
            return await response.text();
        } else {
            return await response.blob();
        }
        
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}

// Response body methods (each can only be called once!)
async function parseResponseBody(response) {
    // These methods consume the response body stream
    
    // JSON data
    const jsonData = await response.json();
    
    // Plain text
    const textData = await response.text();
    
    // Binary data as Blob
    const blobData = await response.blob();
    
    // Binary data as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Form data
    const formData = await response.formData();
    
    // Stream (for large responses)
    const reader = response.body.getReader();
    
    // Note: You can only use ONE of these methods per response!
    // If you need to process the same response multiple times, clone it first
    const response1 = response.clone();
    const response2 = response.clone();
}
```

## HTTP Methods and Request Types 🔧

### GET Requests - Retrieving Data 📥

```javascript
// GET request utility class
class APIClient {
    constructor(baseURL = '', defaultHeaders = {}) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        };
    }
    
    // Simple GET request
    async get(endpoint, options = {}) {
        const url = this.buildURL(endpoint, options.params);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            },
            ...options
        });
        
        return this.handleResponse(response);
    }
    
    // GET with query parameters
    async getWithParams(endpoint, params = {}) {
        return this.get(endpoint, { params });
    }
    
    // GET with pagination
    async getPaginated(endpoint, page = 1, limit = 10, filters = {}) {
        const params = {
            page,
            limit,
            ...filters
        };
        
        return this.get(endpoint, { params });
    }
    
    // Build URL with query parameters
    buildURL(endpoint, params = {}) {
        const url = new URL(endpoint, this.baseURL);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach(item => url.searchParams.append(key, item));
                } else {
                    url.searchParams.set(key, value);
                }
            }
        });
        
        return url.toString();
    }
    
    // Generic response handler
    async handleResponse(response) {
        if (!response.ok) {
            const error = await this.parseError(response);
            throw error;
        }
        
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType && contentType.includes('text/')) {
            return await response.text();
        } else {
            return await response.blob();
        }
    }
    
    // Parse error responses
    async parseError(response) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } else {
                errorMessage = await response.text() || errorMessage;
            }
        } catch (parseError) {
            // If we can't parse the error, use the status text
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = response;
        return error;
    }
}

// Usage examples
const api = new APIClient('https://api.example.com');

// Simple GET
const users = await api.get('/users');

// GET with parameters
const user = await api.getWithParams('/users/123', { 
    include: ['profile', 'permissions'] 
});

// GET with search filters
const searchResults = await api.getPaginated('/products', 1, 20, {
    category: 'electronics',
    minPrice: 100,
    maxPrice: 500,
    tags: ['smartphone', 'android']
});

console.log('Search results:', searchResults);
```

### POST, PUT, PATCH, DELETE - Modifying Data 📤

```javascript
// Extend APIClient with mutation methods
class APIClientExtended extends APIClient {
    // POST - Create new resource
    async post(endpoint, data, options = {}) {
        return this.request('POST', endpoint, data, options);
    }
    
    // PUT - Replace entire resource
    async put(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, data, options);
    }
    
    // PATCH - Partial update
    async patch(endpoint, data, options = {}) {
        return this.request('PATCH', endpoint, data, options);
    }
    
    // DELETE - Remove resource
    async delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, null, options);
    }
    
    // Generic request method
    async request(method, endpoint, data = null, options = {}) {
        const url = this.buildURL(endpoint, options.params);
        
        const requestOptions = {
            method,
            headers: {
                ...this.defaultHeaders,
                ...options.headers
            },
            ...options
        };
        
        // Add body for methods that support it
        if (data !== null && ['POST', 'PUT', 'PATCH'].includes(method)) {
            requestOptions.body = this.prepareBody(data, requestOptions.headers);
        }
        
        const response = await fetch(url, requestOptions);
        return this.handleResponse(response);
    }
    
    // Prepare request body based on data type
    prepareBody(data, headers) {
        // If data is already a string, blob, or FormData, use as-is
        if (typeof data === 'string' || 
            data instanceof Blob || 
            data instanceof FormData ||
            data instanceof ArrayBuffer) {
            return data;
        }
        
        // If Content-Type is set to form data, convert to FormData
        const contentType = headers['Content-Type'] || headers['content-type'];
        if (contentType && contentType.includes('multipart/form-data')) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value instanceof File || value instanceof Blob) {
                    formData.append(key, value);
                } else if (Array.isArray(value)) {
                    value.forEach(item => formData.append(key, item));
                } else {
                    formData.append(key, String(value));
                }
            });
            return formData;
        }
        
        // Default to JSON
        return JSON.stringify(data);
    }
    
    // Specialized methods for common operations
    async createUser(userData) {
        return this.post('/users', userData);
    }
    
    async updateUser(userId, userData) {
        return this.put(`/users/${userId}`, userData);
    }
    
    async patchUser(userId, updates) {
        return this.patch(`/users/${userId}`, updates);
    }
    
    async deleteUser(userId) {
        return this.delete(`/users/${userId}`);
    }
    
    // File upload
    async uploadFile(file, metadata = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        Object.entries(metadata).forEach(([key, value]) => {
            formData.append(key, value);
        });
        
        return this.post('/upload', formData, {
            headers: {
                // Don't set Content-Type for FormData - let browser set it with boundary
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    
    // Bulk operations
    async bulkCreate(endpoint, items) {
        return this.post(`${endpoint}/bulk`, { items });
    }
    
    async bulkUpdate(endpoint, updates) {
        return this.patch(`${endpoint}/bulk`, { updates });
    }
    
    async bulkDelete(endpoint, ids) {
        return this.delete(`${endpoint}/bulk`, {
            body: JSON.stringify({ ids }),
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Usage examples
const apiExtended = new APIClientExtended('https://api.example.com');

// Create a new user
const newUser = await apiExtended.createUser({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin'
});

// Update user completely
const updatedUser = await apiExtended.updateUser(newUser.id, {
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    role: 'admin',
    lastLogin: new Date().toISOString()
});

// Partial update (only email)
const patchedUser = await apiExtended.patchUser(newUser.id, {
    email: 'alice.new@example.com'
});

// Upload a file
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
if (file) {
    const uploadResult = await apiExtended.uploadFile(file, {
        description: 'Profile picture',
        category: 'avatar'
    });
    console.log('Upload successful:', uploadResult);
}

// Delete user
await apiExtended.deleteUser(newUser.id);
```

### Headers and Authentication 🔐

```javascript
// Advanced header management and authentication
class AuthenticatedAPIClient extends APIClientExtended {
    constructor(baseURL = '', options = {}) {
        super(baseURL);
        this.authToken = options.authToken || null;
        this.refreshToken = options.refreshToken || null;
        this.onTokenRefresh = options.onTokenRefresh || null;
        this.tokenRefreshPromise = null;
    }
    
    // Override default headers to include authentication
    get defaultHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        };
        
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        return headers;
    }
    
    // Set authentication token
    setAuthToken(token, refreshToken = null) {
        this.authToken = token;
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
    
    // Clear authentication
    clearAuth() {
        this.authToken = null;
        this.refreshToken = null;
    }
    
    // Override request to handle authentication failures
    async request(method, endpoint, data = null, options = {}) {
        try {
            return await super.request(method, endpoint, data, options);
        } catch (error) {
            // Handle 401 Unauthorized
            if (error.status === 401 && this.refreshToken) {
                try {
                    await this.refreshAuthToken();
                    // Retry original request with new token
                    return await super.request(method, endpoint, data, options);
                } catch (refreshError) {
                    // Refresh failed, clear auth and throw original error
                    this.clearAuth();
                    throw error;
                }
            }
            throw error;
        }
    }
    
    // Refresh authentication token
    async refreshAuthToken() {
        // Prevent multiple simultaneous refresh attempts
        if (this.tokenRefreshPromise) {
            return await this.tokenRefreshPromise;
        }
        
        this.tokenRefreshPromise = this.performTokenRefresh();
        
        try {
            const result = await this.tokenRefreshPromise;
            return result;
        } finally {
            this.tokenRefreshPromise = null;
        }
    }
    
    async performTokenRefresh() {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken: this.refreshToken
            })
        });
        
        if (!response.ok) {
            throw new Error('Token refresh failed');
        }
        
        const tokenData = await response.json();
        this.setAuthToken(tokenData.accessToken, tokenData.refreshToken);
        
        // Notify application about token refresh
        if (this.onTokenRefresh) {
            this.onTokenRefresh(tokenData);
        }
        
        return tokenData;
    }
    
    // Authentication methods
    async login(credentials) {
        const response = await this.post('/auth/login', credentials);
        
        if (response.accessToken) {
            this.setAuthToken(response.accessToken, response.refreshToken);
        }
        
        return response;
    }
    
    async logout() {
        try {
            await this.post('/auth/logout', {
                refreshToken: this.refreshToken
            });
        } catch (error) {
            console.warn('Logout request failed:', error);
        } finally {
            this.clearAuth();
        }
    }
    
    // API key authentication
    setAPIKey(apiKey, headerName = 'X-API-Key') {
        this.defaultHeaders[headerName] = apiKey;
    }
    
    // Custom header methods
    setHeader(name, value) {
        this.defaultHeaders[name] = value;
    }
    
    removeHeader(name) {
        delete this.defaultHeaders[name];
    }
    
    // Request with custom headers
    async requestWithHeaders(method, endpoint, data, customHeaders) {
        return this.request(method, endpoint, data, {
            headers: customHeaders
        });
    }
}

// Usage examples
const authAPI = new AuthenticatedAPIClient('https://api.example.com', {
    onTokenRefresh: (tokenData) => {
        // Save new tokens to localStorage
        localStorage.setItem('accessToken', tokenData.accessToken);
        localStorage.setItem('refreshToken', tokenData.refreshToken);
    }
});

// Login
const loginResult = await authAPI.login({
    email: 'user@example.com',
    password: 'password123'
});

console.log('Login successful:', loginResult);

// Make authenticated requests
const profile = await authAPI.get('/user/profile');
const settings = await authAPI.get('/user/settings');

// The client automatically handles token refresh if needed
const protectedData = await authAPI.get('/protected/data');

// Custom headers for specific requests
const specialData = await authAPI.requestWithHeaders('GET', '/special-endpoint', null, {
    'X-Special-Header': 'special-value',
    'X-Request-ID': generateRequestId()
});

function generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
}
```

## Advanced Response Handling 🎯

### Streaming and Large Responses 🌊

```javascript
// Handle streaming responses and large data
class StreamingAPIClient extends AuthenticatedAPIClient {
    // Stream response for large files or real-time data
    async streamResponse(endpoint, onChunk, options = {}) {
        const response = await fetch(this.buildURL(endpoint), {
            method: 'GET',
            headers: this.defaultHeaders,
            ...options
        });
        
        if (!response.ok) {
            throw await this.parseError(response);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                const chunk = decoder.decode(value);
                await onChunk(chunk);
            }
        } finally {
            reader.releaseLock();
        }
    }
    
    // Download file with progress tracking
    async downloadFile(endpoint, onProgress = null) {
        const response = await fetch(this.buildURL(endpoint), {
            method: 'GET',
            headers: this.defaultHeaders
        });
        
        if (!response.ok) {
            throw await this.parseError(response);
        }
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        let loaded = 0;
        
        const reader = response.body.getReader();
        const chunks = [];
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                loaded += value.length;
                
                if (onProgress && total > 0) {
                    onProgress({
                        loaded,
                        total,
                        percentage: (loaded / total) * 100
                    });
                }
            }
        } finally {
            reader.releaseLock();
        }
        
        // Combine chunks into a single Blob
        const blob = new Blob(chunks);
        return blob;
    }
    
    // Server-Sent Events (SSE) streaming
    async streamEvents(endpoint, onEvent, onError = null) {
        const eventSource = new EventSource(this.buildURL(endpoint));
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onEvent(data);
            } catch (error) {
                console.error('Failed to parse SSE data:', error);
                if (onError) onError(error);
            }
        };
        
        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            if (onError) onError(error);
        };
        
        // Return close function
        return () => {
            eventSource.close();
        };
    }
    
    // Upload file with progress tracking
    async uploadFileWithProgress(file, endpoint = '/upload', onProgress = null, metadata = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            
            formData.append('file', file);
            Object.entries(metadata).forEach(([key, value]) => {
                formData.append(key, value);
            });
            
            if (onProgress) {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        onProgress({
                            loaded: event.loaded,
                            total: event.total,
                            percentage: (event.loaded / event.total) * 100
                        });
                    }
                };
            }
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        resolve(result);
                    } catch (error) {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
                }
            };
            
            xhr.onerror = () => {
                reject(new Error('Upload failed: Network error'));
            };
            
            xhr.open('POST', this.buildURL(endpoint));
            
            // Add auth headers
            Object.entries(this.defaultHeaders).forEach(([key, value]) => {
                if (key !== 'Content-Type') { // Let browser set Content-Type for FormData
                    xhr.setRequestHeader(key, value);
                }
            });
            
            xhr.send(formData);
        });
    }
    
    // Parallel requests with concurrency control
    async parallelRequests(requests, maxConcurrency = 5) {
        const results = [];
        const executing = [];
        
        for (const [index, request] of requests.entries()) {
            const promise = this.executeRequest(request).then(result => ({
                index,
                result,
                success: true
            })).catch(error => ({
                index,
                error,
                success: false
            }));
            
            results.push(promise);
            
            if (results.length >= maxConcurrency) {
                executing.push(promise);
                
                if (executing.length >= maxConcurrency) {
                    await Promise.race(executing);
                    executing.splice(0, 1);
                }
            }
        }
        
        return Promise.all(results);
    }
    
    async executeRequest(request) {
        const { method, endpoint, data, options } = request;
        return this.request(method, endpoint, data, options);
    }
}

// Usage examples
const streamingAPI = new StreamingAPIClient('https://api.example.com');

// Stream large response
await streamingAPI.streamResponse('/api/large-dataset', (chunk) => {
    console.log('Received chunk:', chunk);
    // Process chunk incrementally
});

// Download file with progress
const blob = await streamingAPI.downloadFile('/files/large-file.zip', (progress) => {
    console.log(`Download progress: ${progress.percentage.toFixed(1)}%`);
    updateProgressBar(progress.percentage);
});

// Save downloaded file
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'large-file.zip';
a.click();
URL.revokeObjectURL(url);

// Upload with progress
const fileInput = document.querySelector('input[type="file"]');
if (fileInput.files[0]) {
    const uploadResult = await streamingAPI.uploadFileWithProgress(
        fileInput.files[0],
        '/upload',
        (progress) => {
            console.log(`Upload progress: ${progress.percentage.toFixed(1)}%`);
            updateUploadProgress(progress.percentage);
        },
        { category: 'documents' }
    );
    console.log('Upload complete:', uploadResult);
}

// Server-Sent Events
const closeSSE = await streamingAPI.streamEvents('/events', (data) => {
    console.log('Real-time event:', data);
    updateUI(data);
}, (error) => {
    console.error('SSE error:', error);
});

// Close SSE connection when needed
// closeSSE();

function updateProgressBar(percentage) {
    console.log(`Progress: ${percentage}%`);
}

function updateUploadProgress(percentage) {
    console.log(`Upload: ${percentage}%`);
}

function updateUI(data) {
    console.log('UI update:', data);
}
```

### Error Handling and Retry Logic 🔄

```javascript
// Robust error handling and retry mechanisms
class ResilientAPIClient extends StreamingAPIClient {
    constructor(baseURL = '', options = {}) {
        super(baseURL, options);
        this.retryConfig = {
            maxRetries: 3,
            retryDelay: 1000,
            retryMultiplier: 2,
            maxRetryDelay: 10000,
            retryableStatuses: [408, 429, 500, 502, 503, 504],
            ...options.retryConfig
        };
    }
    
    // Override request with retry logic
    async request(method, endpoint, data = null, options = {}) {
        const requestOptions = {
            retries: this.retryConfig.maxRetries,
            ...options
        };
        
        return this.requestWithRetry(method, endpoint, data, requestOptions);
    }
    
    async requestWithRetry(method, endpoint, data, options, attempt = 1) {
        try {
            return await super.request(method, endpoint, data, options);
        } catch (error) {
            const shouldRetry = this.shouldRetryRequest(error, attempt, options.retries);
            
            if (shouldRetry) {
                const delay = this.calculateRetryDelay(attempt);
                console.warn(`Request failed (attempt ${attempt}), retrying in ${delay}ms:`, error.message);
                
                await this.delay(delay);
                return this.requestWithRetry(method, endpoint, data, options, attempt + 1);
            }
            
            throw error;
        }
    }
    
    shouldRetryRequest(error, attempt, maxRetries) {
        // Don't retry if we've exceeded max attempts
        if (attempt >= maxRetries) {
            return false;
        }
        
        // Retry on network errors
        if (!error.status) {
            return true;
        }
        
        // Retry on specific HTTP status codes
        return this.retryConfig.retryableStatuses.includes(error.status);
    }
    
    calculateRetryDelay(attempt) {
        const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.retryMultiplier, attempt - 1);
        return Math.min(delay, this.retryConfig.maxRetryDelay);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Request with timeout
    async requestWithTimeout(method, endpoint, data, timeout = 30000, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const result = await this.request(method, endpoint, data, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            
            throw error;
        }
    }
    
    // Circuit breaker pattern
    createCircuitBreaker(endpoint, options = {}) {
        return new CircuitBreaker(this, endpoint, options);
    }
    
    // Exponential backoff with jitter
    calculateExponentialBackoff(attempt, baseDelay = 1000, maxDelay = 30000) {
        const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
        return Math.min(exponentialDelay + jitter, maxDelay);
    }
    
    // Request with custom error handling
    async requestWithErrorHandler(method, endpoint, data, errorHandler, options = {}) {
        try {
            return await this.request(method, endpoint, data, options);
        } catch (error) {
            const handledError = await errorHandler(error, { method, endpoint, data });
            
            if (handledError.retry) {
                return this.requestWithRetry(method, endpoint, data, options);
            }
            
            throw handledError.error || error;
        }
    }
}

// Circuit breaker implementation
class CircuitBreaker {
    constructor(apiClient, endpoint, options = {}) {
        this.apiClient = apiClient;
        this.endpoint = endpoint;
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 60000;
        this.monitoringPeriod = options.monitoringPeriod || 60000;
        
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failures = 0;
        this.lastFailureTime = 0;
        this.nextAttemptTime = 0;
    }
    
    async execute(method, data = null, options = {}) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttemptTime) {
                throw new Error('Circuit breaker is OPEN');
            }
            this.state = 'HALF_OPEN';
        }
        
        try {
            const result = await this.apiClient.request(method, this.endpoint, data, options);
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }
    
    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
    
    onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttemptTime = Date.now() + this.resetTimeout;
        }
    }
    
    getState() {
        return {
            state: this.state,
            failures: this.failures,
            nextAttemptTime: this.nextAttemptTime
        };
    }
}

// Usage examples
const resilientAPI = new ResilientAPIClient('https://api.example.com', {
    retryConfig: {
        maxRetries: 5,
        retryDelay: 2000,
        retryMultiplier: 1.5
    }
});

// Request with automatic retries
try {
    const data = await resilientAPI.get('/api/unreliable-endpoint');
    console.log('Data received:', data);
} catch (error) {
    console.error('Request failed after retries:', error);
}

// Request with timeout
try {
    const data = await resilientAPI.requestWithTimeout('GET', '/api/slow-endpoint', null, 5000);
    console.log('Data received within timeout:', data);
} catch (error) {
    console.error('Request failed or timed out:', error);
}

// Circuit breaker for problematic endpoints
const circuitBreaker = resilientAPI.createCircuitBreaker('/api/problematic-endpoint', {
    failureThreshold: 3,
    resetTimeout: 30000
});

try {
    const result = await circuitBreaker.execute('GET');
    console.log('Circuit breaker request successful:', result);
} catch (error) {
    console.error('Circuit breaker request failed:', error);
    console.log('Circuit breaker state:', circuitBreaker.getState());
}

// Custom error handling
const customErrorHandler = async (error, context) => {
    console.log('Handling error:', error, 'for request:', context);
    
    if (error.status === 401) {
        // Handle authentication error
        await resilientAPI.refreshAuthToken();
        return { retry: true };
    }
    
    if (error.status === 429) {
        // Handle rate limiting
        const retryAfter = error.response?.headers?.get('Retry-After');
        if (retryAfter) {
            await resilientAPI.delay(parseInt(retryAfter) * 1000);
            return { retry: true };
        }
    }
    
    return { error };
};

try {
    const result = await resilientAPI.requestWithErrorHandler(
        'GET',
        '/api/protected',
        null,
        customErrorHandler
    );
    console.log('Request with custom error handling successful:', result);
} catch (error) {
    console.error('Request failed after custom error handling:', error);
}
```

## Summary

### Core Concepts
- **Fetch API Basics:** Modern Promise-based HTTP communication
- **Response Objects:** Understanding status, headers, and body parsing
- **HTTP Methods:** GET, POST, PUT, PATCH, DELETE operations
- **Request Configuration:** Headers, body, mode, credentials, and caching

### Advanced Features
- **Authentication:** Token management, refresh mechanisms, and secure headers
- **Streaming:** Large file downloads, uploads with progress, and real-time data
- **Error Handling:** Retry logic, circuit breakers, and graceful degradation
- **Performance:** Parallel requests, concurrency control, and efficient data transfer

### Best Practices
- **Error Handling:** Always check response.ok and handle network failures
- **Authentication:** Implement token refresh and secure credential management
- **Performance:** Use appropriate request methods and optimize for your use case
- **User Experience:** Provide progress feedback for long-running operations

### Security Considerations
- **CORS:** Understand cross-origin request implications
- **Headers:** Sanitize and validate all request/response headers
- **Authentication:** Securely store and transmit authentication tokens
- **Data Validation:** Always validate and sanitize API responses

### Performance Optimization
- **Request Batching:** Combine multiple requests when possible
- **Caching:** Implement appropriate caching strategies
- **Compression:** Use gzip/brotli for large payloads
- **Streaming:** Use streaming for large files and real-time data

### My Personal Insight
The Fetch API transformed how I approach HTTP communication in web applications. Moving from XMLHttpRequest to fetch was like upgrading from a basic postal service to a modern logistics platform.

The real power comes from understanding that **fetch is just the foundation** - building robust network communication requires layers of error handling, retry logic, authentication management, and performance optimization.

**The key insight: Modern web applications are distributed systems, and the Fetch API is your primary tool for building reliable communication between the parts.**

### Next Up
Now that you've mastered network requests, we'll explore **Web Storage & IndexedDB** - the client-side storage solutions that enable offline functionality, data persistence, and sophisticated local data management.

Remember: The Fetch API isn't just about making requests - it's about building reliable, performant, and secure communication systems for modern web applications! 🚀✨
