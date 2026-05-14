<<<<<<< HEAD
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
=======
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
>>>>>>> 9cb9070e4de5ed49abc41db861e9924bb0de2e84

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
