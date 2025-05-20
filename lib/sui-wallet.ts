import { toast } from "@/hooks/use-toast"
import type { WalletState } from "@/types/wallet"

// Initial wallet state
const initialWalletState: WalletState = {
  connected: false,
  address: null,
  ownedContentIds: [],
}

// For demo purposes - in production this would use localStorage or similar
let walletState = { ...initialWalletState }

// Listeners for wallet state changes
const listeners: (() => void)[] = []

export const subscribeToWallet = (callback: () => void) => {
  listeners.push(callback)
  return () => {
    const index = listeners.indexOf(callback)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

const notifyListeners = () => {
  listeners.forEach((listener) => listener())
}

// Connect wallet (simulated)
export const connectWallet = async (walletType = "Sui Wallet"): Promise<boolean> => {
  try {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate random wallet address for demo
    const address = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

    // Update wallet state
    walletState = {
      connected: true,
      address,
      // For demo, let's say the user already owns some random content
      ownedContentIds: [
        "movie:550", // Fight Club
        "movie:238", // The Godfather
        "tv:1396", // Breaking Bad
      ],
    }

    notifyListeners()

    toast({
      title: "Wallet Connected",
      description: `${walletType} connected successfully`,
    })

    return true
  } catch (error) {
    console.error("Error connecting wallet:", error)
    toast({
      title: "Connection Failed",
      description: "Could not connect to wallet",
      variant: "destructive",
    })
    return false
  }
}

// Disconnect wallet
export const disconnectWallet = () => {
  walletState = { ...initialWalletState }
  notifyListeners()

  toast({
    title: "Wallet Disconnected",
    description: "Your wallet has been disconnected",
  })
}

// Purchase content (simulated)
export const purchaseContent = async (contentId: string, price: string): Promise<boolean> => {
  if (!walletState.connected) {
    toast({
      title: "Wallet Not Connected",
      description: "Please connect your wallet first",
      variant: "destructive",
    })
    return false
  }

  try {
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add to owned content
    if (!walletState.ownedContentIds.includes(contentId)) {
      walletState.ownedContentIds.push(contentId)
      notifyListeners()
    }

    toast({
      title: "Purchase Successful",
      description: `You've purchased this content for ${price} SUI`,
    })

    return true
  } catch (error) {
    console.error("Error purchasing content:", error)
    toast({
      title: "Purchase Failed",
      description: "Transaction could not be completed",
      variant: "destructive",
    })
    return false
  }
}

// Purchase subscription (simulated)
export const purchaseSubscription = async (durationDays: number, price: string): Promise<boolean> => {
  if (!walletState.connected) {
    toast({
      title: "Wallet Not Connected",
      description: "Please connect your wallet first",
      variant: "destructive",
    })
    return false
  }

  try {
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Subscription Purchased",
      description: `You've subscribed for ${durationDays} days for ${price} SUI`,
    })

    return true
  } catch (error) {
    console.error("Error purchasing subscription:", error)
    toast({
      title: "Purchase Failed",
      description: "Transaction could not be completed",
      variant: "destructive",
    })
    return false
  }
}

// Get current wallet state
export const getWalletState = (): WalletState => {
  return { ...walletState }
}

// Check if content is owned
export const isContentOwned = (contentId: string): boolean => {
  return walletState.ownedContentIds.includes(contentId)
}

// Get wallet address
export const getWalletAddress = async (): Promise<string> => {
  return walletState.address || ""
}

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  return walletState.connected
}

// Simulate executing a transaction
export const executeTransaction = async (transactionData: any): Promise<string> => {
  if (!walletState.connected) {
    throw new Error("Wallet not connected")
  }

  // Simulate transaction processing
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate a random transaction hash
  const txHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  return txHash
}

// Simulate getting wallet balance
export const getWalletBalance = async (): Promise<string> => {
  if (!walletState.connected) {
    throw new Error("Wallet not connected")
  }

  // Generate a random balance
  const balance = (Math.random() * 100).toFixed(2)
  return balance
}
