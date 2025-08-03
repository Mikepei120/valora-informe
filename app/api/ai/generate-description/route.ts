import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import openai from '@/lib/openai/client'
import { prompts } from '@/lib/openai/prompts'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { propertyData } = await request.json()

    if (!propertyData) {
      return NextResponse.json({ error: 'Property data is required' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompts.propertyDescription(propertyData)
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const description = completion.choices[0]?.message?.content

    if (!description) {
      throw new Error('No description generated')
    }

    return NextResponse.json({ description })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate description' },
      { status: 500 }
    )
  }
}