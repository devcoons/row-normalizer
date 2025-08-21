# @devcoons/row-normalizer

Type-safe normalizer for data. Convert specific keys (e.g. `user_id`, `id`, `date`) using rules.

## Install
npm i @devcoons/row-normalizer

## Usage
```ts
import { keyRule, normalizeRowsWithKeys } from '@devcoons/row-normalizer'

function bufToUuid .... /* your impl */

const rules = [
  keyRule('user_id', (v) => bufToUuid(v as any)),
  keyRule('id', (v) => bufToUuid(v as any)),
  keyRule('date', (v) => new Date(v as any).toISOString())
] as const

const rows = await db.query<{
  user_id?: Buffer | Uint8Array | string | null,
  date?: Date | string | null,
  first_name: string | null
}>(/*...*/)

const normalized = normalizeRowsWithKeys(rows, rules)
// user_id/date are now typed as string