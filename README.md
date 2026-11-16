# Finora

Finora is a portfolio workspace for an Indian advisory book. It lists clients, portfolios, holdings, and transactions in INR, values the book, and compares it with simulated index levels.

The sample book is TypeScript in `src/mocks`. Nothing is fetched. Prices, NAVs, and index levels are simulated and marked to 31 October 2026. They are not live or historical market data.

## Screens

| Route | What it shows |
| --- | --- |
| `/` | Assets under advice, return versus contributions, recent transactions, allocation, and clients outside their equity band |
| `/clients` | Client directory. A client added here is kept for this browser tab and is not part of the valued book. |
| `/clients/[id]` | One client's portfolios, allocation, and return |
| `/portfolios` | Every portfolio, with value and return |
| `/portfolios/[id]` | Holdings, cash, allocation, and the value history |
| `/transactions` | Deposits, withdrawals, trades, dividends, and interest |
| `/analytics` | AUM, XIRR, annualized return, client comparison, and a benchmark |
| `/settings` | Advisor profile, theme, default chart range, and the benchmark used on Analytics |
| `/design-system` | The components the product screens are built from |

## How the numbers are built

Valuation lives in `src/lib/calculations`.

A portfolio's current value is the market value of its holdings plus cash. Cash moves with completed deposits, withdrawals, buys, sells, dividends, and interest. Buys and sells stay inside the book. Only deposits and withdrawals change money contributed.

Return versus contributions is current value minus net deposits and withdrawals. XIRR is the money-weighted rate from those same flows through the mark date. The annualized figure compounds from the first contribution to that date, without weighting the timing of later cash.

The dashboard flags a client when equity, including cash, sits outside the band for their risk profile: conservative 0–40%, moderate 30–70%, aggressive 60–100%. A book that is down versus contributions is flagged too.

## What persists

Edit `src/mocks` to change the sample clients, holdings, and transactions. Two browser stores sit on top of that:

- `sessionStorage` key `finora.added-clients` holds clients created from the Clients screen. They disappear when the tab closes, and they have no portfolios.
- `localStorage` key `finora.settings` holds the advisor profile, theme preferences, chart range, and default benchmark.

Settings can clear the added clients and reset the workspace preferences.

## Run it

Node.js 20.9 or newer, and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
npm start
```

## Layout

```
src/app                 routes
src/features            screens and the queries that assemble them
src/components          shared UI, charts, and money formatting
src/lib/calculations    valuation, allocation, returns, XIRR
src/mocks               the simulated book
src/constants/market.ts mark date, currency, and the simulated-data notice
```

Imports use the `@/` alias, which points at `src/`.

## Stack

Next.js 16, React 19, TypeScript, and Tailwind CSS 4. UI primitives come from shadcn and Base UI. Charts use Recharts.
