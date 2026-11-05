'use client';
import {useCallback,useEffect,useState} from 'react';
const storageKey='hz_compare';
const eventName='halozon:compare';
function readIds(){try{return JSON.parse(localStorage.getItem(storageKey)||'[]') as string[]}catch{return []}}
export function useCompare(){const [ids,setIds]=useState<string[]>([]);useEffect(()=>{setIds(readIds());const sync=()=>setIds(readIds());window.addEventListener('storage',sync);window.addEventListener(eventName,sync);return()=>{window.removeEventListener('storage',sync);window.removeEventListener(eventName,sync)}},[]);const save=useCallback((next:string[])=>{setIds(next);localStorage.setItem(storageKey,JSON.stringify(next));window.dispatchEvent(new Event(eventName))},[]);return{ids,has:(id:string)=>ids.includes(id),toggle:(id:string)=>save(ids.includes(id)?ids.filter(x=>x!==id):ids.length<4?[...ids,id]:ids),remove:(id:string)=>save(ids.filter(x=>x!==id)),clear:()=>save([])}}
