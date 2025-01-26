module 0x0::pepe{
    use sui::coin;

    public struct PEPE has drop{
    }

    fun init(witness: PEPE, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(witness, 9, b"SAL", b"SalutCrestin", b"Merge?", option::none(), ctx);
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    public entry fun mint(treasury: &mut coin::TreasuryCap<PEPE>, amount: u64, recipient: address, ctx: &mut TxContext) {
        coin::mint_and_transfer(treasury, amount, recipient, ctx)
    }

    public entry fun burn<T>(cap: &mut coin::TreasuryCap<T>, c: coin::Coin<T>): u64 {
        let balance = coin::value(&c);
        coin::destroy_zero(c);
        coin::burn(cap, balance)
    }

}
