import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 leading-relaxed text-foreground/90", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="font-display text-3xl font-medium" {...props} />,
          h2: (props) => (
            <h2 className="font-display mt-4 text-2xl font-medium" {...props} />
          ),
          h3: (props) => <h3 className="font-display mt-2 text-xl font-medium" {...props} />,
          p: (props) => <p className="text-balance" {...props} />,
          a: (props) => (
            <a className="text-accent underline underline-offset-4 hover:text-accent-strong" {...props} />
          ),
          ul: (props) => <ul className="list-disc space-y-1.5 pl-5" {...props} />,
          ol: (props) => <ol className="list-decimal space-y-1.5 pl-5" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-2 border-accent/50 pl-4 italic text-muted-foreground" {...props} />
          ),
          code: (props) => (
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 text-[0.85em]" {...props} />
          ),
          pre: (props) => (
            <pre className="glass overflow-x-auto rounded-[var(--radius-md)] p-4 text-sm" {...props} />
          ),
          img: (props) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="rounded-[var(--radius-md)] border border-border" alt={props.alt ?? ""} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
