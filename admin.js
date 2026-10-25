const ok=(r,e)=>e.ADMIN_PASSWORD&&r.headers.get('Authorization')==='Bearer '+e.ADMIN_PASSWORD;
export async function onRequestGet({request,env}){
  if(!ok(request,env))return new Response('Unauthorized',{status:401});
  return new Response(await env.SETTINGS.get('s')||'{}',{headers:{'Content-Type':'application/json'}});
}
export async function onRequestPost({request,env}){
  if(!ok(request,env))return new Response('Unauthorized',{status:401});
  const b=await request.json();
  await env.SETTINGS.put('s',JSON.stringify({ads:b.ads||{},keys:b.keys||{}}));
  return Response.json({ok:true});
}
