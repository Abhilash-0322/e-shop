'use client';
import {useCallback,useEffect,useState} from 'react';
export function useCompare(){const [ids,setIds]=useState<string[]>([]);useEffect(()=>{try{setIds(JSON.parse(localStorage.getItem('hz_compare')||'[]'))}catch{}},[]);const save=useCallback((next:string[])=>{setIds(next);localStorage.setItem('hz_compare',JSON.stringify(next))},[]);return{ids,has:(id:string)=>ids.includes(id),toggle:(id:string)=>save(ids.includes(id)?ids.filter(x=>x!==id):ids.length<4?[...ids,id]:ids),remove:(id:string)=>save(ids.filter(x=>x!==id)),clear:()=>save([])}}
