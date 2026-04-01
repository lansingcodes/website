function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function boldMarkdownToHtml(markdown: string): string {
  // Escape HTML first to prevent XSS from external data
  const escaped = escapeHtml(markdown)
  // Convert **text** to bold spans using a single regex
  return escaped.replace(
    /\*\*(.*?)\*\*/g,
    '<span class="font-bold">$1</span>',
  )
}
