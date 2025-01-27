export function omit<T, K extends keyof T>(obj: T, props: K[]): Omit<T, K> {
  return Object.keys(obj).filter(v => !props.includes(v as K)).reduce((acc, k) => {
    acc[k] = obj[k];
    return acc
  }, {} as Omit<T, K>)
}
