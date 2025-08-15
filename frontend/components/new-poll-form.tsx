"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Loader2, PlusCircle } from "lucide-react"
import { usePoll } from "@/contexts/poll-context"
import { useToast } from "@/hooks/use-toast"

interface NewPollFormProps {
  onSuccess?: () => void
}

export function NewPollForm({ onSuccess }: NewPollFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { createPoll, isLoading } = usePoll()
  const { toast } = useToast()

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Poll title is required"
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    } else if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    if (description.length > 200) {
      newErrors.description = "Description must be less than 200 characters"
    }

    const validOptions = options.filter((opt) => opt.trim())
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required"
    }

    options.forEach((option, index) => {
      if (option.trim() && option.length > 50) {
        newErrors[`option-${index}`] = "Option must be less than 50 characters"
      }
    })

    // Check for duplicate options
    const trimmedOptions = options.map((opt) => opt.trim().toLowerCase()).filter(Boolean)
    const uniqueOptions = new Set(trimmedOptions)
    if (trimmedOptions.length !== uniqueOptions.size) {
      newErrors.options = "Options must be unique"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const validOptions = options.filter((opt) => opt.trim())
    createPoll(title.trim(), description.trim(), validOptions)

    toast({
      title: "Poll created!",
      description: "Your poll is now live and ready for votes.",
    })

    // Reset form
    setTitle("")
    setDescription("")
    setOptions(["", ""])
    setErrors({})

    onSuccess?.()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Create New Poll
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poll Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              placeholder="What's your question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Poll Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more context to your poll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`resize-none ${errors.description ? "border-destructive" : ""}`}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            <p className="text-xs text-muted-foreground">{description.length}/200 characters</p>
          </div>

          {/* Poll Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Poll Options *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={options.length >= 6}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className={errors[`option-${index}`] ? "border-destructive" : ""}
                    />
                    {errors[`option-${index}`] && (
                      <p className="text-sm text-destructive mt-1">{errors[`option-${index}`]}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                    className="h-10 w-10 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {errors.options && <p className="text-sm text-destructive">{errors.options}</p>}
            <p className="text-xs text-muted-foreground">
              Add 2-6 options for your poll. Each option can be up to 50 characters.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Poll...
                </>
              ) : (
                "Create Poll"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
