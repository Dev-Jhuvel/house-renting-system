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
  let color = "";
  if(green.includes(status)){
    color =  "green";
  }else if(yellow.includes(status)){
    color = "yellow"
  }else if(red.includes(status)){
    color = "red"
  }else{
    color = "gray"
  }
  return `bg-${color}-500`;
}