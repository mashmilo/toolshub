export async function onRequestGet({request,env}){
  const J=x=>Response.json(x);
  const id=new URL(request.url).searchParams.get('list')||'';
  if(!/^[\w-]{10,60}$/.test(id))return J({error:'Invalid playlist link'});
  const s=JSON.parse(await env.SETTINGS.get('s')||'{}');
  const key=(s.keys&&s.keys.youtube)||env.YOUTUBE_API_KEY;
  if(!key)return J({error:'YouTube API key is not set in the admin panel'});
  const api=async(p,q)=>(await fetch(`https://www.googleapis.com/youtube/v3/${p}?key=${key}&${q}`)).json();
  const pl=await api('playlists',`part=snippet&id=${id}`);
  if(pl.error)return J({error:pl.error.message});
  if(!pl.items||!pl.items.length)return J({error:'Playlist not found or it is private'});
  const ids=[];let tok='';
  do{const r=await api('playlistItems',`part=contentDetails&maxResults=50&playlistId=${id}${tok?'&pageToken='+tok:''}`);
    if(r.error)return J({error:r.error.message});
    ids.push(...r.items.map(i=>i.contentDetails.videoId));tok=r.nextPageToken;
  }while(tok&&ids.length<1000);
  let sec=0,n=0;
  for(let i=0;i<ids.length;i+=50){
    const r=await api('videos',`part=contentDetails&id=${ids.slice(i,i+50).join(',')}`);
    for(const v of r.items||[]){const m=v.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      sec+=(+m[1]||0)*3600+(+m[2]||0)*60+(+m[3]||0);n++}
  }
  return Response.json({title:pl.items[0].snippet.title,count:n,seconds:sec},{headers:{'Cache-Control':'public,max-age=3600'}});
}
