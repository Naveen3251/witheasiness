
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


import { Resemble } from '@resemble/node' // If you are using es modules

Resemble.setApiKey("Paste your resemble api key")

interface Response {
    items: any[]; 
}
interface WriteResponseV2<T> {
    item: T;
    
}
interface Clip {
    audio_src: string;
  
}

export async function POST(req:Request) {
    try{
        //data body
        const prompt:string=await req.text();
        console.log(prompt)

        //fetch current user
        const user=await currentUser();

         //check wether logged in
         if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized",{status:401});
        }
        project_uuid=""//place your project uuid
        voice_uuid=""//place your voice uuid
        const voice_clip = await Resemble.v2.clips.createSync(project_uuid,{
            body: prompt,
            voice_uuid:voice_uuid,
            is_public: false,
            is_archived: false
        });
        console.log(voice_clip)
        const audio_src=(voice_clip as WriteResponseV2<Clip>).item.audio_src;
        
        return new NextResponse(audio_src, { status: 200 });
    }catch(error){
        return new NextResponse("An error occured",{status:404});
    }
}
