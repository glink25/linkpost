export const pick = <T extends object, Keys extends (keyof T)[] = []>(target: T, keys: Keys): Pick<T, Keys[number]> => {
    return Object.fromEntries(Object.entries(target).filter(([key]) => keys.includes(key as any))) as any
}