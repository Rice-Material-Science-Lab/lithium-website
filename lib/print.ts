/**
 * Prints (or saves as PDF) a single element instead of the whole page.
 *
 * The page switches to light mode, then the element is copied into a
 * print-only container (#print-root) and everything else is hidden by the
 * @media print rules in app/globals.css. Copying sidesteps fixed dialogs,
 * scroll areas and animations that would otherwise break the printed layout.
 * Canvas drawings are copied pixel for pixel. The document title becomes the
 * default PDF file name.
 */
export function printSection(el: HTMLElement, title: string) {
  const root = document.documentElement
  const wasDark = root.classList.contains("dark")
  const previousTitle = document.title
  const previousScheme = root.style.colorScheme
  let printRoot: HTMLDivElement | null = null
  let cleaned = false

  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    printRoot?.remove()
    document.body.classList.remove("printing-section")
    if (wasDark) root.classList.add("dark")
    root.style.colorScheme = previousScheme
    document.title = previousTitle
    window.removeEventListener("afterprint", cleanup)
  }

  if (wasDark) root.classList.remove("dark")

  root.style.colorScheme = "light"
  document.title = title

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      printRoot = document.createElement("div")
      printRoot.id = "print-root"

      const copy = el.cloneNode(true) as HTMLElement
      copy.removeAttribute("id")
      const sourceCanvases = el.querySelectorAll("canvas")
      copy.querySelectorAll("canvas").forEach((c, i) => {
        const src = sourceCanvases[i]
        if (!src) return
        c.width = src.width
        c.height = src.height
        c.getContext("2d")?.drawImage(src, 0, 0)
      })

      printRoot.appendChild(copy)
      document.body.appendChild(printRoot)
      document.body.classList.add("printing-section")
      window.addEventListener("afterprint", cleanup)

      window.print()
      // Some browsers never fire afterprint; print() blocks until the dialog closes.
      setTimeout(cleanup, 500)
    })
  )
}