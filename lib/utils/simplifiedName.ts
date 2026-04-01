// Removes non-alphanumeric characters and makes it lowercase
export function simplifiedName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}
