export async function onRequestGet({env}){
  const s=JSON.parse(await env.SETTINGS.get('s')||'{}');
  return Response.json(s.ads||{},{headers:{'Cache-Control':'public,max-age=300'}});
}
