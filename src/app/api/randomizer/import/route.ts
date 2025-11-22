import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ImportCategory {
  name: string
  items: string[]
}

// POST /api/randomizer/import - Import categories and items from CSV
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categories } = body as { categories: ImportCategory[] }

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    }

    // Process each category
    for (const categoryData of categories) {
      try {
        // Validate category name
        if (!categoryData.name || categoryData.name.trim() === '') {
          results.errors.push(`Categoria sem nome ignorada`)
          results.skipped++
          continue
        }

        // Validate items count (max 20)
        const validItems = categoryData.items.filter(item => item && item.trim() !== '')
        
        if (validItems.length === 0) {
          results.errors.push(`Categoria "${categoryData.name}" ignorada: nenhum item válido`)
          results.skipped++
          continue
        }

        if (validItems.length > 20) {
          results.errors.push(
            `Categoria "${categoryData.name}" ignorada: ${validItems.length} itens (máximo: 20)`
          )
          results.skipped++
          continue
        }

        // Check if category already exists
        const existingCategory = await prisma.category.findFirst({
          where: { name: categoryData.name.trim() }
        })

        if (existingCategory) {
          results.errors.push(
            `Categoria "${categoryData.name}" já existe`
          )
          results.skipped++
          continue
        }

        // Create category with items
        await prisma.category.create({
          data: {
            name: categoryData.name.trim(),
            items: {
              create: validItems.map(itemName => ({
                name: itemName.trim(),
              }))
            }
          }
        })

        results.created++
      } catch (error) {
        console.error(`Error processing category ${categoryData.name}:`, error)
        results.errors.push(
          `Erro ao processar categoria "${categoryData.name}"`
        )
        results.skipped++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Importação concluída: ${results.created} categoria(s) criada(s), ${results.skipped} ignorada(s)`,
      results,
    })
  } catch (error) {
    console.error('Error importing CSV:', error)
    return NextResponse.json(
      { error: 'Failed to import CSV data' },
      { status: 500 }
    )
  }
}

