### Roadmap
- [x] Create stories with OpenAI API
- [x] Use user input to build story generation prompt
- [x] Save stories to database
- [ ] Create express API to fetch stories (index, show)
- [ ] Create mobile app to read stories from API

### Stack
- Language: Typescript
- Framework: Express
- ORM: Prisma
- Database: Postgres
- Database Hosting: Aws RDS

### To import prisma

```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

### To Generate AND Migration

> npm run prisma migrate dev --name init

### To Run Migrations

> npm run prisma migrate dev

### To run in live env

> npm run prisma migrate deploy