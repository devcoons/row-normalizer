export type KeyRule<K extends string, V> = {
    readonly key: K
    readonly to: (value: unknown) => V
}

export type ApplyKeyRules<T, R extends readonly KeyRule<string, unknown>[]> =
Omit<T, Extract<R[number]['key'], keyof T>> & {
    [P in Extract<R[number]['key'], keyof T>]:
    Extract<R[number], { key: P }> extends KeyRule<P, infer V> ? V : never
}

export const keyRule = <K extends string, V>(
    key: K,
    to: (v: unknown) => V
): KeyRule<K, V> => ({ key, to })

export function normalizeRowWithKeys<T extends Record<string, unknown>, R extends readonly KeyRule<string, unknown>[]>
(row: T, rules: R): ApplyKeyRules<T, R> {
    const out: Record<string, unknown> = { ...row }
    for (const r of rules) {
        if (r.key in out) out[r.key] = r.to(out[r.key])
    }
    return out as ApplyKeyRules<T, R>
}

export function normalizeRowsWithKeys<T extends Record<string, unknown>, R extends readonly KeyRule<string, unknown>[]>
(rows: T[], rules: R): ApplyKeyRules<T, R>[] {
    return rows.map((row) => normalizeRowWithKeys(row, rules))
}