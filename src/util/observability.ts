
export const measurePerf = function(identifier: string): () => void {
  performance.mark(identifier + '-start')
  return () => {
    performance.mark(identifier + '-end')
    const m = performance.measure(identifier, identifier + '-start', identifier + '-end')
    console.log(`${identifier} took ${m.duration}`)
  }
}
