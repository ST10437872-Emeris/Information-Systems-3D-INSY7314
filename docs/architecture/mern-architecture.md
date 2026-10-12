# Member 1 Backend Architecture

```mermaid
flowchart LR
    Client[Frontend / Postman] -->|HTTPS JSON| Express[Express App]
    Express --> Routes[Routes]
    Routes --> Validation[Validation Middleware]
    Validation --> Controller[Auth Controller]
    Controller --> Model[In-memory User Model]
    Routes --> Auth[JWT Auth Middleware]
    Express --> Errors[Controlled Error Middleware]
    Controller --> Response[API Response Helper]
```

This diagram represents Member 1's backend foundation. MongoDB can replace the in-memory model in a later project stage without changing the route/controller separation.
