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

    const { propertyData, valuation } = await request.json()

    if (!propertyData || !valuation) {
      return NextResponse.json({ error: 'Property data and valuation are required' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompts.executiveSummary(propertyData, valuation)
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    })

    const summary = completion.choices[0]?.message?.content

    if (!summary) {
      throw new Error('No summary generated')
    }

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate executive summary' },
      { status: 500 }
    )
  }
}