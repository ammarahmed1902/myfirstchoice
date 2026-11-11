"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { lineSchema, mergeLines } from "@/lib/validation";
import type { Tier } from "@/lib/catalogue";
export type Line = { productId: string; quantity: number; sample: boolean };
type Account = { email: string; status: string; company: string } | null;
type Trade = {
  cart: Line[];
  account: Account;
  tiers: Tier[];
  ready: boolean;
  notice: string;
  add: (line: Line) => boolean;
  replace: (lines: Line[]) => void;
  remove: (index: number) => void;
  clear: () => void;
  refresh: () => Promise<void>;
};
const Context = createContext<Trade | null>(null);
export function TradeProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Line[]>([]),
    [ready, setReady] = useState(false),
    [account, setAccount] = useState<Account>(null),
    [tiers, setTiers] = useState<Tier[]>([]),
    [notice, setNotice] = useState("");
  async function refresh() {
    try {
      const r = await fetch("/api/session", { cache: "no-store" });
      if (r.ok) {
        const d = await r.json();
        setAccount(d.account);
        if (d.account?.status === "approved") {
          const pr = await fetch("/api/prices", { cache: "no-store" });
          setTiers(pr.ok ? (await pr.json()).tiers : []);
        } else setTiers([]);
      }
    } catch {
      setNotice(
        "Account service is unavailable. Your enquiry list remains on this device.",
      );
    }
  }
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ebay1stchoice-cart-v2");
      if (saved) {
        const value = JSON.parse(saved);
        if (Array.isArray(value) && value.length <= 100)
          setCart(
            value.length
              ? mergeLines(value.map((v) => lineSchema.parse(v)))
              : [],
          );
      }
    } catch {
      setNotice(
        "An invalid saved enquiry was cleared. Please add your products again.",
      );
    }
    setReady(true);
    document.documentElement.dataset.tradeReady = "true";
    void refresh();
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("ebay1stchoice-cart-v2", JSON.stringify(cart));
      } catch {
        setNotice(
          "This browser cannot save your enquiry list. Keep this page open.",
        );
      }
    }
  }, [cart, ready]);
  function replace(lines: Line[]) {
    try {
      setCart(lines.length ? mergeLines(lines) : []);
      setNotice("Enquiry list updated.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Invalid quantity.");
    }
  }
  function add(line: Line) {
    try {
      const updated = mergeLines([...cart, lineSchema.parse(line)]);
      setCart(updated);
      setNotice("Added to your enquiry list.");
      return true;
    } catch {
      setNotice(
        "Enter valid quantities. Combined quantities must not exceed 10,000 per product.",
      );
      return false;
    }
  }
  return (
    <Context.Provider
      value={{
        cart,
        account,
        tiers,
        ready,
        notice,
        add,
        replace,
        remove: (i) => setCart((c) => c.filter((_, index) => index !== i)),
        clear: () => setCart([]),
        refresh,
      }}
    >
      {children}
      <div className="toast" role="status" aria-live="polite">
        {notice}
      </div>
    </Context.Provider>
  );
}
export function useTrade() {
  const value = useContext(Context);
  if (!value) throw new Error("TradeProvider missing");
  return value;
}
