import OpenAI from 'openai'
import { AzureOpenAI } from "openai";
import type {
  ChatCompletionStreamOptions,
  ChatCompletionCreateParamsStreaming
} from "openai/resources/index";

import { OpenAIStream, StreamingTextResponse } from 'ai'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
   
export const runtime = 'edge'



// Required Azure OpenAI deployment name and API version
const endpoint = process.env.AZURE_OPENAI_ENDPOINT

const apiKey = process.env.AZURE_OPENAI_API_KEY

const deploymentNameText = "gpt-4o-mini"; //This must match your deployment name.
const apiVersionText = "2024-02-15-preview";
const deploymentNameImage = "dall-e-3"; //This must match your deployment name.
const apiVersionImage = "2024-02-01";

function getClient(apiVersion:string, deployment:string): AzureOpenAI {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment
  });
}

export async function GET(request: Request) {
        //const { searchParams } = new URL(request.url)
        //const id = searchParams.get('id')
        //const body = await request.json()
        //const headers = new Headers();
        //headers.append('Content-Type', 'application/json');

        const res = { 'data': 'hello' }
     
        return Response.json({ res })
    }

 
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url)
  const modelVersion = searchParams.get('model') || 'gpt-3.5-turbo'
  const imageSize = searchParams.get('size') as "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792" | null | undefined || "1024x1024"
  const { messages } = await req.json();
  let response

  if (modelVersion === 'dall-e-3' || modelVersion === 'dall-e-2') {
    
    const client = getClient(apiVersionImage,deploymentNameImage);
    response = await client.images.generate({
      model: "dall-e-2",
      prompt: messages[1].content,
      n: 1,
      size: imageSize,
      style: "vivid", // or "natural");
    });
    

    const image =  `![imageGenerated](${response.data[0].url})`

    return new Response(image)
  }else{
    
    const client = getClient(apiVersionText, deploymentNameText);
    const params: ChatCompletionCreateParamsStreaming = {
      model: modelVersion,
      messages,
      stream: true,
      temperature: 1,
      max_tokens: 50,
    }
    const response = await client.chat.completions.create(params);
    const stream = OpenAIStream(response)
 
    return new StreamingTextResponse(stream)
  }

  
 
  
}