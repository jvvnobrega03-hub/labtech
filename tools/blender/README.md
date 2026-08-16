# Produção cinematográfica da centrífuga

Esta pasta contém uma cena Blender totalmente procedural e reproduzível. Nenhum
vídeo gerado por IA é usado pela Hero final.

## Saídas

- `output/labtech_centrifuge.blend`: cena editável.
- `public/videos/centrifuge-intro.mp4`: inicialização única, quadros 1–144.
- `public/videos/centrifuge-robot-loop.mp4`: ciclo robótico, quadros 145–288.
- `public/videos/centrifuge-robot-loop.webm`: alternativa VP9 para a Hero.
- `public/images/centrifuge-poster.webp`: fallback estático.

O quadro 145 e o quadro 288 usam a mesma pose de câmera, centrífuga, robô e
tubo. O validador também confirma que o rotor e a tampa permanecem estáveis no
loop e que apenas um tubo interativo troca de vínculo entre centrífuga e garra.

## Gerar a cena

No PowerShell, a partir da raiz do projeto:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python tools\blender\build_scene.py
```

## Renderizar uma prévia

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' tools\blender\output\labtech_centrifuge.blend --background --python tools\blender\render.py -- --segment preview
```

As imagens de inspeção ficam em `tools/blender/output/frames/preview/`.

## Renderizar e codificar todos os assets

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' tools\blender\output\labtech_centrifuge.blend --background --python tools\blender\render.py -- --segment all --ffmpeg 'C:\caminho\para\ffmpeg.exe'
```

O script usa Eevee, 1920 × 1080, 24 fps, H.264 com `faststart` e VP9. Para
alterar a direção de arte, ajuste os módulos `build_lab.py`,
`build_centrifuge.py`, `build_robot.py` e `build_animation.py`, reconstrua a
cena e execute o validador antes do render final.

## Validar uma cena já aberta

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' tools\blender\output\labtech_centrifuge.blend --background --python tools\blender\validate_scene.py
```
