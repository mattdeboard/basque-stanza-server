import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { SentencePair, Alignment } from '../types/alignment'

interface TokenPosition {
  id: string
  x: number
  y: number
  width: number
  height: number
}

interface AlignmentVisualizerProps {
  sentencePair: SentencePair
}

export function AlignmentVisualizer({ sentencePair }: AlignmentVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sourcePositions, setSourcePositions] = useState<TokenPosition[]>([])
  const [targetPositions, setTargetPositions] = useState<TokenPosition[]>([])
  const [hoveredTokens, setHoveredTokens] = useState<Set<string>>(new Set())
  const [highlightedAlignments, setHighlightedAlignments] = useState<Set<number>>(new Set())

  const updateTokenPositions = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    
    // Get source token positions
    const sourceTokens = container.querySelectorAll('[data-token-type="source"]')
    const newSourcePositions: TokenPosition[] = []
    sourceTokens.forEach((token) => {
      const rect = token.getBoundingClientRect()
      const id = token.getAttribute('data-token-id')
      if (id) {
        newSourcePositions.push({
          id,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.bottom - containerRect.top,
          width: rect.width,
          height: rect.height,
        })
      }
    })

    // Get target token positions  
    const targetTokens = container.querySelectorAll('[data-token-type="target"]')
    const newTargetPositions: TokenPosition[] = []
    targetTokens.forEach((token) => {
      const rect = token.getBoundingClientRect()
      const id = token.getAttribute('data-token-id')
      if (id) {
        newTargetPositions.push({
          id,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        })
      }
    })

    setSourcePositions(newSourcePositions)
    setTargetPositions(newTargetPositions)
  }, [])

  useEffect(() => {
    updateTokenPositions()
    
    const handleResize = () => updateTokenPositions()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateTokenPositions, sentencePair])

  const handleTokenHover = useCallback((tokenId: string, isSource: boolean) => {
    const newHoveredTokens = new Set([tokenId])
    const newHighlightedAlignments = new Set<number>()

    sentencePair.layers.lexical.forEach((alignment, index) => {
      const isConnected = isSource 
        ? alignment.source.includes(tokenId)
        : alignment.target.includes(tokenId)
      
      if (isConnected) {
        newHighlightedAlignments.add(index)
        // Add connected tokens
        alignment.source.forEach(id => newHoveredTokens.add(id))
        alignment.target.forEach(id => newHoveredTokens.add(id))
      }
    })

    setHoveredTokens(newHoveredTokens)
    setHighlightedAlignments(newHighlightedAlignments)
  }, [sentencePair.layers.lexical])

  const handleTokenLeave = useCallback(() => {
    setHoveredTokens(new Set())
    setHighlightedAlignments(new Set())
  }, [])

  const createRibbonPath = (alignment: Alignment, index: number) => {
    // Find positions for source and target tokens
    const sourceTokenPositions = alignment.source
      .map(id => sourcePositions.find(pos => pos.id === id))
      .filter(Boolean) as TokenPosition[]
    
    const targetTokenPositions = alignment.target  
      .map(id => targetPositions.find(pos => pos.id === id))
      .filter(Boolean) as TokenPosition[]

    if (sourceTokenPositions.length === 0 || targetTokenPositions.length === 0) return null

    // Calculate center points
    const sourceX = sourceTokenPositions.reduce((sum, pos) => sum + pos.x, 0) / sourceTokenPositions.length
    const sourceY = sourceTokenPositions[0].y
    
    const targetX = targetTokenPositions.reduce((sum, pos) => sum + pos.x, 0) / targetTokenPositions.length  
    const targetY = targetTokenPositions[0].y

    // Create smooth bezier curve
    const controlY1 = sourceY + 60
    const controlY2 = targetY - 60
    
    const path = `M ${sourceX} ${sourceY} 
                  C ${sourceX} ${controlY1}, ${targetX} ${controlY2}, ${targetX} ${targetY}`

    const isHighlighted = highlightedAlignments.has(index)
    const isDimmed = highlightedAlignments.size > 0 && !isHighlighted

    return (
      <motion.path
        key={`ribbon-${index}`}
        d={path}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        className={`ribbon ${isHighlighted ? 'ribbon--highlighted' : ''} ${isDimmed ? 'ribbon--dimmed' : ''}`}
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ 
          pathLength: isHighlighted ? 1 : 0.8,
          opacity: isHighlighted ? 1 : (isDimmed ? 0.15 : 0.3)
        }}
        transition={{ 
          pathLength: { duration: 0.6, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
      />
    )
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Source Sentence */}
      <div className="px-8 py-6 bg-gray-50 rounded-t-lg mx-8">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          {sentencePair.source.lang.toUpperCase()}
        </div>
        <div className="text-lg text-slate-800 mb-4 italic">
          {sentencePair.source.text}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {sentencePair.source.tokens.map((token) => {
            const isHovered = hoveredTokens.has(token.id)
            const isDimmed = hoveredTokens.size > 0 && !isHovered
            
            return (
              <span
                key={token.id}
                className={`token ${isHovered ? 'token--highlighted' : ''} ${isDimmed ? 'token--dimmed' : ''}`}
                data-token-id={token.id}
                data-token-type="source"
                onMouseEnter={() => handleTokenHover(token.id, true)}
                onMouseLeave={handleTokenLeave}
              >
                {token.form}
              </span>
            )
          })}
        </div>
      </div>

      {/* Ribbon Space */}
      <div 
        className="h-ribbon-space relative flex items-center justify-center mx-8"
        style={{
          background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)'
        }}
      >
        {/* SVG Ribbons */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {sentencePair.layers.lexical.map((alignment, index) =>
            createRibbonPath(alignment, index)
          )}
        </svg>
        
        {/* Debug info */}
        <div className="text-center text-gray-500 relative z-10">
          <p className="text-sm mb-2">
            Ribbons connecting "{sentencePair.source.text}" to "
            {sentencePair.target.text}"
          </p>
          <p className="text-xs font-semibold text-ribbon-blue">
            Lexical alignments: {sentencePair.layers.lexical.length}
          </p>
        </div>
      </div>

      {/* Target Sentence */}
      <div className="px-8 py-6 bg-gray-50 rounded-b-lg mx-8">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          {sentencePair.target.lang.toUpperCase()}
        </div>
        <div className="text-lg text-slate-800 mb-4 italic">
          {sentencePair.target.text}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {sentencePair.target.tokens.map((token) => {
            const isHovered = hoveredTokens.has(token.id)
            const isDimmed = hoveredTokens.size > 0 && !isHovered
            
            return (
              <span
                key={token.id}
                className={`token ${isHovered ? 'token--highlighted' : ''} ${isDimmed ? 'token--dimmed' : ''}`}
                data-token-id={token.id}
                data-token-type="target"
                onMouseEnter={() => handleTokenHover(token.id, false)}
                onMouseLeave={handleTokenLeave}
              >
                {token.form}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}