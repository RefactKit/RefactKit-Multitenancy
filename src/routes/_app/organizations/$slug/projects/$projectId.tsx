import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProjectById,
  createCategory,
  bulkLabelFiles,
  linkProjectFile,
} from '@/server/project-fns'
import { uploadFile } from '@/server/storage-fns'
import { CategoryManager } from '@/components/projects/category-manager'
import { LabelingGallery } from '@/components/projects/labeling-gallery'
import { useI18n } from '@/i18n/context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useState } from 'react'
import { toast } from 'sonner'
import { orgBySlugQuery } from '@/server/query-keys'

export const Route = createFileRoute('/_app/organizations/$slug/projects/$projectId')({
  component: ProjectStudioPage,
})

function ProjectStudioPage() {
  const { slug, projectId } = useParams({ from: '/_app/organizations/$slug/projects/$projectId' })
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById({ data: projectId }),
  })

  const { data: org } = useQuery(orgBySlugQuery(slug))

  const handleUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      if (!files) return

      toast.promise(
        async () => {
          for (const file of Array.from(files)) {
            const formData = new FormData()
            formData.append('file', file)
            const catName =
              project?.categories.find((c) => c.id === selectedCategoryId)?.name || 'unlabeled'
            formData.append('path', `data-${project?.slug}/${catName}`)

            const result = await uploadFile({ data: formData })

            if (result.url) {
              await linkProjectFile({
                data: {
                  projectId,
                  categoryId: selectedCategoryId,
                  name: file.name,
                  path: `data-${project?.slug}/${catName}/${file.name}`,
                  url: result.url,
                  mimeType: file.type,
                  size: file.size,
                  uploadedBy: project.userId,
                },
              })
            }
          }
          queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        },
        {
          loading: 'Uploading images...',
          success: 'Images uploaded successfully',
          error: 'Failed to upload some images',
        },
      )
    }
    input.click()
  }

  if (isLoading || !project)
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {project.title}
        </h1>
        <p className="text-muted-foreground">{t.projects.subtitle}</p>
      </div>

      <div className="flex h-[calc(100vh-280px)] overflow-hidden rounded-3xl border border-border/40 shadow-2xl bg-muted/10">
        <CategoryManager
          categories={project.categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onCreateCategory={(name) => {
            createCategory({ data: { projectId, name } }).then(() => {
              queryClient.invalidateQueries({ queryKey: ['project', projectId] })
              toast.success('Category added')
            })
          }}
          onDeleteCategory={(id) => {
            // Delete logic
          }}
        />

        <LabelingGallery
          files={project.files}
          selectedCategoryId={selectedCategoryId}
          onBulkLabel={(ids) => {
            bulkLabelFiles({ data: { fileIds: ids, categoryId: selectedCategoryId } }).then(() => {
              queryClient.invalidateQueries({ queryKey: ['project', projectId] })
              toast.success('Files labeled')
            })
          }}
          onDeleteFiles={(ids) => {
            // Delete logic
          }}
          onUploadClick={handleUpload}
        />
      </div>
    </div>
  )
}
