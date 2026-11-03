// 1. Add a way for interested customers to subscribe/unsubscribe
// 2. What should the parameter type to those methods be?
// 3. When do updates get sent out?
class FishMarket  {
  private _inventory = new Set<string>();
  private _on_sale: string | null = null;

  stock_fish(fish: string) {
    this._inventory.add(fish);
  }
  start_sale(fish: string) {
    this._on_sale = fish;
  }
}

// Back to slides

// Add a few concrete classes that can subscribe to the FishMarket

// Turn this class into a singleton
class WaluigiTime {
  private speed: number = 0;
  private num_waas: number = 0;

  waa() {
    console.log("waa", this.num_waas);
    this.num_waas += 1;
  }

}

// WaluigiTime.getInstance().waa();
// WaluigiTime.getInstance().waa();
// WaluigiTime.getInstance().waa();
