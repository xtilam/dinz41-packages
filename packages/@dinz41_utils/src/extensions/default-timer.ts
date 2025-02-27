import { dinz41 } from "../main.js";

/**
 * Delay for a number of milliseconds.
 * @param ms milliseconds
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
Object.assign(dinz41, { delay });

// ----------------------------------------------
declare global {
  namespace Dinz41 {
    interface Extensions {
      delay: typeof delay;
    }
  }
}
