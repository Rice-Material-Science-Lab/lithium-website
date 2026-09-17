import React, {
  memo,
  useEffect,
  useMemo,
  ComponentPropsWithoutRef,
} from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { remarkExtendedTable } from "remark-extended-table";

const markdownComponents: Components = {
  table: ({ children }) => (
    <table className="w-full my-4 border border-collapse border-border dark:border-white">
      {children}
    </table>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted text-foreground dark:bg-[#2c3b5a] dark:text-white">
      {children}
    </thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border border-border even:bg-muted/50 dark:border-white dark:even:bg-[#2c3b5a]">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4! py-2! font-semibold text-left border border-border dark:border-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4! py-2! border border-border dark:border-white">
      {children}
    </td>
  ),
  h1: ({ children }) => (
    <>
      <h1 className="mt-6! mb-2! text-4xl font-bold">{children}</h1>
      <hr className="mb-4! border-border dark:border-white" />
    </>
  ),
  h2: ({ children }) => (
    <>
      <h2 className="mt-5! mb-2! text-3xl font-bold">{children}</h2>
      <hr className="mb-4! border-border dark:border-white" />
    </>
  ),
  h3: ({ children }) => (
    <>
      <h3 className="mt-4! mb-2! text-2xl font-bold">{children}</h3>
      <hr className="mb-4! border-border dark:border-white" />
    </>
  ),
  h4: ({ children }) => (
    <>
      <h4 className="mt-3! mb-2! text-xl font-bold">{children}</h4>
      <hr className="mb-3! border-border dark:border-white" />
    </>
  ),
  h5: ({ children }) => (
    <h5 className="mt-2! mb-2! text-lg font-bold">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="mt-1! mb-2! text-base font-bold">{children}</h6>
  ),
  p: ({ children }) => <p>{children}</p>,
  code: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<"code">) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !className;

    return !isInline && match ? (
      <pre className="my-2! overflow-hidden rounded-lg bg-muted/60 dark:bg-transparent">
        <code className={`${className} rounded-3xl`} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code
        className="px-2! py-0! rounded-lg bg-muted text-foreground dark:bg-[#474747] dark:text-white"
        {...props}
      >
        {children}
      </code>
    );
  },
  a: ({ children, href }) => (
    <a href={href} className="inline text-primary dark:text-blue-400 underline text-md">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc pl-6!">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6!">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
};

const markdownPlugins = [remarkGfm, remarkExtendedTable];
const markdownRehypePlugins = [rehypeHighlight];

export const MemoizedMarkdown = memo(function MemoizedMarkdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "highlight-js-theme";

    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      link.href = isDark
        ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/tomorrow-night-blue.min.css"
        : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css";
    };

    updateTheme();
    document.head.appendChild(link);

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      document.head.removeChild(link);
    };
  }, []);

  const renderedMarkdown = useMemo(
    () => (
      <ReactMarkdown
        rehypePlugins={markdownRehypePlugins}
        remarkPlugins={markdownPlugins}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    ),
    [content]
  );

  return (
    <div className={`px-5! ${className ?? ""}`}>{renderedMarkdown}</div>
  );
});