

AuthRouter
- POST /signup
- POST /login
- POST /loguot

ProfileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/password

ConnectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

UserRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed


Staus : ignored, interested, accepted, rejected