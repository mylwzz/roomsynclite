// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string.
 * @param inputs - An array of class names or objects that evaluate to class names.
 * @returns A string of combined class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a 1-5 rating to a 0-1 scale.
 * @param value - The rating value (1-5).
 * @returns The value scaled between 0 and 1.
 */
const toUnit = (value: number) => (value - 1) / 4;

/**
 * Normalizes a time string (HH:MM) to a 0-1 scale, representing a fraction of the day.
 * @param time - The time string in "HH:MM" format.
 * @returns The time represented as a value between 0 and 1.
 */
const timeUnit = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours * 60 + minutes) / (24 * 60 - 1);
};

/**
 * Converts an age to a 0-1 scale, given a minimum and maximum age.
 * @param age - The age value.
 * @param min - The minimum age (default: 18).
 * @param max - The maximum age (default: 100).
 * @returns The age scaled between 0 and 1 within the given range.
 */
const ageUnit = (age: number, min = 18, max = 100) => {
  const clampedAge = Math.max(min, Math.min(age, max));
  return (clampedAge - min) / (max - min);
};

/**
 * Converts a user profile object into a numeric feature vector.
 * The vector represents: [cleanliness, noiseTolerance, sleepTimeDifference, age].
 * @param user - An object containing user profile data.
 * @returns An array of numeric features representing the user profile.
 */
function toVector(user: {
  cleanlinessLevel: number;
  noiseTolerance: number;
  sleepTime: string;
  age: number;
}): number[] {
  const sleepTimeDiff = 1 - Math.abs(timeUnit(user.sleepTime) - timeUnit(user.sleepTime)); // Always 1 for self, used in comparison
  return [
    toUnit(user.cleanlinessLevel),
    toUnit(user.noiseTolerance),
    sleepTimeDiff,
    ageUnit(user.age),
  ];
}

/**
 * Calculates the dot product of two numeric arrays.
 * @param a - The first numeric array.
 * @param b - The second numeric array.  Must have the same length as 'a'.
 * @returns The dot product of the two arrays.
 */
function dot(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

/**
 * Calculates the magnitude (Euclidean norm) of a numeric array.
 * @param a - The numeric array.
 * @returns The magnitude of the array.
 */
function magnitude(a: number[]): number {
  return Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Calculates a compatibility score (0-10) between two user profiles using cosine similarity.
 * @param userA - The first user's profile data.
 * @param userB - The second user's profile data.
 * @returns The compatibility score, rounded to one decimal place.
 */
export function calculateCompatibilityScore(
  userA: { cleanlinessLevel: number; noiseTolerance: number; sleepTime: string; age: number },
  userB: { cleanlinessLevel: number; noiseTolerance: number; sleepTime: string; age: number }
): number {
  const vecA = toVector(userA);
  const vecB = toVector(userB);

  const dotProduct = dot(vecA, vecB);
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  const magnitudeProduct = magA * magB || 1; // Avoid division by zero

  const cosineSimilarity = dotProduct / magnitudeProduct;
  return +(cosineSimilarity * 10).toFixed(1);
}