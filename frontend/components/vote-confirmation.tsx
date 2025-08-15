"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoteConfirmationProps {
  pollTitle: string
  optionText: string
  onClose: () => void
}

export function VoteConfirmation({ pollTitle, optionText, onClose }: VoteConfirmationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card
        className={`max-w-md mx-4 transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Vote Recorded!</h3>
          <p className="text-sm text-muted-foreground mb-1">You voted for:</p>
          <p className="font-medium text-primary mb-2">"{optionText}"</p>
          <p className="text-xs text-muted-foreground mb-4">in "{pollTitle}"</p>

          <Button variant="outline" size="sm" onClick={() => setIsVisible(false)}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
