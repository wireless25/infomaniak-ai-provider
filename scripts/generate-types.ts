// scripts/generate-types.ts
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'

// Load environment variables
config()

interface InfomaniakModel {
  description: string
  documentation_link: string
  id: number
  info_status: string
  last_updated_at: string
  logo_url: string
  max_token_input: number | null
  name: string
  type: string
  version: string
}

interface ApiResponse {
  data: InfomaniakModel[]
  result: string
}

async function fetchModels(): Promise<InfomaniakModel[]> {
  const token = process.env.INFOMANIAK_TOKEN

  if (!token) {
    throw new Error('INFOMANIAK_TOKEN not found in environment variables')
  }

  console.log('🔄 Fetching models from Infomaniak API...')

  const response = await fetch('https://api.infomaniak.com/1/ai/models', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  const data: ApiResponse = await response.json()

  if (data.result !== 'success') {
    throw new Error('API returned unsuccessful result')
  }

  console.log(`✅ Fetched ${data.data.length} models`)
  return data.data
}

function generateTypes(modelsData: InfomaniakModel[]): string {
  // Extract unique values for union types
  const types = new Set(modelsData.map(m => m.type))
  const statuses = new Set(modelsData.map(m => m.info_status))

  // Group models by type
  const modelsByType = Array.from(types).reduce((acc, type) => {
    acc[type] = modelsData
      .filter(m => m.type === type)
      .map(m => m.name)
    return acc
  }, {} as Record<string, string[]>)

  // Generate type name mapping
  const typeNameMapping: Record<string, string> = {
    llm: 'Chat',
    image: 'Image',
    embedding: 'Embedding',
    stt: 'STT',
  }

  const typeDefinition = `// Generated types for Infomaniak AI Models
// Last updated: ${new Date().toISOString()}
// Do not change this file, it will be regenerated automatically

export type ModelType = ${Array.from(types).map(t => `'${t}'`).join(' | ')}

export type InfoStatus = ${Array.from(statuses).map(s => `'${s}'`).join(' | ')}

// Model ID unions by type
${Array.from(types).map((type) => {
  const typeName = typeNameMapping[type] || type.toUpperCase()
  const models = modelsByType[type] || []

  return `export type Infomaniak${typeName}ModelId = 
  | ${models.map(name => `'${name}'`).join('\n  | ')}
  | (string & {})`
}).join('\n\n')}

// All model IDs union
export type InfomaniakModelId = 
${Array.from(types).map((type) => {
  const typeName = typeNameMapping[type] || type.toUpperCase()
  return `  | Infomaniak${typeName}ModelId`
}).join('\n')}

export interface InfomaniakModel {
  description: string
  documentation_link: string
  id: number
  info_status: InfoStatus
  last_updated_at: string
  logo_url: string
  max_token_input: number | null
  name: string
  type: ModelType
  version: string
}

export type InfomaniakModels = InfomaniakModel[]

// Model name constants for easy access
export const MODEL_NAMES = {
${modelsData.map(m => `  ${m.name.toUpperCase()}: '${m.name}' as const,`).join('\n')}
} as const

// Helper functions
export function getModelsByType<T extends ModelType>(models: InfomaniakModels, type: T): InfomaniakModel[] {
  return models.filter(model => model.type === type)
}

export function getReadyModels(models: InfomaniakModels): InfomaniakModel[] {
  return models.filter(model => model.info_status === 'ready')
}

${Array.from(types).map((type) => {
  const typeName = typeNameMapping[type] || type.toUpperCase()
  const functionName = `get${typeName}Models`

  return `export function ${functionName}(models: InfomaniakModels): InfomaniakModel[] {
  return getModelsByType(models, '${type}')
}`
}).join('\n\n')}
`

  return typeDefinition
}

async function main() {
  try {
    // Fetch models from API
    const modelsData = await fetchModels()

    // Generate types
    console.log('🔄 Generating TypeScript types...')
    const typeDefinition = generateTypes(modelsData)

    // Ensure directory exists
    const outputDir = path.join(process.cwd(), 'src')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Write to file
    const outputPath = path.join(outputDir, 'infomaniak-models.ts')
    fs.writeFileSync(outputPath, typeDefinition)

    console.log(`✅ Types generated successfully at ${outputPath}`)

    // Also save raw data for reference
    const dataPath = path.join(outputDir, 'infomaniak-models-data.json')
    fs.writeFileSync(dataPath, JSON.stringify(modelsData, null, 2))
    console.log(`📄 Raw data saved at ${dataPath}`)
  }
  catch (error) {
    console.error('❌ Error generating types:', error)
    process.exit(1)
  }
}

main()
