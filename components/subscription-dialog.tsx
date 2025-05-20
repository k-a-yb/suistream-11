"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/contexts/wallet-context"
import { purchaseSubscription } from "@/lib/sui-wallet"
import { Loader2 } from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: string
  duration: number
  features: string[]
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    description: "Perfect for casual viewers",
    price: "10",
    duration: 30,
    features: ["Access to all content", "HD streaming", "Watch on any device"],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    description: "Great value for regular viewers",
    price: "25",
    duration: 90,
    features: ["Access to all content", "HD streaming", "Watch on any device", "10% discount"],
  },
  {
    id: "yearly",
    name: "Yearly",
    description: "Best value for enthusiasts",
    price: "80",
    duration: 365,
    features: [
      "Access to all content",
      "4K streaming",
      "Watch on any device",
      "25% discount",
      "Early access to new releases",
    ],
  },
]

export function SubscriptionDialog() {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { walletState } = useWallet()

  const handleSubscribe = async () => {
    if (!walletState.connected) return

    const plan = subscriptionPlans.find((p) => p.id === selectedPlan)
    if (!plan) return

    setIsProcessing(true)
    try {
      const success = await purchaseSubscription(plan.duration, plan.price)
      if (success) {
        setDialogOpen(false)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Subscribe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose a Subscription Plan</DialogTitle>
          <DialogDescription>Select a subscription plan to access all content on SuiStream.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`flex items-start space-x-3 border rounded-lg p-4 ${selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={plan.id} className="text-base font-medium flex justify-between">
                    <span>{plan.name}</span>
                    <span className="text-primary">{plan.price} SUI</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  <ul className="mt-2 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button onClick={handleSubscribe} disabled={isProcessing || !walletState.connected} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe for ${subscriptionPlans.find((p) => p.id === selectedPlan)?.price} SUI`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
