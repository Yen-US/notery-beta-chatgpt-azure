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
const deploymentName = "gpt-4o-mini"; //This must match your deployment name.
const endpoint = process.env.AZURE_OPENAI_ENDPOINT
const apiKey = process.env.AZURE_OPENAI_API_KEY
const apiVersion = "2024-02-15-preview";

function getClient(): AzureOpenAI {
  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment: deploymentName,
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
    response = await openai.images.generate({
      model: modelVersion,
      prompt: messages[1].content,
      n: 1,
      size: imageSize,
    });

    const image =  `![imageGenerated](${response.data[0].url})`

    return new Response(image)
  }else{
    
    const client = getClient();
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