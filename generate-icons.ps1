# 產生 PWA 用 PNG 圖示 (PowerShell 5.1 + System.Drawing)
# 風格：深色背景 + 霓虹藍收音機圖案，與 icon.svg 風格一致

Add-Type -AssemblyName System.Drawing

$sizes = @(
    @{size=512; file="icon-512.png"},
    @{size=192; file="icon-192.png"},
    @{size=180; file="apple-touch-icon.png"}
)

function DrawRadioIcon($bitmap) {
    $w = $bitmap.Width
    $h = $bitmap.Height
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # 比例縮放因子
    $s = $w / 512.0

    # 1. 深色背景圓角矩形
    $bgBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.Point]::new(0, 0),
        [System.Drawing.Point]::new($w, $h),
        [System.Drawing.Color]::FromArgb(255, 9, 10, 15),
        [System.Drawing.Color]::FromArgb(255, 24, 26, 37)
    )
    $radius = [int](100 * $s)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $radius*2, $radius*2, 180, 90)
    $path.AddArc($w - $radius*2 - 1, 0, $radius*2, $radius*2, 270, 90)
    $path.AddArc($w - $radius*2 - 1, $h - $radius*2 - 1, $radius*2, $radius*2, 0, 90)
    $path.AddArc(0, $h - $radius*2 - 1, $radius*2, $radius*2, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bgBrush, $path)

    # 2. 霓虹藍外框 (發光效果)
    $penWidth = [int](12 * $s)
    if ($penWidth -lt 2) { $penWidth = 2 }
    $margin = [int](24 * $s)
    $neonBlue = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254), $penWidth)
    $neonBlueGlow = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(80, 0, 242, 254), $penWidth * 2)
    $innerRadius = [int](80 * $s)
    $g.DrawPath($neonBlueGlow, $path)
    $g.DrawPath($neonBlue, $path)

    # 3. 收音機提把
    $handlePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254), [int](12 * $s))
    $handlePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $handlePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($handlePen, 
        [int](180 * $s), [int](210 * $s),
        [int](180 * $s), [int](170 * $s))
    $g.DrawLine($handlePen, 
        [int](180 * $s), [int](170 * $s),
        [int](332 * $s), [int](170 * $s))
    $g.DrawLine($handlePen, 
        [int](332 * $s), [int](170 * $s),
        [int](332 * $s), [int](210 * $s))

    # 4. 天線
    $antennaPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254), [int](12 * $s))
    $antennaPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $antennaPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($antennaPen, 
        [int](256 * $s), [int](210 * $s),
        [int](160 * $s), [int](90 * $s))

    # 5. 天線頂端粉紅發光球
    $pinkGlow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 0, 127))
    $g.FillEllipse($pinkGlow, 
        [int](148 * $s), [int](78 * $s),
        [int](24 * $s), [int](24 * $s))

    # 6. 收音機機身
    $bodyBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 27, 30, 46))
    $bodyPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254), [int](12 * $s))
    $g.FillRectangle($bodyBrush, 
        [int](110 * $s), [int](210 * $s),
        [int](292 * $s), [int](190 * $s))
    $g.DrawRectangle($bodyPen, 
        [int](110 * $s), [int](210 * $s),
        [int](292 * $s), [int](190 * $s))

    # 7. 喇叭孔 (左側)
    $speakerOuter = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254), [int](6 * $s))
    $speakerInner = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254))
    $g.DrawEllipse($speakerOuter, 
        [int](145 * $s), [int](250 * $s),
        [int](110 * $s), [int](110 * $s))
    $g.FillEllipse($speakerInner, 
        [int](175 * $s), [int](280 * $s),
        [int](50 * $s), [int](50 * $s))

    # 8. 刻度面板 (右上)
    $panelBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 9, 10, 15))
    $panelPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254), [int](4 * $s))
    $g.FillRectangle($panelBrush, 
        [int](280 * $s), [int](245 * $s),
        [int](90 * $s), [int](35 * $s))
    $g.DrawRectangle($panelPen, 
        [int](280 * $s), [int](245 * $s),
        [int](90 * $s), [int](35 * $s))

    # 9. 刻度指針
    $pointerPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 255, 0, 127), [int](4 * $s))
    $g.DrawLine($pointerPen, 
        [int](310 * $s), [int](245 * $s),
        [int](310 * $s), [int](280 * $s))

    # 10. 控制旋鈕 (右下)
    $g.FillEllipse($pinkGlow, 
        [int](287 * $s), [int](317 * $s),
        [int](36 * $s), [int](36 * $s))
    $knobBlue = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 0, 242, 254))
    $g.FillEllipse($knobBlue, 
        [int](341 * $s), [int](321 * $s),
        [int](28 * $s), [int](28 * $s))

    $g.Dispose()
    return $bitmap
}

$outputDir = "C:\aiTest\listenTWNews"
foreach ($item in $sizes) {
    $size = $item.size
    $file = $item.file
    $path = Join-Path $outputDir $file
    
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $bmp.SetResolution(96, 96)
    $bmp = DrawRadioIcon $bmp
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    
    $fi = Get-Item $path
    Write-Host "✓ 已產生: $file ($($fi.Length) bytes, ${size}x${size})"
}