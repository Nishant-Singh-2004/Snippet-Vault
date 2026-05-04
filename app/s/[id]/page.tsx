import SnippetViewer from "@/components/ui/SnippetViewer"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  return <SnippetViewer id={id} />
}