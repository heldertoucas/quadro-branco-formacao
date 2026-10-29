# Script de lançamento rápido para renderização de vídeo automatizada
param (
    [string]$Config = "render-config.json"
)

Write-Host "Iniciando renderizador de vídeo do Futuro Digital..." -ForegroundColor Cyan
node render-video.js $Config
