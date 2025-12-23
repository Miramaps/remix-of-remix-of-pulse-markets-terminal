# Pulse Markets Terminal

## Overview

A terminal application for pulse markets.

## What is it?

A web-based trading interface for prediction markets - markets where you bet on the outcome of real-world events (elections, crypto prices, sports, pop culture, etc).

### How Prediction Markets Work
- Each market asks a YES/NO question (e.g., "Will Bitcoin hit $150K before Feb 2025?")
- Prices range from $0.00 to $1.00 representing probability
- **YES at $0.65** means the market thinks there's a 65% chance it happens
- If you're right, you win $1 per share. If wrong, you lose your stake.

## Solana Smart Contract Architecture

### Core Contracts

#### 1. **Market Factory Contract**
- **Permissionless Market Creation** - Anyone can create a market by calling `createMarket()`
- **Required Parameters:**
  - Question text (max 200 chars)
  - Resolution source (oracle address or manual resolver)
  - End date timestamp
  - Category tag
  - Initial liquidity (minimum 0.1 SOL)
- **Market Creation Fee:** 0.01 SOL (goes to protocol treasury)
- **Returns:** Unique market PDA (Program Derived Address)

#### 2. **Dual Bonding Curve System**

Each market has **TWO independent bonding curves:**

##### YES Bonding Curve
```
Price_YES = (YES_Supply) / (YES_Supply + NO_Supply + k)
```

##### NO Bonding Curve
```
Price_NO = (NO_Supply) / (YES_Supply + NO_Supply + k)
```

**Key Properties:**
- `k` = constant (default 100) for price stability
- Prices always sum to ≈ $1.00 (arbitrage keeps them balanced)
- **Buy pressure on YES increases YES price, decreases NO price**
- **Automated Market Maker (AMM)** - no order books needed

##### Bonding Curve Math Example:
- Initial state: YES supply = 100, NO supply = 100
- YES price = 100/(100+100+100) = $0.33
- NO price = 100/(100+100+100) = $0.33
- User buys 50 YES shares → YES supply = 150
- New YES price = 150/(150+100+100) = $0.43
- New NO price = 100/(150+100+100) = $0.29

#### 3. **Liquidity Pool Contract**

##### Initial Liquidity (Market Creation)
```rust
// Market creator deposits SOL
// Contract mints equal YES and NO shares
// Shares locked in LP until resolution
```

**Example:**
- Creator deposits 1 SOL
- Contract mints 100 YES + 100 NO shares
- Both curves start at $0.50 each
- Creator receives LP tokens representing ownership

##### Ongoing Liquidity Flow
1. **Buy Transaction:**
   - User sends SOL → bonding curve contract
   - Contract calculates shares via curve formula
   - Mints new YES or NO tokens to user
   - SOL stays in liquidity pool

2. **Sell Transaction:**
   - User sends YES/NO shares → contract
   - Contract burns shares
   - Calculates SOL refund via curve
   - Sends SOL from pool to user

##### Where Does Liquidity Go?

**During Trading (Before Resolution):**
- All SOL sits in the Market Liquidity Pool PDA
- Growing pool = more trades = deeper liquidity
- Pool earns 0.3% fee on each trade
- Fees compound into pool depth

**After Resolution:**

**Scenario A: Market Resolves YES**
```
1. All YES shares become redeemable for $1.00 each
2. YES holders call redeem() → get proportional SOL
3. NO shares become worthless (burned)
4. Remaining liquidity:
   - 2% goes to oracle/resolver
   - 1% goes to protocol treasury
   - 97% distributed to YES winners
```

**Scenario B: Market Resolves NO**
```
1. All NO shares redeemable for $1.00
2. NO holders redeem for SOL
3. YES shares worthless
4. Same fee distribution as above
```

**Scenario C: Invalid/Cancelled**
```
1. All trades reversed proportionally
2. Users refund based on share amount × avg cost basis
3. Creator gets initial liquidity back minus gas
```

#### 4. **Resolution Oracle Contract**

**Three Resolution Methods:**

1. **Automated Oracle (Chainlink/Pyth)**
   - Pulls data from external feed
   - Auto-resolves when condition met
   - Example: BTC price hits $150K

2. **Manual Resolution (Trusted Resolver)**
   - Market creator designates resolver address
   - Resolver calls `resolve(outcome)` after event
   - 48-hour dispute window

3. **DAO Vote Resolution**
   - Disputed markets go to token holder vote
   - Requires 1000 protocol tokens to initiate
   - 7-day voting period
   - Majority wins

#### 5. **Fee Distribution Contract**

**Fee Structure:**
- **Trading Fee:** 0.3% per swap
  - 0.2% → Liquidity providers
  - 0.1% → Protocol treasury
- **Market Creation Fee:** 0.01 SOL → Protocol treasury
- **Resolution Fee:** 2% of final pool → Oracle/Resolver
- **Early Exit Fee:** 1% if selling within first hour (anti-sniping)

##### Fee Accumulation Example:
```
Market: "Will ETH flip BTC in 2025?"
Total Volume: 100 SOL
Trading Fees Collected: 0.3 SOL

Distribution:
- 0.2 SOL → LP token holders (pro-rata)
- 0.1 SOL → Treasury
- At resolution: 2 SOL → Resolver (if pool is 100 SOL)
```

### Contract Security Features

- **Reentrancy Guards** on all external calls
- **Slippage Protection** (max 5% price impact per trade)
- **Time Locks** on resolution (prevents instant rug)
- **Pause Mechanism** for emergency stops
- **Upgrade Authority** held by multisig DAO
- **Audit by:** [TODO: Add audit firm]

### Market Lifecycle

```
1. CREATE → Anyone calls createMarket() + deposits initial liquidity
2. TRADING → Users buy/sell YES/NO via bonding curves
3. LOCKED → Market end date reached, trading stops
4. RESOLVING → Oracle/resolver determines outcome (48hr window)
5. RESOLVED → Winners redeem shares for $1.00 each in SOL
6. CLOSED → Remaining liquidity distributed, market archived
```

### Example Market Math

**Market: "Will Solana hit $500 before June 2025?"**

**Initial State:**
- Creator deposits: 2 SOL
- YES supply: 200 shares @ $0.50
- NO supply: 200 shares @ $0.50
- Total liquidity: 2 SOL

**After $10 SOL in YES Buys:**
- YES supply: 350 shares @ $0.65
- NO supply: 200 shares @ $0.35
- Total liquidity: 12 SOL
- Market implies 65% chance YES

**Resolution (YES Wins):**
- 350 YES shares × $1.00 = $12 distributed to YES holders
- NO shares burned
- Resolver gets 0.24 SOL (2%)
- Protocol gets 0.12 SOL (1%)
- YES holders split remaining ~11.64 SOL

## Getting Started

### Prerequisites

- Node.js (version X.X or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Usage

```bash
npm start
```

## Features

- **3-column layout** - New, Ending Soon, Resolved markets
- **YES/NO trading buttons** with circular progress rings or square style
- **Real-time price flashing** on updates
- **Fast buy** - Quick purchase with preset amounts
- **Watchlist** - Star markets & view in navbar popup
- **Market cards** showing: price change %, sentiment, volume, traders
- **Tooltips** on hover for all metrics
- **Display Settings** - Button size, shape, image shape, visibility
- **Filters & Sort** - By volume, time, category, verified

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[Add license information here]

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS + Radix UI
- Framer Motion
- Lucide icons

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Backend Integration Requirements

### 🔴 **CRITICAL: What's Left to Build**

#### 1. **Solana Program (Smart Contracts)**

##### A. Market Factory Program (`/programs/market-factory/`)
**Status:** ❌ NOT STARTED

**Required Instructions:**
```rust
// src/lib.rs
pub mod instructions {
    pub mod create_market;      // ❌ TODO
    pub mod initialize_curves;  // ❌ TODO
    pub mod add_initial_liquidity; // ❌ TODO
}

pub mod state {
    pub mod market;            // ❌ TODO - Market account structure
    pub mod bonding_curve;     // ❌ TODO - Curve parameters
}
```

**Accounts to Define:**
- `Market` - Stores question, end_date, resolution_source, status
- `BondingCurveYes` - YES curve state (supply, k constant)
- `BondingCurveNo` - NO curve state (supply, k constant)
- `LiquidityPool` - SOL vault PDA
- `ProtocolConfig` - Fee rates, treasury address

**Key Functions:**
```rust
// ❌ TODO: Implement these
pub fn create_market(
    ctx: Context<CreateMarket>,
    question: String,
    end_timestamp: i64,
    initial_liquidity: u64,
) -> Result<()>

pub fn initialize_bonding_curves(
    ctx: Context<InitCurves>,
    k_constant: u64,
) -> Result<()>
```

##### B. Trading Program (`/programs/trading/`)
**Status:** ❌ NOT STARTED

**Required Instructions:**
```rust
pub mod instructions {
    pub mod buy_shares;        // ❌ TODO - Buy YES or NO
    pub mod sell_shares;       // ❌ TODO - Sell YES or NO
    pub mod calculate_price;   // ❌ TODO - Bonding curve math
    pub mod process_fees;      // ❌ TODO - Deduct 0.3% fee
}
```

**Critical Math Functions:**
```rust
// ❌ TODO: Implement bonding curve formula
pub fn calculate_buy_price(
    yes_supply: u64,
    no_supply: u64,
    k: u64,
    shares_to_buy: u64,
    is_yes: bool,
) -> Result<u64>

pub fn calculate_sell_return(
    yes_supply: u64,
    no_supply: u64,
    k: u64,
    shares_to_sell: u64,
    is_yes: bool,
) -> Result<u64>

// ❌ TODO: Slippage protection
pub fn check_slippage(
    expected_price: u64,
    actual_price: u64,
    max_slippage_bps: u16, // basis points
) -> Result<()>
```

##### C. Resolution Program (`/programs/resolution/`)
**Status:** ❌ NOT STARTED

**Required Instructions:**
```rust
pub mod instructions {
    pub mod resolve_market;     // ❌ TODO - Set outcome
    pub mod redeem_winning_shares; // ❌ TODO - Claim $1 per share
    pub mod distribute_fees;    // ❌ TODO - Pay resolver + treasury
    pub mod handle_dispute;     // ❌ TODO - Challenge resolution
}
```

**Resolution Logic:**
```rust
// ❌ TODO
pub fn resolve_market(
    ctx: Context<ResolveMarket>,
    outcome: MarketOutcome, // YES, NO, INVALID
) -> Result<()> {
    // 1. Check resolver authority
    // 2. Verify end_timestamp passed
    // 3. Lock trading
    // 4. Set market.resolved_outcome
    // 5. Start 48hr dispute window
}

// ❌ TODO
pub fn redeem_winning_shares(
    ctx: Context<Redeem>,
    share_amount: u64,
) -> Result<()> {
    // 1. Verify market resolved
    // 2. Check user holds winning shares
    // 3. Calculate: (share_amount / total_winning_supply) * pool_balance
    // 4. Burn shares
    // 5. Transfer SOL to user
}
```

#### 2. **Backend API Server** (`/backend/`)

**Status:** ❌ NOT STARTED

**Required Stack:**
- **Framework:** Node.js + Express or Rust + Axum
- **Database:** PostgreSQL for indexing
- **WebSocket:** Socket.io for real-time updates
- **Caching:** Redis for price/volume caching

##### A. Solana RPC Integration (`/backend/src/solana/`)

**Files Needed:**
```
/backend/src/solana/
├── connection.ts          // ❌ TODO - RPC connection manager
├── market-listener.ts     // ❌ TODO - Listen to market creation events
├── trade-listener.ts      // ❌ TODO - Listen to buy/sell events
├── price-updater.ts       // ❌ TODO - Real-time price calculations
└── transaction-builder.ts // ❌ TODO - Build & sign transactions
```

**Critical Functions:**

```typescript
// ❌ TODO: /backend/src/solana/connection.ts
import { Connection, PublicKey } from '@solana/web3.js';

export class SolanaConnection {
  private connection: Connection;
  private programId: PublicKey;

  constructor() {
    // Connect to Solana RPC (mainnet/devnet)
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    );
    this.programId = new PublicKey(process.env.PROGRAM_ID!);
  }

  // Subscribe to program account changes
  async subscribeToMarkets() {
    // ❌ TODO: Implement WebSocket subscription
  }
}
```

```typescript
// ❌ TODO: /backend/src/solana/market-listener.ts
export class MarketListener {
  async listenForNewMarkets() {
    // ❌ TODO: Listen to CreateMarket instruction logs
    // Parse transaction data → extract market PDA
    // Insert into PostgreSQL markets table
  }

  async listenForTrades() {
    // ❌ TODO: Listen to BuyShares/SellShares instructions
    // Update market volume, price, trader count
    // Emit WebSocket event to frontend
  }
}
```

```typescript
// ❌ TODO: /backend/src/solana/price-updater.ts
export class PriceUpdater {
  async calculateCurrentPrice(marketPda: string): Promise<{
    yesPrice: number;
    noPrice: number;
  }> {
    // ❌ TODO:
    // 1. Fetch BondingCurveYes and BondingCurveNo accounts
    // 2. Read yes_supply, no_supply, k
    // 3. Calculate: yes_price = yes_supply / (yes_supply + no_supply + k)
    // 4. Calculate: no_price = no_supply / (yes_supply + no_supply + k)
    // 5. Return prices
  }

  async subscribeToAllMarkets() {
    // ❌ TODO: Poll or subscribe to all active markets
    // Update prices every 1 second
    // Broadcast via WebSocket
  }
}
```

##### B. REST API Endpoints (`/backend/src/api/`)

**Required Routes:**

```typescript
// ❌ TODO: /backend/src/api/markets.ts
import express from 'express';

const router = express.Router();

// GET /api/markets - List all markets
router.get('/', async (req, res) => {
  // ❌ TODO: Query PostgreSQL
  // Filter by: status, category, verified
  // Sort by: volume, end_date, created_at
  // Pagination support
});

// GET /api/markets/:id - Get single market
router.get('/:id', async (req, res) => {
  // ❌ TODO: Fetch market by PDA
  // Include: current prices, volume, trader count
});

// POST /api/markets/create - Create new market
router.post('/create', async (req, res) => {
  // ❌ TODO:
  // 1. Validate request body
  // 2. Build Solana transaction (createMarket instruction)
  // 3. Return unsigned transaction for frontend to sign
});

// POST /api/markets/:id/trade - Buy/Sell shares
router.post('/:id/trade', async (req, res) => {
  // ❌ TODO:
  // 1. Validate: side (YES/NO), amount, slippage
  // 2. Calculate expected price via bonding curve
  // 3. Build buy_shares or sell_shares instruction
  // 4. Return unsigned transaction
});
```

```typescript
// ❌ TODO: /backend/src/api/user.ts
router.get('/portfolio/:wallet', async (req, res) => {
  // ❌ TODO: Fetch user's YES/NO token balances
  // Calculate total portfolio value
  // Show P&L for each position
});

router.get('/watchlist/:wallet', async (req, res) => {
  // ❌ TODO: Query user's starred markets from DB
});
```

##### C. WebSocket Real-Time Updates (`/backend/src/websocket/`)

```typescript
// ❌ TODO: /backend/src/websocket/server.ts
import { Server } from 'socket.io';

export class WebSocketServer {
  private io: Server;

  constructor(httpServer: any) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' }
    });

    this.setupListeners();
  }

  private setupListeners() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // ❌ TODO: Join market rooms
      socket.on('subscribe:market', (marketId: string) => {
        socket.join(`market:${marketId}`);
      });

      // ❌ TODO: Leave rooms
      socket.on('unsubscribe:market', (marketId: string) => {
        socket.leave(`market:${marketId}`);
      });
    });
  }

  // Broadcast price update to all subscribers
  broadcastPriceUpdate(marketId: string, data: any) {
    this.io.to(`market:${marketId}`).emit('price:update', data);
  }

  // Broadcast new trade
  broadcastTrade(marketId: string, trade: any) {
    this.io.to(`market:${marketId}`).emit('trade:new', trade);
  }
}
```

##### D. Database Schema (`/backend/prisma/schema.prisma`)

**Status:** ❌ NOT CREATED

```prisma
// ❌ TODO: Define PostgreSQL schema
model Market {
  id            String   @id @default(uuid())
  pda           String   @unique  // Solana PDA address
  question      String
  category      String
  endDate       DateTime
  createdAt     DateTime @default(now())
  resolved      Boolean  @default(false)
  outcome       String?  // "YES" | "NO" | "INVALID"
  
  yesSupply     BigInt
  noSupply      BigInt
  yesPrice      Float
  noPrice       Float
  
  volume24h     Float    @default(0)
  traderCount   Int      @default(0)
  verified      Boolean  @default(false)
  
  trades        Trade[]
  watchlists    Watchlist[]
}

model Trade {
  id        String   @id @default(uuid())
  marketId  String
  market    Market   @relation(fields: [marketId], references: [id])
  
  wallet    String
  side      String   // "YES" | "NO"
  type      String   // "BUY" | "SELL"
  shares    Float
  price     Float
  solAmount Float
  
  txSignature String  @unique
  timestamp   DateTime @default(now())
}

model Watchlist {
  id        String   @id @default(uuid())
  wallet    String
  marketId  String
  market    Market   @relation(fields: [marketId], references: [id])
  createdAt DateTime @default(now())
  
  @@unique([wallet, marketId])
}
```

#### 3. **Frontend Integration** (`/src/`)

##### A. Solana Wallet Connection (`/src/lib/wallet.ts`)

**Status:** ⚠️ PARTIAL (Needs full integration)

```typescript
// ❌ TODO: Full implementation
import { useWallet } from '@solana/wallet-adapter-react';

export const useSolanaWallet = () => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  
  // ❌ TODO: Build and send transactions
  const buyShares = async (
    marketPda: string,
    side: 'YES' | 'NO',
    amount: number
  ) => {
    // 1. Fetch unsigned transaction from backend
    // 2. Sign with wallet
    // 3. Send to Solana
    // 4. Wait for confirmation
    // 5. Update UI
  };
  
  return { publicKey, buyShares };
};
```

##### B. Real-Time Price Subscription (`/src/hooks/useMarketPrices.ts`)

```typescript
// ❌ TODO
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useMarketPrices = (marketIds: string[]) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [prices, setPrices] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    const ws = io('http://localhost:3001'); // ❌ TODO: Use env var
    
    marketIds.forEach(id => {
      ws.emit('subscribe:market', id);
    });

    ws.on('price:update', (data) => {
      setPrices(prev => new Map(prev).set(data.marketId, data));
    });

    setSocket(ws);
    return () => { ws.disconnect(); };
  }, [marketIds]);

  return prices;
};
```

#### 4. **Deployment Infrastructure**

##### A. Smart Contract Deployment

```bash
# ❌ TODO: Deploy to Solana devnet
anchor build
anchor deploy --provider.cluster devnet

# ❌ TODO: Upgrade program authority to multisig
solana program set-upgrade-authority <PROGRAM_ID> <MULTISIG_ADDRESS>
```

##### B. Backend Deployment

```bash
# ❌ TODO: Deploy backend API
# Options: Railway, Fly.io, AWS EC2
docker build -t pulse-backend .
docker push ghcr.io/yourorg/pulse-backend:latest

# ❌ TODO: Environment variables needed:
# - SOLANA_RPC_URL
# - PROGRAM_ID
# - DATABASE_URL
# - REDIS_URL
# - JWT_SECRET
```

##### C. Database Setup

```bash
# ❌ TODO: Initialize PostgreSQL
npx prisma migrate deploy

# ❌ TODO: Set up indexing cron job
# - Run every 10 seconds
# - Fetch latest Solana transactions
# - Parse and insert into DB
```

#### 5. **Testing Requirements**

##### A. Smart Contract Tests (`/tests/`)

```typescript
// ❌ TODO: /tests/market-factory.test.ts
describe('Market Factory', () => {
  it('creates market with initial liquidity', async () => {
    // ❌ TODO: Test market creation
  });
  
  it('rejects market with invalid parameters', async () => {
    // ❌ TODO: Test validation
  });
});

// ❌ TODO: /tests/bonding-curve.test.ts
describe('Bonding Curve Math', () => {
  it('calculates correct buy price', async () => {
    // ❌ TODO: Test curve formula
  });
  
  it('maintains price sum ≈ $1.00', async () => {
    // ❌ TODO: Test invariant
  });
});
```

##### B. Integration Tests

```typescript
// ❌ TODO: Test full flow
describe('End-to-End Market Flow', () => {
  it('creates market → trades → resolves → redeems', async () => {
    // 1. Create market
    // 2. User A buys YES
    // 3. User B buys NO
    // 4. Resolve to YES
    // 5. User A redeems for profit
    // 6. User B gets nothing
  });
});
```

### 📋 **Implementation Checklist**

#### Phase 1: Smart Contracts (3-4 weeks)
- [ ] Set up Anchor project structure
- [ ] Implement Market Factory program
- [ ] Implement Bonding Curve math (YES/NO)
- [ ] Implement Trading program (buy/sell)
- [ ] Implement Resolution program
- [ ] Write comprehensive tests (>80% coverage)
- [ ] Security audit (recommended)
- [ ] Deploy to devnet

#### Phase 2: Backend (2-3 weeks)
- [ ] Set up Express/Axum server
- [ ] PostgreSQL schema design
- [ ] Solana RPC connection manager
- [ ] Market event listener (new markets)
- [ ] Trade event listener (buy/sell)
- [ ] Real-time price updater
- [ ] REST API endpoints
- [ ] WebSocket server for live updates
- [ ] Redis caching layer

#### Phase 3: Frontend Integration (1-2 weeks)
- [ ] Wallet adapter integration
- [ ] Transaction builder UI
- [ ] WebSocket price subscriptions
- [ ] Buy/Sell button functionality
- [ ] Portfolio page (show user positions)
- [ ] Market creation form
- [ ] Resolution interface (for resolvers)

#### Phase 4: DevOps (1 week)
- [ ] Docker containers for backend
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring (Sentry, Datadog)
- [ ] Mainnet RPC provider (Helius, QuickNode)
- [ ] Database backups
- [ ] Load testing

### 🚨 **Critical Blockers**

1. **No smart contracts deployed** → Trading impossible
2. **No backend indexer** → Can't fetch market data
3. **No WebSocket server** → No real-time prices
4. **No transaction builder** → Can't submit trades
5. **No database** → Can't store market history

### **Estimated Timeline**

- **Smart Contracts:** 4 weeks
- **Backend:** 3 weeks
- **Frontend Integration:** 2 weeks
- **Testing & Deployment:** 1 week

**Total:** ~10 weeks for MVP

### **Next Immediate Steps**

1. **Initialize Anchor project:**
   ```bash
   anchor init pulse-markets-program
   cd pulse-markets-program
   ```

2. **Set up backend:**
   ```bash
   mkdir backend && cd backend
   npm init -y
   npm install express @solana/web3.js socket.io prisma
   ```

3. **Connect to Solana devnet:**
   - Get devnet SOL from faucet
   - Deploy test program
   - Verify account creation

4. **Build first market:**
   - Create test market via CLI
   - Manually buy YES shares
   - Verify bonding curve math

---

**Questions? Start with smart contract skeleton or backend API first?**
