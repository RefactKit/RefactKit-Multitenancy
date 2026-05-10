import { useState, useMemo } from 'react'
import { Check, Image as ImageIcon, Upload, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/i18n/context'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProjectFile {
  id: string
  name: string
  url: string
  categoryId: string | null
  size: number
  mimeType: string
}

interface LabelingGalleryProps {
  files: ProjectFile[]
  selectedCategoryId: string | null
  onBulkLabel: (fileIds: string[]) => void
  onDeleteFiles: (fileIds: string[]) => void
  onUploadClick: () => void
}

export function LabelingGallery({
  files,
  selectedCategoryId,
  onBulkLabel,
  onDeleteFiles,
  onUploadClick,
}: LabelingGalleryProps) {
  const { t } = useI18n()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredFiles = useMemo(() => {
    return files.filter((f) => f.categoryId === selectedCategoryId)
  }, [files, selectedCategoryId])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const selectAll = () => {
    if (selectedIds.length === filteredFiles.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredFiles.map((f) => f.id))
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background/30 backdrop-blur-sm">
      {/* Gallery Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-card/30 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="rounded-xl h-10 px-4" onClick={selectAll}>
            <CheckCircle2
              className={cn(
                'size-4 mr-2',
                selectedIds.length === filteredFiles.length && 'text-primary',
              )}
            />
            {selectedIds.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
          </Button>
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <Badge variant="default" className="rounded-lg px-2 h-7 font-semibold">
                  {selectedIds.length} selected
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 rounded-lg"
                  onClick={() => onBulkLabel(selectedIds)}
                >
                  Apply Class
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-lg text-destructive hover:bg-destructive/10"
                  onClick={() => onDeleteFiles(selectedIds)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={onUploadClick}
          className="rounded-xl gap-2 h-10 px-5 shadow-lg shadow-primary/10"
        >
          <Upload className="size-4" />
          Upload Images
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {filteredFiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                className="relative aspect-square group cursor-pointer"
                onClick={() => toggleSelect(file.id)}
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl border-2 transition-all overflow-hidden bg-muted/20 shadow-sm',
                    selectedIds.includes(file.id)
                      ? 'border-primary shadow-lg shadow-primary/20 scale-95'
                      : 'border-transparent group-hover:border-border/80 group-hover:scale-98',
                  )}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center',
                      selectedIds.includes(file.id)
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100',
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-full p-2 transition-transform',
                        selectedIds.includes(file.id)
                          ? 'bg-primary scale-110'
                          : 'bg-white/20 scale-90',
                      )}
                    >
                      <Check
                        className={cn(
                          'size-5',
                          selectedIds.includes(file.id) ? 'text-white' : 'text-transparent',
                        )}
                      />
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-white/80 truncate font-medium">{file.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed border-border/50 bg-muted/5">
            <div className="rounded-full bg-muted p-8 mb-6">
              <ImageIcon className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{t.projects.studio.noFiles}</h3>
            <p className="text-muted-foreground">
              Select a class on the left or upload new images.
            </p>
            <Button
              onClick={onUploadClick}
              variant="outline"
              className="mt-8 rounded-xl h-11 px-8 font-semibold"
            >
              Start Uploading
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
