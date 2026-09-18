import type { Signal as SignalInterface } from "signal-polyfill";

declare global {
  const Signal: typeof SignalInterface;
}
