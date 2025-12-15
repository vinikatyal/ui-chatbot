import React, { Suspense } from "react";

const MarkdownAsync = React.lazy(() => import("react-markdown"));

export default function MarkDownRenderer({ markDownString }: { markDownString: string }) {
  return (
    <Suspense fallback={<span className="text-sm opacity-70">Rendering…</span>}>
      <MarkdownAsync>{markDownString}</MarkdownAsync>
    </Suspense>
  )
}
