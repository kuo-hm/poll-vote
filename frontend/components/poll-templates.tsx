"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Users, Calendar, Coffee } from "lucide-react"
import { usePoll } from "@/contexts/poll-context"
import { useToast } from "@/hooks/use-toast"

interface PollTemplate {
  id: string
  title: string
  description: string
  options: string[]
  icon: React.ComponentType<{ className?: string }>
  category: string
}

const pollTemplates: PollTemplate[] = [
  {
    id: "meeting-time",
    title: "Best Meeting Time",
    description: "Find the optimal time for team meetings",
    options: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    icon: Calendar,
    category: "Work",
  },
  {
    id: "team-lunch",
    title: "Team Lunch Preference",
    description: "Where should we go for our team lunch?",
    options: ["Italian Restaurant", "Sushi Place", "Burger Joint", "Healthy Cafe"],
    icon: Coffee,
    category: "Social",
  },
  {
    id: "project-priority",
    title: "Next Project Priority",
    description: "Which project should we focus on next?",
    options: ["Mobile App", "Website Redesign", "API Integration", "Performance Optimization"],
    icon: Lightbulb,
    category: "Work",
  },
  {
    id: "team-activity",
    title: "Team Building Activity",
    description: "What activity would you prefer for team building?",
    options: ["Escape Room", "Bowling", "Mini Golf", "Cooking Class"],
    icon: Users,
    category: "Social",
  },
]

export function PollTemplates() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { createPoll } = usePoll()
  const { toast } = useToast()

  const categories = Array.from(new Set(pollTemplates.map((template) => template.category)))
  const filteredTemplates = selectedCategory
    ? pollTemplates.filter((template) => template.category === selectedCategory)
    : pollTemplates

  const handleUseTemplate = (template: PollTemplate) => {
    createPoll(template.title, template.description, template.options)
    toast({
      title: "Poll created from template!",
      description: `"${template.title}" is now live and ready for votes.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quick Start Templates</h3>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = template.icon
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {template.options.map((option, index) => (
                    <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                      {option}
                    </div>
                  ))}
                </div>
                <Button size="sm" onClick={() => handleUseTemplate(template)} className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
