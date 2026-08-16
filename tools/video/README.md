# Hero com a filmagem real da centrífuga

O script `build_real_centrifuge_assets.py` usa apenas quadros do filme de
produto fornecido. Ele registra o movimento residual de câmera no plano do
laboratório, cria uma emenda circular de seis quadros e gera MP4, WebM e poster
para a Hero. O ciclo validado é repetido seis vezes dentro de cada arquivo de
loop para reduzir a frequência de seeks do navegador e evitar microtravadas.

Dependência de produção dos assets:

```powershell
python -m pip install opencv-python-headless
```

Execução:

```powershell
python tools\video\build_real_centrifuge_assets.py `
  'C:\caminho\para\filme.mp4' `
  --ffmpeg 'C:\caminho\para\ffmpeg.exe'
```

Saídas:

- `public/videos/centrifuge-film-intro.mp4`
- `public/videos/centrifuge-film-intro.webm`
- `public/videos/centrifuge-spin-loop.mp4`
- `public/videos/centrifuge-spin-loop.webm`
- `public/images/centrifuge-film-poster.webp`
