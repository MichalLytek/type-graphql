export default async function sleep(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
