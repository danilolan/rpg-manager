import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface VideoFormProps {
  form: {
    name: string
    category: string
    youtubeLink: string
  }
  isEditing: boolean
  onChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function VideoForm({ form, isEditing, onChange, onSubmit, onCancel }: VideoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Vídeo' : 'Adicionar Vídeo'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Atualize as informações do vídeo' : 'Preencha os dados para adicionar um novo vídeo'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Nome do vídeo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => onChange('category', e.target.value)}
                placeholder="Ex: Música, Tutorial"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtubeLink">URL do YouTube *</Label>
              <Input
                id="youtubeLink"
                type="url"
                value={form.youtubeLink}
                onChange={(e) => onChange('youtubeLink', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}





