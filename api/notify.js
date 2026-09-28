// Vercel serverless function. Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, ADMIN_EMAIL, RESEND_API_KEY
// Optional WhatsApp Cloud API: WA_TOKEN, WA_PHONE_ID, WA_TO (e.g. 923250043448)
module.exports=async(req,res)=>{
 if(req.method!=="POST")return res.status(405).end();
 try{
  const {order_no}=req.body||{};const U=process.env.SUPABASE_URL,K=process.env.SUPABASE_SERVICE_KEY;
  if(!order_no||!U||!K)return res.status(200).json({ok:false});
  // Atomically claim the order (only once, only if fresh) so this endpoint can't be used to spam.
  const r=await fetch(`${U}/rest/v1/orders?order_no=eq.${encodeURIComponent(order_no)}&notified=eq.false`,{method:"PATCH",
   headers:{apikey:K,Authorization:"Bearer "+K,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify({notified:true})});
  const [o]=await r.json();
  if(!o||Date.now()-new Date(o.created_at)>10*60*1000)return res.status(200).json({ok:false});
  const lines=o.items.map(i=>`- ${i.sku} ${i.name||""}: `+Object.entries(i.qty).map(([s,q])=>`${s} x ${q}`).join(", ")).join("\n");
  const text=`NEW ORDER ${o.order_no}\n${o.customer_name} (${o.company||"-"})\nPhone: ${o.phone}\nEmail: ${o.email}\nAddress: ${o.address||"-"}\n\n${lines}\n\nNotes: ${o.notes||"-"}`;
  if(process.env.RESEND_API_KEY)await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},
   body:JSON.stringify({from:"Azan Impex <onboarding@resend.dev>",to:[process.env.ADMIN_EMAIL],reply_to:o.email,subject:"New order "+o.order_no,text})});
  if(process.env.WA_TOKEN&&process.env.WA_PHONE_ID)await fetch(`https://graph.facebook.com/v20.0/${process.env.WA_PHONE_ID}/messages`,{method:"POST",
   headers:{Authorization:"Bearer "+process.env.WA_TOKEN,"Content-Type":"application/json"},
   body:JSON.stringify({messaging_product:"whatsapp",to:process.env.WA_TO,type:"text",text:{body:text}})});
  res.status(200).json({ok:true});
 }catch(e){res.status(200).json({ok:false})}
};
