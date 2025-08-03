'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Star, StarIcon } from 'lucide-react'
import { toast } from 'sonner'

interface PropertyImage {
  id?: string
  url: string
  is_primary: boolean
  file?: File
}

interface PropertyImageUploadProps {
  images: PropertyImage[]
  onImagesChange: (images: PropertyImage[]) => void
  maxImages?: number
}

export default function PropertyImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: PropertyImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: PropertyImage[] = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      is_primary: images.length === 0 && !images.some(img => img.is_primary),
      file
    }))

    if (images.length + newImages.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    onImagesChange([...images, ...newImages])
  }, [images, maxImages, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    
    // If we removed the primary image, make the first remaining image primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true
    }
    
    onImagesChange(newImages)
  }

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }))
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-sm text-gray-500">
                  JPEG, PNG, WebP up to 5MB each (max {maxImages} images)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Primary Badge */}
                {image.is_primary && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    Primary
                  </Badge>
                )}

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {!image.is_primary && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPrimaryImage(index)
                      }}
                    >
                      <StarIcon className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(index)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-gray-500">
          {images.length} of {maxImages} images uploaded. 
          Click the star icon to set as primary image.
        </p>
      )}
    </div>
  )
}