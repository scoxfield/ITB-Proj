module 0x0::pepe {
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::TxContext;

    public struct PEPE has drop {}

    fun init(witness: PEPE, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(witness, 9, b"SAL", b"SalutCrestin", b"Merge?", option::none(), ctx);
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun mint(treasury: &mut coin::TreasuryCap<PEPE>, amount: u64, recipient: address, ctx: &mut TxContext) {
        coin::mint_and_transfer(treasury, amount, recipient, ctx)
    }

    public entry fun burn(treasury: &mut coin::TreasuryCap<PEPE>, mut coin: coin::Coin<PEPE>, amount: u64, ctx: &mut TxContext) {
	    let burn_coin = coin::split(&mut coin, amount, ctx);
	    coin::burn(treasury, burn_coin);
	    // Transfer the remaining balance back to the user
	    transfer::public_transfer(coin, tx_context::sender(ctx));
	}
}

