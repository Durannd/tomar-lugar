import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export default function Effects({ quality }: { quality: 'low' | 'high' }) {
  if (quality === 'low') {
    return (
      <EffectComposer multisampling={0}>
        <Vignette eskil={false} offset={0.3} darkness={0.75} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    )
  }
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={0.5} intensity={1.8} distanceFalloff={0.8} quality="low" halfRes />
      <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.45} mipmapBlur />
      <Vignette eskil={false} offset={0.3} darkness={0.8} />
      <SMAA />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
