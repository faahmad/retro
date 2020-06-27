import { DataAdapter } from "../types/data-adapter";

const MONEY_MULTIPLIER = 100;

class DollarAmountAdapter implements DataAdapter<string, number> {
  multiplier: number;

  constructor(multiplier: number) {
    this.multiplier = multiplier;
  }
  /**
   * Divides the amount by 100.
   */
  fromSource(amount: number): string {
    return (amount / this.multiplier).toFixed(2);
  }
  /**
   * Multiplies the amount by 100.
   */
  toSource(amount: string): number {
    return Number(amount) * this.multiplier;
  }
}

export const dollarAmountAdapter = new DollarAmountAdapter(MONEY_MULTIPLIER);
