import { NextResponse } from "next/server"

export async function GET() {
  const query = encodeURIComponent(
    "lithium battery fire OR battery explosion OR battery recall OR dendrite battery"
  )
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const xml = await res.text()

    const items: { title: string; link: string; pubDate: string; source: string }[] = []
    const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)

    for (const match of matches) {
      const block = match[1]

      const rawTitle = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
        ?? block.match(/<title>([\s\S]*?)<\/title>/)?.[1]
        ?? ""

      // Google News puts "Title - Source" in the title field
      const dashIndex = rawTitle.lastIndexOf(" - ")
      const title = dashIndex !== -1 ? rawTitle.slice(0, dashIndex).trim() : rawTitle.trim()
      const source = dashIndex !== -1 ? rawTitle.slice(dashIndex + 3).trim() : ""

      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? ""
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? ""

      if (title && link) {
        items.push({ title, link, pubDate, source })
      }

      if (items.length >= 10) break
    }

    return NextResponse.json(items)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}