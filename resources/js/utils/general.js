import { includes } from "zod";

export const toTitleCase = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export const toOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const statusColor = (status) =>{
  const green   = ['active', 'available', 'paid'];
  const yellow  = ['pending', 'reserved', 'partial'];
  const red     = ['ended', 'canceled', 'occupied', 'unpaid', 'overdue', 'inactive'];
  const blue    = ['maintenance'];
  if(green.includes(status)){
    return 'bg-green-500'
  }else if(yellow.includes(status)){
    return 'bg-yellow-500'
  }else if(red.includes(status)){
    return 'bg-red-500'
  }else if(blue.includes(status)){
   return 'bg-blue-500'
  }else{
    return 'bg-gray-500'
  }
}