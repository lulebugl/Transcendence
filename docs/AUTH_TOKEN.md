# Authentification token
This document explain how the autentification process work.

## What login do ?
When the user login, a call is made to the api route /api/users/login.
This route will then check if the given password and user match what the database have registered and if true will return :
- An **access_token** that the frontend will store in memory
- A **refresh_token** that the backend will store directly in the browser cookies

## What is the access token ?
The access token is a **JWT** token that is short-lived (15min) that is stored in memory only. It's purpose is to access protected routes that contains user informations or that modify user informations.

JWT token is created by using the [fastify jwt plugin](https://github.com/fastify/fastify-jwt)
```ts
// acess token creation
const accessToken: string = fastify.jwt.sign(
	{ id: user.id, username: user.username, email: user.email }, 
	{ expiresIn: "15m" }
); 
```
This token is stored in the frontend code which protect it from :

| Attack | Protection Explanation|
|--------|-----------------------|
| XSS (Cross-Site Scripting) | Since access token is stored in memory only, injected scripts cannot persistently steal it.
| Token tampering | JWT is signed, so backend can detect if someone altered the payload.
| Replay attacks | Short lifespan limits the window in which a stolen token can be used.
| CSRF (Cross-Site Request Frogery) | Using access token in Authorization header (not in cookie) prevents automatic sending by the browser, mitigating CSRF.

But that make the token to be losed when the user reload the page.

## What is the refresh token ?
The refresh token is a chain of 64 bytes randomly generated and stored in the database.
It can only be used on the refresh api route to retrieve a new access token when it expired.
By doing so a new refresh token is generated replacing the first one to prevent reusability.

This token is stored by the frontend in the cookies in HttpOnly which protect it from :

| Attack | Protection Explanation|
|--------|-----------------------|
| XSS | HttpOnly cookie cannot be accessed via JavaScript, so scripts cannot steal it. |
| CSRF | If used with SameSite=Strict attribute, mitigates CSRF when sending refresh requests. |
| Token theft | Stored in DB, can be revoked or rotated, limiting damage if stolen. |
| Replay attacks | Rotation per use + short validity reduces risk of token reuse. |

## Token lifecycle diagram
```
┌─────────────┐
│   Login     │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│ Access Token│ <- short-lived (5–15 min)
│  in memory  │
└─────┬───────┘
      │
      ▼
┌───────────────┐
│Refresh Token  │ <- long-lived (7–30 days)
│HttpOnly cookie│
└─────┬─────────┘
      │
      ▼
┌───────────────────────┐
│   API Calls           │
│ - attach Access Token │
│ - expires? → 401      │
└─────────┬─────────────┘
          │
          ▼
┌───────────────────────┐
│  Access Token Refresh │
│ - call /refresh       │
│ - new Access Token    │
└─────────┬─────────────┘
          │
          ▼
Continue API calls
```