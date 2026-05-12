# ONOMATOPEIA DJ 2000 🎵

Uma ferramenta de DJ / Launchpad estilo Y2K (anos 2000) para apresentações de inglês sobre Onomatopoeia. Desenvolvida com React, Vite, Tone.js e estética cyberpunk neon maximalist.

## Características Principais

### 🎛️ Launchpad 4x4
16 pads coloridos com sons pré-carregados de Minecraft. Cada pad tem uma cor neon diferente e pode ser tocado com mouse, touch ou teclado.

**Sons Pré-Carregados:**
- DOG BARK! (Magenta)
- BOOM! (Vermelho)
- SPLASH! (Cyan)
- CRUNCH! (Amarelo)
- E mais 12 variações com diferentes cores neon

### 🎚️ Decks Virtuais Giratórios
Dois decks estilo vinil com:
- Animação de rotação contínua
- Visualização de waveform em tempo real
- Indicação de som carregado
- Cores neon (Cyan para Deck A, Magenta para Deck B)

### 🎙️ Mixer Global
- Controle de volume master (0-100%)
- Botão Start/Stop Mix
- Gravação de mix em WebM
- Upload de novos sons (MP3/WAV)

### 🎛️ Painel de Remix
Controles por som:
- **Pitch Shift**: ±12 semitons
- **Speed**: 0.5x até 2x
- **Reverb**: 0-100%
- **Delay**: 0-100%
- **Volume Individual**: 0-100%
- **Loop Toggle**: On/Off

### ⌨️ Suporte a Teclado
Mapeamento de teclas para tocar pads:
- **1-9**: Primeiros 9 pads
- **Q-P**: Pads 1-9
- **A-H**: Pads 10-16

### 📱 Responsivo
Funciona perfeitamente em:
- Desktop (navegadores modernos)
- Tablet (touch-friendly)
- Projetor (fullscreen)
- Celular (interface adaptativa)

## Estética Y2K

A interface foi desenvolvida com a filosofia de design **Y2K Cyberpunk Maximalist**:

- **Fundo Gradient**: Preto → Roxo Profundo → Preto
- **Cores Neon Vibrantes**: Cyan, Magenta, Amarelo, Verde Limão, Vermelho
- **Glows Intensos**: Múltiplas camadas de box-shadow neon
- **Animações Dinâmicas**: Pulsação, rotação, escala
- **Fontes Bold**: Bungee e Righteous para máximo impacto
- **Efeito Scanlines**: Linhas horizontais sutis para efeito retrô

## Como Usar

### Instalação Local

```bash
# Clonar o repositório
git clone https://github.com/Thales971/DJ-TOOL.git
cd DJ-TOOL

# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

### Usando o App

1. **Tocar Sons**: Clique em qualquer pad ou pressione as teclas mapeadas
2. **Carregar Deck**: Clique com botão direito em um pad para carregar nos decks
3. **Ajustar Efeitos**: Clique em um pad para abrir o painel de remix
4. **Upload de Som**: Use o botão "UPLOAD SOUND" para adicionar novos áudios
5. **Gravar Mix**: Clique em "Record" para começar a gravar, clique novamente para parar e baixar

### Apresentação em Sala de Aula

```
Frases de Exemplo:
"The dog barked loudly." → Toque DOG BARK!
"Crash! Splash! Boom!" → Toque BOOM!, SPLASH!, BOOM!
"Crunch, crunch, crunch, his feet on the snow." → Toque CRUNCH! 3x
```

## Stack Técnico

- **React 19**: Framework UI
- **Vite**: Build tool e dev server
- **Tailwind CSS 4**: Styling
- **Tone.js 15**: Síntese de áudio e efeitos
- **Wavesurfer.js 7**: Visualização de waveform
- **Lucide React**: Ícones
- **TypeScript**: Type safety

## Arquitetura de Componentes

```
src/
├── components/
│   ├── Pad.tsx           # Botão individual do launchpad
│   ├── Deck.tsx          # Vinil giratório com waveform
│   ├── Mixer.tsx         # Controles globais
│   └── RemixPanel.tsx    # Efeitos por som
├── pages/
│   └── Home.tsx          # App principal com Tone.js
└── index.css             # Estilos Y2K globais
```

## Funcionalidades de Áudio

### Tone.js Engine
- **Player**: Reprodução de áudio com loop e playback rate
- **PitchShift**: Mudança de tom em tempo real
- **Reverb**: Efeito de reverberação
- **FeedbackDelay**: Efeito de delay com feedback
- **Gain**: Controle de volume por som e master
- **Recorder**: Gravação do mix em WebM

### Cadeia de Efeitos
Cada som passa por:
1. Gain (volume individual)
2. PitchShift (pitch shift)
3. FeedbackDelay (delay)
4. Reverb (reverberação)
5. Master Gain (volume global)

## Melhorias em Relação ao Protótipo

- ✅ Sons funcionam perfeitamente com Tone.js
- ✅ Efeitos em tempo real (pitch, reverb, delay)
- ✅ Visualização de waveform animada
- ✅ Interface Y2K muito mais épica
- ✅ Suporte completo a teclado
- ✅ Upload de novos sons
- ✅ Gravação de mix
- ✅ Decks giratórios com animação
- ✅ Responsividade total
- ✅ Código limpo e modular

## Deployment

### GitHub Pages
```bash
pnpm build
# Configurar no GitHub Pages para usar a branch main
```

### Manus WebDev
O projeto está pronto para ser publicado no Manus WebDev com um clique.

## Troubleshooting

### Sons não tocam
- Certifique-se de que o áudio do navegador está ativado
- Clique em qualquer lugar da página primeiro (requerimento do navegador)
- Verifique o console do navegador para erros

### Efeitos não funcionam
- Recarregue a página
- Verifique se o Tone.js foi carregado corretamente

### Gravação não funciona
- Use um navegador moderno (Chrome, Firefox, Edge)
- Certifique-se de que o navegador tem permissão para acessar áudio

## Créditos

- **Desenvolvido por**: Manus AI
- **Inspiração**: Launchpad Novation, Tron: Legacy, Daft Punk
- **Sons**: Minecraft sound effects
- **Tecnologia**: React, Tone.js, Tailwind CSS

## Licença

MIT License - Sinta-se livre para usar, modificar e distribuir.

---

**ONOMATOPEIA DJ 2000 © Y2K VIBES** 🎵✨
