'use client'

import { useState, useEffect, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { D20Roller } from '@/components/organisms/d20-roller'
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Dice6, Upload } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import Papa from 'papaparse'

interface Category {
  id: string
  name: string
  description?: string | null
  items: RandomItem[]
}

interface RandomItem {
  id: string
  name: string
  weight: number
  rarity?: string | null
  description?: string | null
  categoryId: string
}

export default function RandomizerPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('')
  const [isRollerOpen, setIsRollerOpen] = useState(false)
  
  // Category dialog state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })
  
  // Item dialog state
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RandomItem | null>(null)
  const [itemForm, setItemForm] = useState({ name: '', weight: '', rarity: '', description: '' })
  const [itemCategoryId, setItemCategoryId] = useState<string>('')

  // History state
  const [rollHistory, setRollHistory] = useState<any[]>([])
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null)

  // Import CSV state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchCategories()
    fetchHistory()
  }, [])

  const fetchHistory = async (categoryId?: string) => {
    try {
      const url = categoryId 
        ? `/api/randomizer/history?categoryId=${categoryId}` 
        : '/api/randomizer/history'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRollHistory(data)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/randomizer/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleCategorySubmit = async () => {
    try {
      if (editingCategory) {
        await fetch(`/api/randomizer/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        })
      } else {
        await fetch('/api/randomizer/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        })
      }
      setIsCategoryDialogOpen(false)
      setEditingCategory(null)
      setCategoryForm({ name: '', description: '' })
      fetchCategories()
      fetchHistory(selectedCategoryFilter || undefined)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Erro ao salvar categoria')
    }
  }

  const handleCategoryDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    
    try {
      await fetch(`/api/randomizer/categories/${id}`, {
        method: 'DELETE',
      })
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Erro ao excluir categoria')
    }
  }

  const openCategoryEdit = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || '',
    })
    setIsCategoryDialogOpen(true)
  }

  const openItemEdit = (item: RandomItem, categoryId: string) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      description: item.description || '',
      weight: item.weight ? item.weight.toString() : '',
      rarity: item.rarity || '',
    })
    setItemCategoryId(categoryId)
    setIsItemDialogOpen(true)
  }

  const handleItemSubmit = async () => {
    if (!itemCategoryId) return
    
    try {
      if (editingItem) {
        await fetch(`/api/randomizer/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: itemForm.name,
            description: itemForm.description,
            weight: itemForm.weight ? parseFloat(itemForm.weight) : null,
            rarity: itemForm.rarity || null,
          }),
        })
      } else {
        const response = await fetch(`/api/randomizer/categories/${itemCategoryId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: itemForm.name,
            description: itemForm.description,
            weight: itemForm.weight ? parseFloat(itemForm.weight) : null,
            rarity: itemForm.rarity || null,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          alert(error.error || 'Erro ao criar item')
          return
        }
      }
      setIsItemDialogOpen(false)
      setEditingItem(null)
      setItemForm({ name: '', weight: '', rarity: '', description: '' })
      setItemCategoryId('')
      fetchCategories()
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Erro ao salvar item')
    }
  }

  const handleItemDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return
    
    try {
      await fetch(`/api/randomizer/items/${id}`, {
        method: 'DELETE',
      })
      fetchCategories()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Erro ao excluir item')
    }
  }

  const handleRoll = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId)
    setSelectedCategoryName(categoryName)
    setIsRollerOpen(true)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImportFile(file)
      setImportResult('')
    }
  }

  const handleImportCSV = async () => {
    if (!importFile) return

    setIsImporting(true)
    setImportResult('')

    try {
      // Parse CSV
      Papa.parse(importFile, {
        complete: async (results) => {
          try {
            const data = results.data as string[][]
            
            if (data.length < 2) {
              setImportResult('Erro: CSV deve ter pelo menos 2 linhas (cabeçalho + itens)')
              setIsImporting(false)
              return
            }

            // First row is category names
            const categoryNames = data[0].filter(name => name && name.trim() !== '')
            
            if (categoryNames.length === 0) {
              setImportResult('Erro: Nenhuma categoria encontrada na primeira linha')
              setIsImporting(false)
              return
            }

            // Build categories with items
            const categories = categoryNames.map((name, colIndex) => ({
              name,
              items: data
                .slice(1) // Skip header row
                .map(row => row[colIndex])
                .filter(item => item && item.trim() !== '')
            }))

            // Send to API
            const response = await fetch('/api/randomizer/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ categories }),
            })

            const result = await response.json()

            if (response.ok) {
              setImportResult(result.message)
              if (result.results.errors.length > 0) {
                setImportResult(prev => prev + '\n\nAvisos:\n' + result.results.errors.join('\n'))
              }
              fetchCategories()
              fetchHistory(selectedCategoryFilter || undefined)
            } else {
              setImportResult(`Erro: ${result.error}`)
            }
          } catch (error) {
            console.error('Error processing CSV:', error)
            setImportResult('Erro ao processar o arquivo CSV')
          } finally {
            setIsImporting(false)
          }
        },
        error: (error) => {
          console.error('CSV parse error:', error)
          setImportResult('Erro ao ler o arquivo CSV')
          setIsImporting(false)
        },
      })
    } catch (error) {
      console.error('Error importing CSV:', error)
      setImportResult('Erro ao importar CSV')
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Randomizador d20</h2>
        <p className="text-muted-foreground">
          Gerencie categorias e itens, depois role o d20 para resultados aleatórios
        </p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="randomizer">Randomizador</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setImportFile(null)
                setImportResult('')
                setIsImportDialogOpen(true)
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <Button onClick={() => {
              setEditingCategory(null)
              setCategoryForm({ name: '', description: '' })
              setIsCategoryDialogOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{category.name}</CardTitle>
                        <Badge variant="secondary">
                          {category.items.length}/20
                        </Badge>
                      </div>
                      {category.description && (
                        <CardDescription className="mt-1">
                          {category.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openCategoryEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCategoryDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {expandedCategory === category.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {expandedCategory === category.id && (
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Itens ({category.items.length}/20)</h4>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingItem(null)
                          setItemForm({ name: '', weight: '', rarity: '', description: '' })
                          setItemCategoryId(category.id)
                          setIsItemDialogOpen(true)
                        }}
                        disabled={category.items.length >= 20}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Item
                      </Button>
                    </div>
                    {category.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum item cadastrado</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Peso</TableHead>
                            <TableHead>Raridade</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.weight ? item.weight : 'Padrão (1.0)'}</TableCell>
                              <TableCell>
                                {item.rarity && (
                                  <Badge variant="outline">{item.rarity}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openItemEdit(item, category.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleItemDelete(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="randomizer" className="space-y-4">
          {categories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Crie categorias na aba "Categorias" para começar a usar o randomizador
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {category.items.length} {category.items.length === 1 ? 'item' : 'itens'}
                      </Badge>
                      <Button
                        onClick={() => handleRoll(category.id, category.name)}
                        disabled={category.items.length === 0}
                      >
                        <Dice6 className="mr-2 h-4 w-4" />
                        Rolar d20
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Histórico de Rolagens</h3>
              <p className="text-sm text-muted-foreground">
                Registro de todos os itens que saíram no randomizador
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategoryFilter || ''}
                onChange={(e) => {
                  const categoryId = e.target.value || null
                  setSelectedCategoryFilter(categoryId)
                  fetchHistory(categoryId || undefined)
                }}
                className="px-3 py-2 bg-background border rounded-md"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategoryFilter(null)
                  fetchHistory()
                }}
              >
                Limpar Filtro
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  if (!confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
                    return
                  }
                  
                  try {
                    const url = selectedCategoryFilter
                      ? `/api/randomizer/history?categoryId=${selectedCategoryFilter}`
                      : '/api/randomizer/history'
                    
                    await fetch(url, {
                      method: 'DELETE',
                    })
                    
                    fetchHistory(selectedCategoryFilter || undefined)
                  } catch (error) {
                    console.error('Error clearing history:', error)
                    alert('Erro ao limpar histórico')
                  }
                }}
                disabled={rollHistory.length === 0}
              >
                Limpar Histórico
              </Button>
            </div>
          </div>

          {rollHistory.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nenhum item foi sorteado ainda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Raridade</TableHead>
                    <TableHead>Peso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rollHistory.map((roll) => (
                    <TableRow key={roll.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(roll.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{roll.category.name}</TableCell>
                      <TableCell className="font-medium">{roll.item.name}</TableCell>
                      <TableCell>
                        {roll.item.rarity && (
                          <Badge variant="outline">{roll.item.rarity}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{roll.item.weight ? roll.item.weight : 'Padrão (1.0)'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Atualize os dados da categoria'
                : 'Crie uma nova categoria para organizar seus itens'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nome *</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Nome da categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Descrição</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Descrição opcional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCategorySubmit} disabled={!categoryForm.name}>
              {editingCategory ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Item' : 'Novo Item'}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? 'Atualize os dados do item'
                : 'Adicione um novo item à categoria (máximo 20 itens)'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Nome *</Label>
              <Input
                id="item-name"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                placeholder="Nome do item"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">Descrição</Label>
              <Textarea
                id="item-description"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Descrição do item (opcional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-weight">Peso</Label>
              <Input
                id="item-weight"
                type="number"
                step="0.1"
                min="0.1"
                value={itemForm.weight}
                onChange={(e) => setItemForm({ ...itemForm, weight: e.target.value })}
                placeholder="Peso para randomização (opcional, padrão: 1.0)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-rarity">Raridade</Label>
              <Input
                id="item-rarity"
                value={itemForm.rarity}
                onChange={(e) => setItemForm({ ...itemForm, rarity: e.target.value })}
                placeholder="Raridade (opcional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleItemSubmit}
              disabled={!itemForm.name}
            >
              {editingItem ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importar Categorias e Itens via CSV</DialogTitle>
            <DialogDescription>
              Formato: Cada coluna é uma categoria, primeira linha = nomes das categorias, linhas seguintes = itens
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Arquivo CSV</Label>
              <Input
                ref={fileInputRef}
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
              />
              <p className="text-sm text-muted-foreground">
                Exemplo de formato CSV:
              </p>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`Tesouro,Armadilha,Encontro
Anel de Ouro,Espinhos,Goblin
Poção de Cura,Fosso,Orc
Espada Mágica,Veneno,Dragão`}
              </pre>
            </div>

            {importFile && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Arquivo selecionado:</p>
                <p className="text-sm text-muted-foreground">{importFile.name}</p>
              </div>
            )}

            {importResult && (
              <div className={`p-3 rounded-md ${
                importResult.startsWith('Erro') 
                  ? 'bg-destructive/10 text-destructive' 
                  : 'bg-green-500/10 text-green-700 dark:text-green-400'
              }`}>
                <pre className="text-sm whitespace-pre-wrap">{importResult}</pre>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportDialogOpen(false)
                setImportFile(null)
                setImportResult('')
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              Fechar
            </Button>
            <Button
              onClick={handleImportCSV}
              disabled={!importFile || isImporting}
            >
              {isImporting ? 'Importando...' : 'Importar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* D20 Roller */}
      {selectedCategory && (
        <D20Roller
          categoryId={selectedCategory}
          categoryName={selectedCategoryName}
          isOpen={isRollerOpen}
          onClose={() => {
            setIsRollerOpen(false)
            setSelectedCategory(null)
            setSelectedCategoryName('')
          }}
          onRollComplete={() => {
            // Atualizar histórico quando uma rolagem for completada
            fetchHistory(selectedCategoryFilter || undefined)
          }}
        />
      )}
    </div>
  )
}

