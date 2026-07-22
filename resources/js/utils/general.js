import { includes } from "zod";

export const toTitleCase = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export const toOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const statusColor = (status, isText = false) =>{
  const green   = ['active', 'available', 'paid'];
  const yellow  = ['pending', 'reserved', 'partial'];
  const red     = ['ended', 'canceled', 'occupied', 'unpaid', 'overdue', 'inactive'];
  const blue    = ['maintenance'];
  const style = isText ? 'text' : 'bg'
  const shade = isText ? '500' : '300'
  if(green.includes(status)){
    return `${style}-green-${shade}`
  }else if(yellow.includes(status)){
    return `${style}-yellow-${shade}`
  }else if(red.includes(status)){
    return `${style}-red-${shade}`
  }else if(blue.includes(status)){
   return `${style}-blue-${shade}`
  }else{
    return `${style}-gray-${shade}`
  }
}


export const getTimeOfDay = (date = new Date) =>{
  if(!(date instanceof Date)  || isNaN(date)){
    throw new Error("Invalid Date object");
  }

  const hour = date.getHours(); // Military time

  if(hour >= 5 && hour < 12){
    return "Good morning";
  }else if(hour >= 12 && hour < 17){
    return "Good afternoon";
  }else if(hour >= 17 && hour < 21){
    return "Good evening";
  }else{
    return "Good night";
  }
}