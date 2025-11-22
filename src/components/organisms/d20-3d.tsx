"use client"

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { IcosahedronGeometry, Vector3, Group, Euler, Quaternion } from 'three'
import { Text } from '@react-three/drei'

interface D20MeshProps {
  isRolling: boolean
  targetFace?: number | null
}

// Calcula os centros e normais das 20 faces do icosaedro
function getFaceCentersAndNormals() {
  const geometry = new IcosahedronGeometry(1, 0)
  const positions = geometry.attributes.position.array
  const faces: Array<{ center: Vector3; normal: Vector3 }> = []

  // Icosaedro tem 20 faces, cada face é um triângulo (3 vértices)
  for (let i = 0; i < positions.length; i += 9) {
    // Cada face tem 3 vértices, cada vértice tem x, y, z (9 valores totais)
    const v1 = new Vector3(positions[i], positions[i + 1], positions[i + 2])
    const v2 = new Vector3(positions[i + 3], positions[i + 4], positions[i + 5])
    const v3 = new Vector3(positions[i + 6], positions[i + 7], positions[i + 8])

    // Centro da face
    const center = new Vector3()
    center.add(v1).add(v2).add(v3).divideScalar(3)
    
    // Normal da face (perpendicular à face)
    const normal = new Vector3()
    const edge1 = new Vector3().subVectors(v2, v1)
    const edge2 = new Vector3().subVectors(v3, v1)
    normal.crossVectors(edge1, edge2).normalize()

    // Multiplicar por um pouco mais que 1 para colocar o texto na superfície
    center.multiplyScalar(1.02)

    faces.push({ center, normal })
  }

  geometry.dispose()
  return faces
}

export function D20Mesh({ isRolling, targetFace }: D20MeshProps) {
  const groupRef = useRef<Group>(null)
  const rotationSpeed = useRef({ x: 0, y: 0, z: 0 })
  const targetRotation = useRef<Quaternion | null>(null)
  const startRotation = useRef<Quaternion | null>(null)
  const animationProgress = useRef(0)
  const alignmentStarted = useRef(false)

  const faceData = useMemo(() => getFaceCentersAndNormals(), [])
  const geometry = useMemo(() => new IcosahedronGeometry(1, 0), [])
  const numbers = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), [])

  // Calcula a rotação necessária para que a face target fique para cima
  useEffect(() => {
    if (targetFace && faceData.length > 0) {
      const faceIndex = targetFace - 1 // Convertendo de 1-20 para 0-19
      if (faceIndex >= 0 && faceIndex < faceData.length) {
        const targetNormal = faceData[faceIndex].normal.clone()
        const up = new Vector3(0, 1, 0)
        
        // Normal da face no espaço do objeto (antes de qualquer rotação)
        // Precisamos calcular qual rotação leva essa normal para apontar para cima
        const quaternion = new Quaternion().setFromUnitVectors(targetNormal, up)
        targetRotation.current = quaternion
        animationProgress.current = 0
      }
    } else {
      targetRotation.current = null
    }
  }, [targetFace, faceData])

  // Inicia rotação aleatória quando começa a rolar
  useEffect(() => {
    if (isRolling) {
      // Velocidade inicial aleatória (sem acelerar)
      rotationSpeed.current = {
        x: (Math.random() - 0.5) * 0.6,
        y: (Math.random() - 0.5) * 0.6,
        z: (Math.random() - 0.5) * 0.6,
      }
      animationProgress.current = 0
      startRotation.current = null
      alignmentStarted.current = false
      
      // Resetar rotação inicial do dado
      if (groupRef.current) {
        groupRef.current.rotation.set(0, 0, 0)
      }
    }
  }, [isRolling])

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isRolling) {
        // Usar um timer para controlar quando começar a alinhar
        animationProgress.current += delta

        // Primeiros 2 segundos: rotação rápida e aleatória
        if (animationProgress.current < 2.0) {
          // Rotação rápida durante o roll
          groupRef.current.rotation.x += rotationSpeed.current.x
          groupRef.current.rotation.y += rotationSpeed.current.y
          groupRef.current.rotation.z += rotationSpeed.current.z
          
          // Reduz velocidade gradualmente (deceleração suave)
          rotationSpeed.current.x *= 0.97
          rotationSpeed.current.y *= 0.97
          rotationSpeed.current.z *= 0.97
        } else if (targetRotation.current) {
          // Depois de 2 segundos, começar a alinhar para a face target
          const timeFromStart = animationProgress.current - 2.0
          
          // Salvar a rotação inicial quando começar o alinhamento (apenas uma vez)
          if (!alignmentStarted.current && timeFromStart < 0.02) {
            startRotation.current = new Quaternion().setFromEuler(groupRef.current.rotation)
            alignmentStarted.current = true
          }
          
          if (startRotation.current) {
            const alignDuration = 0.5
            const alignProgress = Math.min(timeFromStart / alignDuration, 1)
            
            // Interpolar suavemente entre rotação inicial e target usando ease-in-out
            const t = alignProgress < 0.5 
              ? 2 * alignProgress * alignProgress 
              : 1 - Math.pow(-2 * alignProgress + 2, 2) / 2
            
            // Clone o quaternion inicial e interpole em direção ao target
            const finalQuat = startRotation.current.clone().slerp(targetRotation.current, t)
            groupRef.current.rotation.setFromQuaternion(finalQuat)
          }
          
          // Zerar velocidade rotacional
          rotationSpeed.current.x = 0
          rotationSpeed.current.y = 0
          rotationSpeed.current.z = 0
        }
      } else if (targetRotation.current) {
        // Forçar para a posição exata quando parou
        const currentQuat = new Quaternion().setFromEuler(groupRef.current.rotation)
        const targetQuat = targetRotation.current
        const distance = currentQuat.angleTo(targetQuat)
        if (distance > 0.001) {
          // Ainda não chegou, interpolar mais um pouco
          const finalQuat = currentQuat.clone().slerp(targetQuat, 0.3)
          groupRef.current.rotation.setFromQuaternion(finalQuat)
        } else {
          // Já chegou, usar diretamente
          groupRef.current.rotation.setFromQuaternion(targetQuat)
        }
      }
    }
  })


  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#e0e0e0"
          metalness={0.4}
          roughness={0.3}
          emissive="#2a2a2a"
        />
      </mesh>
      {/* Renderiza números em cada face */}
      {faceData.map((face, index) => {
        // A normal aponta para fora da face
        const normal = face.normal.clone()
        
        // O Text do drei renderiza na direção -Z por padrão (olhando para a câmera)
        // Precisamos rotacionar para que o texto olhe na direção da normal
        
        // Usar quaternion para calcular rotação
        const up = new Vector3(0, 1, 0)
        const defaultDirection = new Vector3(0, 0, -1) // Text renderiza nessa direção
        
        // Se a normal é muito próxima do up, usar um vetor auxiliar diferente
        if (Math.abs(normal.dot(up)) > 0.99) {
          const right = new Vector3(1, 0, 0)
          const quaternion = new Quaternion().setFromUnitVectors(defaultDirection, normal.clone().multiplyScalar(-1))
          const euler = new Euler().setFromQuaternion(quaternion)
          
          return (
            <Text
              key={index}
              position={[face.center.x, face.center.y, face.center.z]}
              rotation={[euler.x, euler.y, euler.z]}
              fontSize={0.25}
              color="#1a1a1a"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.012}
              outlineColor="#fff"
            >
              {numbers[index]}
            </Text>
          )
        }
        
        // Calcular quaternion para rotacionar de defaultDirection para -normal
        const targetDirection = normal.clone().multiplyScalar(-1).normalize()
        const quaternion = new Quaternion().setFromUnitVectors(defaultDirection, targetDirection)
        const euler = new Euler().setFromQuaternion(quaternion)

        return (
          <Text
            key={index}
            position={[face.center.x, face.center.y, face.center.z]}
            rotation={[euler.x, euler.y, euler.z]}
            fontSize={0.25}
            color="#1a1a1a"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.012}
            outlineColor="#fff"
          >
            {numbers[index]}
          </Text>
        )
      })}
    </group>
  )
}

