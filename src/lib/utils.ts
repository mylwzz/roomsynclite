import { clsx, type ClassValue } from "clsx";
import { twMerge }               from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Compatibility-score helper  */

/** convert ratings into 0-1 */
const toUnit = (v: number) => (v - 1) / 4;
const dist   = (a: number, b: number) => Math.abs(toUnit(a) - toUnit(b));
const sleepDist = (t1: string, t2: string) => {
  const [h1, m1] = t1.split(":").map(Number);
  const [h2, m2] = t2.split(":").map(Number);
  const minutes  = Math.abs(h1 * 60 + m1 - (h2 * 60 + m2));
  const wrapped  = 24 * 60 - minutes;
  return Math.min(minutes, wrapped) / (12 * 60);          // 0-1
};

/**
 * Return a 0-10 compatibility score (1 decimal).
 *
 * Weights  
 *   • cleanliness … 40 %  
 *   • noise tolerance … 30 %  
 *   • sleep-time match … 20 %  
 *   • age difference … 10 %
 */
export function calculateCompatibilityScore(
  a: { cleanlinessLevel: number; noiseTolerance: number; sleepTime: string; age: number },
  b: { cleanlinessLevel: number; noiseTolerance: number; sleepTime: string; age: number },
) {
  const clean = 1 - dist(a.cleanlinessLevel, b.cleanlinessLevel);   
  const noise = 1 - dist(a.noiseTolerance,   b.noiseTolerance);     
  const sleep = 1 - sleepDist(a.sleepTime,   b.sleepTime);          
  const age   = 1 - Math.min(Math.abs(a.age - b.age), 20) / 20;     

  const score = clean * 0.4 + noise * 0.3 + sleep * 0.2 + age * 0.1;

  return +(score * 10).toFixed(1);   
}