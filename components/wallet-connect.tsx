"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { Wallet, LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WalletConnectProps {
  showDisconnect?: boolean
}

export default function WalletConnect({ showDisconnect = true }: WalletConnectProps) {
  const { walletState, connectWallet, disconnectWallet } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState("Sui Wallet")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Handle wallet connection
  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const success = await connectWallet(selectedWallet)
      if (success) {
        setDialogOpen(false)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnectWallet()
  }

  // If wallet is connected, show address and disconnect button
  if (walletState.connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
          <Wallet className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {walletState.address?.substring(0, 6)}...{walletState.address?.substring(walletState.address.length - 4)}
          </span>
          <span className="sm:hidden">{walletState.address?.substring(0, 4)}...</span>
        </div>

        {showDisconnect && (
          <Button variant="ghost" size="sm" onClick={handleDisconnect} className="h-8">
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Disconnect</span>
          </Button>
        )}
      </div>
    )
  }

  // If wallet is not connected, show connect button
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Connect your Sui wallet to access exclusive content on SuiStream.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="wallet-select" className="text-sm font-medium">
                Select Wallet
              </label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger id="wallet-select">
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sui Wallet">Sui Wallet</SelectItem>
                  <SelectItem value="Ethos">Ethos Wallet</SelectItem>
                  <SelectItem value="Suiet">Suiet Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
