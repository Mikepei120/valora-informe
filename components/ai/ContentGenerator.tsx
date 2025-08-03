'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Bot, Loader2, Edit3, RefreshCw, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface ContentGeneratorProps {
  title: string
  description: string
  endpoint: string
  propertyData: any
  valuation?: number
  initialContent?: string
  onContentSave: (content: string) => void
}

export default function ContentGenerator({
  title,
  description,
  endpoint,
  propertyData,
  valuation,
  initialContent = '',
  onContentSave
}: ContentGeneratorProps) {
  const [content, setContent] = useState(initialContent)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const generateContent = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyData, valuation }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      const newContent = data.description || data.analysis || data.summary
      
      setContent(newContent)
      setEditContent(newContent)
      onContentSave(newContent)
      toast.success('Content generated successfully!')
    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveEdit = () => {
    setContent(editContent)
    onContentSave(editContent)
    setIsEditing(false)
    toast.success('Content updated successfully!')
  }

  const handleCancelEdit = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            {content && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button
              size="sm"
              onClick={generateContent}
              disabled={isGenerating}
              variant={content ? "outline" : "default"}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  {content ? (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  ) : (
                    <Bot className="w-4 h-4 mr-2" />
                  )}
                  {content ? 'Regenerate' : 'Generate'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {content ? (
          isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={8}
                className="min-h-32"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {content}
                </p>
              </div>
              <Badge variant="secondary" className="w-fit">
                AI Generated
              </Badge>
            </div>
          )
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Click "Generate" to create AI-powered content for this section.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}