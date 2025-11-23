"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { D20Mesh } from "./d20-3d"

interface RandomItem {
  id: string
  name: string
  weight: number
  rarity?: string | null
  description?: string | null
}

interface D20RollerProps {
  categoryId: string
  categoryName: string
  isOpen: boolean
  onClose: () => void
}

export function D20Roller({ categoryId, categoryName, isOpen, onClose, onRollComplete }: D20RollerProps) {
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<RandomItem | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [targetFace, setTargetFace] = useState<number | null>(null)
  const hasRolledRef = useRef(false)

  const rollDice = async () => {
    // Prevenir múltiplas chamadas simultâneas
    if (isRolling || hasRolledRef.current) return
    
    setIsRolling(true)
    setShowResult(false)
    setResult(null)
    setTargetFace(null)
    hasRolledRef.current = true

    // Primeiro fazer o sorteio
    try {
      const response = await fetch(`/api/randomizer/roll/${categoryId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to roll')
      }

      const item: RandomItem = await response.json()
      
      // Usar um hash do ID do item para determinar qual face mostrar (sempre a mesma para o mesmo item)
      // Isso garante que o mesmo item sempre pare na mesma face
      let hash = 0
      for (let i = 0; i < item.id.length; i++) {
        hash = ((hash << 5) - hash) + item.id.charCodeAt(i)
        hash = hash & hash // Convert to 32bit integer
      }
      const faceNumber = (Math.abs(hash) % 20) + 1
      setTargetFace(faceNumber)
      setResult(item)

      // Salvar no histórico apenas uma vez
      try {
        await fetch('/api/randomizer/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId,
            itemId: item.id,
          }),
        })
      } catch (historyError) {
        console.error('Error saving roll history:', historyError)
        // Não interromper o fluxo se falhar ao salvar histórico
      }
    } catch (error) {
      console.error('Error rolling dice:', error)
      setIsRolling(false)
      hasRolledRef.current = false
      alert('Erro ao rolar o dado')
      return
    }

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2500))

    setIsRolling(false)
    setShowResult(true)
    
    // Notificar que uma rolagem foi completada para atualizar o histórico
    onRollComplete?.()
  }

  useEffect(() => {
    // Resetar quando o dialog fechar
    if (!isOpen) {
      hasRolledRef.current = false
      setResult(null)
      setShowResult(false)
      setIsRolling(false)
      return
    }

    // Só rolar se o dialog estiver aberto, não estiver rolando e não tiver resultado
    if (isOpen && !isRolling && !result && !hasRolledRef.current) {
      rollDice()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, categoryId])

  const handleClose = () => {
    setResult(null)
    setShowResult(false)
    setIsRolling(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rolando d20 - {categoryName}</DialogTitle>
          <DialogDescription>
            {isRolling ? "O dado está rolando..." : result ? "Resultado do sorteio:" : ""}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8 min-h-[300px]">
          {isRolling ? (
            <div className="w-full h-64 bg-gradient-to-b from-background to-muted/20 rounded-lg overflow-hidden">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-muted-foreground">Carregando...</div>
                </div>
              }>
                <Canvas
                  camera={{ position: [0, 0, 4], fov: 50 }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, 2]}
                >
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                  <directionalLight position={[-5, -5, -5]} intensity={0.4} />
                  <pointLight position={[0, 5, 0]} intensity={0.6} />
                  <D20Mesh isRolling={isRolling} targetFace={targetFace} />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!isRolling}
                    autoRotateSpeed={0.5}
                    enableDamping
                    dampingFactor={0.05}
                  />
                  <Environment preset="sunset" />
                </Canvas>
              </Suspense>
            </div>
          ) : showResult && result ? (
            <div className="w-full space-y-4 animate-in fade-in duration-500">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{result.name}</h3>
                {result.rarity && (
                  <Badge variant="secondary">{result.rarity}</Badge>
                )}
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{result.description}</p>
              </div>
              {result.weight && (
                <div className="text-center text-xs text-muted-foreground">
                  Peso: {result.weight}
                </div>
              )}
              <Button
                onClick={() => {
                  hasRolledRef.current = false
                  rollDice()
                }}
                className="w-full mt-4"
              >
                Rolar Novamente
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}


