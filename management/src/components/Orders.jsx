import React,{useEffect,useState} from 'react';
import {request} from '../api';
import Invoice from '../../../shared/Invoice.jsx';
export default function Orders(){
const [orders,setOrders]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
useEffect(()=>{request('orders/').then(d=>setOrders(d.orders)).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);
return <section><h1>سفارش‌ها و فاکتورها</h1>{loading?<p>در حال دریافت…</p>:error?<p role="alert">{error}</p>:!orders.length?<p>سفارشی ثبت نشده است.</p>:orders.map(o=><details key={o.id}><summary>فاکتور AP-{o.id} — {o.phone}</summary><Invoice order={o}/></details>)}</section>;
}
