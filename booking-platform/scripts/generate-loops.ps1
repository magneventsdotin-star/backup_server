$inDir = "C:\Users\avani\Downloads\HerSec Videos"
$outDir = "C:\Users\avani\Desktop\mainserver\magnevents-platform\booking-platform\public\assets\hero-gifs"

$files = Get-ChildItem -Path $inDir -Filter "*.mp4"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    
    # Remove extension and spaces for output names
    $baseName = $file.BaseName.Replace(" ", "_")
    $outMp4 = Join-Path $outDir "$($baseName).mp4"
    $outWebm = Join-Path $outDir "$($baseName).webm"

    # We removed webm generation since mp4 is widely supported and much faster to encode
    ffmpeg -y -ss 00:00:03 -i $file.FullName -t 5 -c:v libx264 -preset veryfast -crf 20 -an $outMp4
}

Write-Host "Done generating loops!"
