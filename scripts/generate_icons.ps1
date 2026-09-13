Add-Type -AssemblyName System.Drawing

$sizes = @(
    @{ width = 44;  height = 44;  name = "icon-44x44.png" },
    @{ width = 50;  height = 50;  name = "icon-50x50.png" },
    @{ width = 150; height = 150; name = "icon-150x150.png" },
    @{ width = 192; height = 192; name = "icon-192x192.png" },
    @{ width = 310; height = 150; name = "icon-310x150.png" },
    @{ width = 310; height = 310; name = "icon-310x310.png" },
    @{ width = 512; height = 512; name = "icon-512x512.png" }
)

$outDir = ".\public\icons"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

function Draw-RoundedRectangle([System.Drawing.Graphics]$g, [System.Drawing.Brush]$brush, [System.Drawing.Rectangle]$rect, [int]$radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $arc = New-Object System.Drawing.Rectangle $rect.X, $rect.Y, $diameter, $diameter

    $path.AddArc($arc, 180, 90)
    $arc.X = $rect.Right - $diameter
    $path.AddArc($arc, 270, 90)
    $arc.Y = $rect.Bottom - $diameter
    $path.AddArc($arc, 0, 90)
    $arc.X = $rect.Left
    $path.AddArc($arc, 90, 90)
    $path.CloseFigure()

    $g.FillPath($brush, $path)
    return $path
}

foreach ($s in $sizes) {
    $w = $s.width
    $h = $s.height
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $g.Clear([System.Drawing.Color]::Transparent)

    # 1. Base Squircle (Midnight Ocean Gradient)
    $bgRect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $bgRect,
        [System.Drawing.Color]::FromArgb(255, 37, 99, 235), # Royal Blue
        [System.Drawing.Color]::FromArgb(255, 15, 23, 42),  # Midnight Slate
        60.0
    )
    $radBg = [Math]::Max(8, [int]($h * 0.22))
    $bgPath = Draw-RoundedRectangle $g $bgBrush $bgRect $radBg

    # 2. Golden Rim Border
    $rimWidth = [Math]::Max(2, [int]($w * 0.038))
    $rimPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(240, 251, 191, 36), $rimWidth)
    $g.DrawPath($rimPen, $bgPath)

    if ($w -eq 310 -and $h -eq 150) {
        # Wide Banner: Golden W + WORD HUNT + Magnifying Glass
        $fontW = New-Object System.Drawing.Font("Segoe UI", 62, [System.Drawing.FontStyle]::Bold)
        $fontTitle = New-Object System.Drawing.Font("Segoe UI", 28, [System.Drawing.FontStyle]::Bold)
        $fontSub = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)

        $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 69, 26, 3))
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

        # Magnifying glass circle behind W
        $magPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 251, 191, 36), 6)
        $lensBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 14, 165, 233))
        $g.FillEllipse($lensBrush, 36, 26, 80, 80)
        $g.DrawEllipse($magPen, 36, 26, 80, 80)
        $g.DrawLine($magPen, 98, 88, 122, 112)

        # Draw 3D Golden W
        $g.DrawString("W", $fontW, $shadowBrush, 34, 16)
        $g.DrawString("W", $fontW, $goldBrush, 30, 12)

        # Draw Title
        $g.DrawString("WORD HUNT", $fontTitle, $shadowBrush, 137, 34)
        $g.DrawString("WORD HUNT", $fontTitle, $goldBrush, 135, 32)
        $g.DrawString("WINDOWS EDITION", $fontSub, $whiteBrush, 136, 82)
    } else {
        # Square Icons (44, 50, 150, 192, 310, 512)
        if ($w -gt 60) {
            # Magnifying Glass in background
            $magDia = [int]($w * 0.44)
            $magX = [int]($w * 0.38)
            $magY = [int]($h * 0.22)
            $magThickness = [Math]::Max(3, [int]($w * 0.04))
            $magPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 251, 191, 36), $magThickness)
            $lensBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(150, 14, 165, 233))
            
            $g.FillEllipse($lensBrush, $magX, $magY, $magDia, $magDia)
            $g.DrawEllipse($magPen, $magX, $magY, $magDia, $magDia)
            $g.DrawLine($magPen, ($magX + $magDia * 0.8), ($magY + $magDia * 0.8), ($magX + $magDia * 1.22), ($magY + $magDia * 1.22))
        }

        # Giant 3D Golden 'W'
        $fontSize = [int]($h * 0.62)
        $fontW = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold)
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

        $shadowOffset = [Math]::Max(2, [int]($h * 0.035))
        $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 69, 26, 3))
        $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))

        $g.DrawString("W", $fontW, $shadowBrush, [System.Drawing.RectangleF]::new(0, ($shadowOffset - $h * 0.04), $w, $h), $sf)
        $g.DrawString("W", $fontW, $goldBrush, [System.Drawing.RectangleF]::new(0, (-$h * 0.04), $w, $h), $sf)

        # Golden Star on top-right for sizes >= 100
        if ($w -ge 100) {
            $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 240, 138))
            $stX = $w * 0.80
            $stY = $h * 0.18
            $r1 = $w * 0.08
            $r2 = $w * 0.035
            $points = @(
                [System.Drawing.PointF]::new($stX, ($stY - $r1)),
                [System.Drawing.PointF]::new(($stX + $r2), ($stY - $r2)),
                [System.Drawing.PointF]::new(($stX + $r1), $stY),
                [System.Drawing.PointF]::new(($stX + $r2), ($stY + $r2)),
                [System.Drawing.PointF]::new($stX, ($stY + $r1)),
                [System.Drawing.PointF]::new(($stX - $r2), ($stY + $r2)),
                [System.Drawing.PointF]::new(($stX - $r1), $stY),
                [System.Drawing.PointF]::new(($stX - $r2), ($stY - $r2))
            )
            $g.FillPolygon($starBrush, $points)
        }
    }

    $outPath = Join-Path $outDir $s.name
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $outPath ($w x $h)"
}
