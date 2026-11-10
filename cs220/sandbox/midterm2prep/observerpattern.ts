/**
 * CS220 — Observer Pattern
 *
 * Farm = Subject (Publisher)
 * Chicken / Llama = Observers (Subscribers)
 * FarmObserver = Common interface
 */

// ========================================
// 1. Observer Interface
// ========================================

interface FarmObserver {
  update_food_served(food: string): void;
}

// ========================================
// 2. Farm — Subject
// ========================================

class Farm {
  private _farm_observers = new Set<FarmObserver>();

  // Notify all subscribed observers
  feeding_time(food: string): void {
    for (const observer of this._farm_observers) {
      observer.update_food_served(food);
    }
  }

  // Register an observer
  subscribe(observer: FarmObserver): void {
    this._farm_observers.add(observer);
  }

  // Remove an observer
  unsubscribe(observer: FarmObserver): void {
    this._farm_observers.delete(observer);
  }
}

// ========================================
// 3. Abstract Animal
// ========================================

abstract class Animal {
  abstract talk(): void;

  eat(food: string): void {
    console.log("Ate " + food);
  }
}

// ========================================
// 4. Chicken — Concrete Observer
// ========================================

class Chicken extends Animal implements FarmObserver {
  talk(): void {
    console.log("BCAAAW");
  }

  update_food_served(food: string): void {
    if (food === "worms") {
      this.eat(food);
    } else {
      this.talk();
    }
  }
}

// ========================================
// 5. Llama — Concrete Observer
// ========================================

class Llama extends Animal implements FarmObserver {
  talk(): void {
    console.log("Llaaaama!");
  }

  update_food_served(food: string): void {
    if (food === "llama snack") {
      this.eat(food);
    } else if (food === "spam") {
      this.spit();
    } else {
      this.talk();
    }
  }

  override eat(food: string): void {
    console.log("Om nom nom " + food);
  }

  spit(): void {
    console.log("PTUEY!");
  }
}

// ========================================
// 6. Example Usage
// ========================================

const farm = new Farm();

const chicken = new Chicken();
const llama = new Llama();

farm.subscribe(chicken);
farm.subscribe(llama);

farm.feeding_time("worms");
// Ate worms
// Llaaaama!

farm.feeding_time("spam");
// BCAAAW
// PTUEY!

farm.unsubscribe(chicken);

farm.feeding_time("llama snack");
// Om nom nom llama snack
