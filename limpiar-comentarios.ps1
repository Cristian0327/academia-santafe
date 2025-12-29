$files = Get-ChildItem -Path "e:\Chamba\Pagina Educativa\academia-santafe" -Recurse -Include *.ts,*.tsx,*.js,*.jsx -File | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*.next*" 
}

foreach($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace '(?m)^\s*//.*$', ''
    $content = $content -replace '/\*[\s\S]*?\*/', ''
    $content = $content -replace '(?m)^\s*$\n', ''
    Set-Content $file.FullName -Value $content -NoNewline
}

Write-Host "✅ Comentarios eliminados de $($files.Count) archivos"
