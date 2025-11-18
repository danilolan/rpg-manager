import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface NumberInputProps {
  value: number | null
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  className?: string
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  placeholder = '0',
  className = '',
}: NumberInputProps) {
  const handleIncrement = () => {
    const currentValue = value ?? 0
    const newValue = Math.min(currentValue + step, max)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const currentValue = value ?? 0
    const newValue = Math.max(currentValue - step, min)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      onChange(0)
      return
    }
    const numValue = parseInt(inputValue)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue))
      onChange(clampedValue)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
      <Input
        type="number"
        value={value ?? ''}
        onChange={handleInputChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="text-center text-3xl! font-bold h-17 w-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
      />
    </div>
  )
}

