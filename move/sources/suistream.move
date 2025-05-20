module suistream::content_access {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};

    // Error codes
    const EInsufficientFunds: u64 = 0;
    const ESubscriptionNotExpired: u64 = 1;
    const ESubscriptionExpired: u64 = 2;
    const EContentNotOwned: u64 = 3;

    // Events
    struct ContentPurchased has copy, drop {
        buyer: address,
        content_id: String,
        price: u64,
    }

    struct SubscriptionPurchased has copy, drop {
        buyer: address,
        duration_days: u64,
        price: u64,
        expires_at: u64,
    }

    // Content NFT representing ownership of a specific content
    struct ContentNFT has key, store {
        id: UID,
        content_id: String,
        owner: address,
        purchase_time: u64,
    }

    // Subscription representing access to all content for a period
    struct Subscription has key, store {
        id: UID,
        owner: address,
        start_time: u64,
        end_time: u64,
    }

    // Treasury to collect payments
    struct Treasury has key {
        id: UID,
        balance: u64,
    }

    // Initialize the module
    fun init(ctx: &mut TxContext) {
        let treasury = Treasury {
            id: object::new(ctx),
            balance: 0,
        };
        transfer::share_object(treasury);
    }

    // Purchase content and receive an NFT
    public entry fun purchase_content(
        treasury: &mut Treasury,
        content_id: vector<u8>,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let content_id_str = string::utf8(content_id);
        let payment_amount = coin::value(&payment);
        
        // Add payment to treasury
        let coin_balance = coin::into_balance(payment);
        treasury.balance = treasury.balance + coin::value_of(&coin_balance);
        
        // Create content NFT
        let content_nft = ContentNFT {
            id: object::new(ctx),
            content_id: content_id_str,
            owner: tx_context::sender(ctx),
            purchase_time: clock::timestamp_ms(clock),
        };
        
        // Transfer NFT to buyer
        transfer::transfer(content_nft, tx_context::sender(ctx));
        
        // Emit event
        event::emit(ContentPurchased {
            buyer: tx_context::sender(ctx),
            content_id: content_id_str,
            price: payment_amount,
        });
    }

    // Purchase a subscription
    public entry fun purchase_subscription(
        treasury: &mut Treasury,
        payment: Coin<SUI>,
        duration_days: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let payment_amount = coin::value(&payment);
        
        // Add payment to treasury
        let coin_balance = coin::into_balance(payment);
        treasury.balance = treasury.balance + coin::value_of(&coin_balance);
        
        // Calculate end time (current time + duration in milliseconds)
        let start_time = clock::timestamp_ms(clock);
        let end_time = start_time + (duration_days * 24 * 60 * 60 * 1000);
        
        // Create subscription
        let subscription = Subscription {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            start_time,
            end_time,
        };
        
        // Transfer subscription to buyer
        transfer::transfer(subscription, tx_context::sender(ctx));
        
        // Emit event
        event::emit(SubscriptionPurchased {
            buyer: tx_context::sender(ctx),
            duration_days,
            price: payment_amount,
            expires_at: end_time,
        });
    }

    // Check if user owns content
    public fun is_content_owned(
        content_id: String,
        owner: address,
        ctx: &TxContext
    ): bool {
        // In a real implementation, this would query the blockchain
        // For simplicity, we'll return true if the sender is the owner
        tx_context::sender(ctx) == owner
    }

    // Check if user has an active subscription
    public fun has_active_subscription(
        subscription: &Subscription,
        clock: &Clock
    ): bool {
        clock::timestamp_ms(clock) <= subscription.end_time
    }
}
