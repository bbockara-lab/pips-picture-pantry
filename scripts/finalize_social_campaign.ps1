param(
  [string]$CampaignDir = "store-assets/social-campaigns/launch-2026"
)

Add-Type -AssemblyName System.Drawing

$items = @(
  @{ In="01-meet-pip-art.png"; Out="01-meet-pip.png"; Kicker="PIP'S PICTURE PANTRY"; Head="Meet Pip."; Sub="Solve a picture. Warm the pantry." },
  @{ In="02-hidden-picture-art.png"; Out="02-hidden-picture.png"; Kicker="COZY PICTURE PUZZLES"; Head="Every grid hides"; Sub="a cozy little picture." },
  @{ In="03-fill-the-shelves-art.png"; Out="03-fill-the-shelves.png"; Kicker="COLLECT & DISPLAY"; Head="Fill every shelf"; Sub="with something lovely." },
  @{ In="04-nine-keepsakes-art.png"; Out="04-nine-keepsakes.png"; Kicker="PIP'S BADGE SHELF"; Head="Nine keepsakes."; Sub="One growing pantry." },
  @{ In="05-grandpa-clock-art.png"; Out="05-grandpa-clock.png"; Kicker="TIME ATTACK"; Head="Beat the clock."; Sub="Keep the cozy." },
  @{ In="06-quiet-puzzle-break-art.png"; Out="06-quiet-puzzle-break.png"; Kicker="YOUR QUIET PUZZLE BREAK"; Head="Slow down with Pip."; Sub="One warm picture at a time." }
)

function New-Font([float]$size, [System.Drawing.FontStyle]$style) {
  $families = @("Arial Rounded MT Bold", "Trebuchet MS", "Arial")
  foreach ($family in $families) {
    try { return [System.Drawing.Font]::new($family, $size, $style, [System.Drawing.GraphicsUnit]::Pixel) } catch {}
  }
  return [System.Drawing.Font]::new([System.Drawing.FontFamily]::GenericSansSerif, $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

foreach ($item in $items) {
  $inputPath = Join-Path $CampaignDir $item.In
  $outputPath = Join-Path $CampaignDir $item.Out
  $source = [System.Drawing.Image]::FromFile((Resolve-Path $inputPath))
  try {
    $canvas = [System.Drawing.Bitmap]::new($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    try {
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
      $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
      $g.DrawImage($source, 0, 0, $source.Width, $source.Height)

      $w = $source.Width
      $h = $source.Height
      $topH = [int]($h * 0.205)
      $bottomH = [int]($h * 0.145)
      $topRect = [System.Drawing.Rectangle]::new(0, 0, $w, $topH)
      $bottomRect = [System.Drawing.Rectangle]::new(0, $h - $bottomH, $w, $bottomH)
      $topBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($topRect, [System.Drawing.Color]::FromArgb(242,255,249,229), [System.Drawing.Color]::FromArgb(185,255,249,229), 90)
      $bottomBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($bottomRect, [System.Drawing.Color]::FromArgb(160,54,36,27), [System.Drawing.Color]::FromArgb(235,54,36,27), 90)
      $g.FillRectangle($topBrush, $topRect)
      $g.FillRectangle($bottomBrush, $bottomRect)

      $kickerFont = New-Font ([Math]::Round($w * 0.027)) ([System.Drawing.FontStyle]::Bold)
      $headFont = New-Font ([Math]::Round($w * 0.078)) ([System.Drawing.FontStyle]::Bold)
      $subFont = New-Font ([Math]::Round($w * 0.038)) ([System.Drawing.FontStyle]::Bold)
      try {
        $center = [System.Drawing.StringFormat]::new()
        $center.Alignment = [System.Drawing.StringAlignment]::Center
        $center.LineAlignment = [System.Drawing.StringAlignment]::Center
        $ink = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255,67,45,35))
        $gold = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255,181,112,28))
        $cream = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255,255,247,224))
        try {
          $g.DrawString($item.Kicker, $kickerFont, $gold, [System.Drawing.RectangleF]::new(45, 22, $w-90, 55), $center)
          $g.DrawString($item.Head, $headFont, $ink, [System.Drawing.RectangleF]::new(38, 72, $w-76, $topH-82), $center)
          $g.DrawString($item.Sub, $subFont, $cream, [System.Drawing.RectangleF]::new(45, $h-$bottomH+15, $w-90, $bottomH-30), $center)
        } finally { $ink.Dispose(); $gold.Dispose(); $cream.Dispose(); $center.Dispose() }
      } finally { $kickerFont.Dispose(); $headFont.Dispose(); $subFont.Dispose(); $topBrush.Dispose(); $bottomBrush.Dispose() }
      $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $g.Dispose(); $canvas.Dispose() }
  } finally { $source.Dispose() }
}

Write-Output "Finalized $($items.Count) social campaign images in $CampaignDir"
