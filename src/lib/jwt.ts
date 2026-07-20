export function decodeToken(token: string): { id: string; rol?: string } | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}
