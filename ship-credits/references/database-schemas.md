# Credit Database Variants

Read this reference after detecting the database. Implement exactly one schema variant and preserve the shared balance, audit-trail, indexing, and atomicity requirements.

## Contents

- [SQL databases](#for-sql-databases-supabase--postgres--planetscale)
- [Prisma](#for-prisma)
- [MongoDB and Mongoose](#for-mongodb--mongoose)

Create the schema that matches their database.

### For SQL databases (Supabase / Postgres / PlanetScale):

**Users table** — add credits column if it doesn't exist:
```sql
-- Add to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits integer DEFAULT [FREE_CREDITS] NOT NULL;
```

If no users table exists, create one with the minimum needed:
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id text UNIQUE NOT NULL,        -- from auth provider (clerk_id, supabase uid, etc.)
  email text UNIQUE,
  credits integer DEFAULT [FREE_CREDITS] NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

**Credit transactions table** — this is the audit trail. Non-negotiable:
```sql
CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  amount integer NOT NULL,              -- positive = add, negative = spend
  reason text NOT NULL,                 -- 'signup_bonus', 'purchase', 'generation', 'refund', 'admin_grant', 'promo_code'
  metadata jsonb DEFAULT '{}',          -- payment_id, action details, admin notes
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_tx_created ON credit_transactions(created_at);
```

**Promo codes table** (optional but recommended):
```sql
CREATE TABLE promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  credits_amount integer NOT NULL,
  max_uses integer DEFAULT 1,
  times_used integer DEFAULT 0,
  email text,                           -- NULL = anyone can use, set = restricted to this email
  expires_at timestamptz,               -- NULL = never expires
  created_at timestamptz DEFAULT now()
);
```

### For Prisma:

```prisma
model User {
  id        String   @id @default(uuid())
  authId    String   @unique @map("auth_id")
  email     String?  @unique
  credits   Int      @default([FREE_CREDITS])
  createdAt DateTime @default(now()) @map("created_at")

  transactions CreditTransaction[]

  @@map("users")
}

model CreditTransaction {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  amount    Int                          // positive = add, negative = spend
  reason    String                       // signup_bonus, purchase, generation, etc.
  metadata  Json     @default("{}")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([createdAt])
  @@map("credit_transactions")
}
```

### For MongoDB / Mongoose:

```javascript
const creditTransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now, index: true },
});
```

**Tell the user**: "Created credit_transactions table. Every credit change is logged — you'll never wonder where credits went."
