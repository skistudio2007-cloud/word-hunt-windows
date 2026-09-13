Add-Type -AssemblyName System.Drawing

$outDir = ".\public\screenshots"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

function Draw-RoundedRectangle([System.Drawing.Graphics]$g, [System.Drawing.Brush]$brush, [System.Drawing.Rectangle]$rect, [int]$radius) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $diameter = [int]($radius * 2)
    $arc = [System.Drawing.Rectangle]::new([int]$rect.X, [int]$rect.Y, $diameter, $diameter)

    $path.AddArc($arc, 180, 90)
    $arc.X = [int]($rect.Right - $diameter)
    $path.AddArc($arc, 270, 90)
    $arc.Y = [int]($rect.Bottom - $diameter)
    $path.AddArc($arc, 0, 90)
    $arc.X = [int]$rect.Left
    $path.AddArc($arc, 90, 90)
    $path.CloseFigure()

    $g.FillPath($brush, $path)
    return $path
}

function Draw-RoundedOutline([System.Drawing.Graphics]$g, [System.Drawing.Pen]$pen, [System.Drawing.Rectangle]$rect, [int]$radius) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $diameter = [int]($radius * 2)
    $arc = [System.Drawing.Rectangle]::new([int]$rect.X, [int]$rect.Y, $diameter, $diameter)

    $path.AddArc($arc, 180, 90)
    $arc.X = [int]($rect.Right - $diameter)
    $path.AddArc($arc, 270, 90)
    $arc.Y = [int]($rect.Bottom - $diameter)
    $path.AddArc($arc, 0, 90)
    $arc.X = [int]$rect.Left
    $path.AddArc($arc, 90, 90)
    $path.CloseFigure()

    $g.DrawPath($pen, $path)
    return $path
}

function Draw-VectorStar([System.Drawing.Graphics]$g, [System.Drawing.Brush]$brush, [float]$cx, [float]$cy, [float]$rOuter, [float]$rInner) {
    $pts = New-Object System.Drawing.PointF[] 10
    $angle = - [Math]::PI / 2
    $step = [Math]::PI / 5
    for ($i = 0; $i -lt 10; $i++) {
        $r = if ($i % 2 -eq 0) { $rOuter } else { $rInner }
        $pts[$i] = New-Object System.Drawing.PointF ($cx + [Math]::Cos($angle) * $r), ($cy + [Math]::Sin($angle) * $r)
        $angle += $step
    }
    $g.FillPolygon($brush, $pts)
}

function Draw-VectorMagnifier([System.Drawing.Graphics]$g, [int]$x, [int]$y, [int]$size) {
    $lensR = [int]($size * 0.7)
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    $cyanBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 14, 165, 233))
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 255, 255, 255))
    $handlePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 217, 119, 6), ($size * 0.2))
    $handlePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $handlePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    # Handle
    $g.DrawLine($handlePen, ($x + $lensR * 0.8), ($y + $lensR * 0.8), ($x + $size), ($y + $size))

    # Rim
    $g.FillEllipse($goldBrush, $x, $y, $lensR, $lensR)
    # Glass
    $g.FillEllipse($cyanBrush, ($x + 8), ($y + 8), ($lensR - 16), ($lensR - 16))
    # Reflection
    $g.FillEllipse($whiteBrush, ($x + 16), ($y + 14), ($lensR * 0.35), ($lensR * 0.2))
}

function Draw-3DTile([System.Drawing.Graphics]$g, [string]$char, [string]$sub, [int]$x, [int]$y, [int]$size, [System.Drawing.Color]$col, [System.Drawing.Color]$shadowCol, [System.Drawing.Color]$txtCol) {
    $rad = [int]($size * 0.24)
    $extrude = [int]($size * 0.08)

    # 1. Bottom 3D shadow extrusion
    $sRect = [System.Drawing.Rectangle]::new([int]$x, [int]($y + $extrude), [int]$size, [int]$size)
    $sBrush = [System.Drawing.SolidBrush]::new($shadowCol)
    $null = Draw-RoundedRectangle $g $sBrush $sRect $rad

    # 2. Top Face
    $tRect = [System.Drawing.Rectangle]::new([int]$x, [int]$y, [int]$size, [int]$size)
    $tBrush = [System.Drawing.SolidBrush]::new($col)
    $null = Draw-RoundedRectangle $g $tBrush $tRect $rad

    # 3. Highlight rim border
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, 255, 255, 255), 3)
    $null = Draw-RoundedOutline $g $pen $tRect $rad

    # 4. Glossy top reflection
    $gRect = [System.Drawing.Rectangle]::new([int]($x + 4), [int]($y + 4), [int]($size - 8), [int]($size * 0.38))
    $gRad = [int]($rad * 0.8)
    $gBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(70, 255, 255, 255))
    $null = Draw-RoundedRectangle $g $gBrush $gRect $gRad

    # 5. Letter Text
    $fontSz = [int]($size * 0.52)
    $fontL = [System.Drawing.Font]::new("Segoe UI", $fontSz, [System.Drawing.FontStyle]::Bold)
    $txtB = [System.Drawing.SolidBrush]::new($txtCol)
    $sf = [System.Drawing.StringFormat]::new()
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($char, $fontL, $txtB, [System.Drawing.RectangleF]::new($x, ($y + 2), $size, $size), $sf)

    # 6. Subscript number if present
    if ($sub -ne "") {
        $fontSub = [System.Drawing.Font]::new("Segoe UI", [int]($size * 0.16), [System.Drawing.FontStyle]::Bold)
        $subB = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(180, $txtCol.R, $txtCol.G, $txtCol.B))
        $g.DrawString($sub, $fontSub, $subB, ($x + $size - 22), ($y + $size - 24))
    }
}

# ==============================================================================
# SCREENSHOT 1: HOME SCREEN HERO
# ==============================================================================
function Generate-Screenshot1 {
    $w = 1920
    $h = 1080
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Studio Background Gradient
    $bgRect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $bgRect,
        [System.Drawing.Color]::FromArgb(255, 241, 245, 249),
        [System.Drawing.Color]::FromArgb(255, 224, 242, 254),
        90.0
    )
    $g.FillRectangle($bgBrush, $bgRect)

    # Ambient Glowing Orbs
    $orb1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 59, 130, 246))
    $orb2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 245, 158, 11))
    $g.FillEllipse($orb1, -120, -120, 650, 650)
    $g.FillEllipse($orb2, 1400, 550, 650, 650)

    # Falling Background 3D Tiles
    Draw-3DTile $g "H" "" 80 180 65 ([System.Drawing.Color]::FromArgb(255, 168, 85, 247)) ([System.Drawing.Color]::FromArgb(255, 109, 40, 217)) ([System.Drawing.Color]::White)
    Draw-3DTile $g "U" "" 260 700 68 ([System.Drawing.Color]::FromArgb(255, 245, 158, 11)) ([System.Drawing.Color]::FromArgb(255, 180, 83, 9)) ([System.Drawing.Color]::White)
    Draw-3DTile $g "N" "" 1700 220 72 ([System.Drawing.Color]::FromArgb(255, 14, 165, 233)) ([System.Drawing.Color]::FromArgb(255, 3, 105, 161)) ([System.Drawing.Color]::White)
    Draw-3DTile $g "T" "" 1550 680 64 ([System.Drawing.Color]::FromArgb(255, 16, 185, 129)) ([System.Drawing.Color]::FromArgb(255, 4, 120, 87)) ([System.Drawing.Color]::White)

    $goldB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
    Draw-VectorStar $g $goldB 380 160 22 10
    Draw-VectorStar $g $goldB 1500 140 26 12
    Draw-VectorStar $g $goldB 1780 750 20 9

    # Top Navigation Card
    $headerRect = [System.Drawing.Rectangle]::new(160, 40, 1600, 75)
    $whiteB = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $null = Draw-RoundedRectangle $g $whiteB $headerRect 20
    $penBorder = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 226, 232, 240), 2)
    $null = Draw-RoundedOutline $g $penBorder $headerRect 20

    $fontBrand = [System.Drawing.Font]::new("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
    $fontSub = [System.Drawing.Font]::new("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
    $blueB = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 37, 99, 235))
    $darkB = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 15, 23, 42))

    $g.DrawString("WORD HUNT", $fontBrand, $blueB, 200, 60)
    $g.DrawString("WINDOWS 10 / 11 EDITION", $fontSub, $darkB, 410, 68)

    # Stars counter in top right
    Draw-VectorStar $g $goldB 1530 75 14 7
    $g.DrawString("10,000+ LEVELS", $fontSub, $goldB, 1555, 68)

    # 4 Authentic Main 3D Letter Tiles: [W] [O] [R] [D]
    $tX = 640
    $tY = 240
    $tSize = 135
    $gap = 35

    Draw-3DTile $g "W" "4" ($tX + 0*($tSize+$gap)) $tY $tSize ([System.Drawing.Color]::FromArgb(255, 251, 191, 36)) ([System.Drawing.Color]::FromArgb(255, 180, 83, 9)) ([System.Drawing.Color]::FromArgb(255, 120, 53, 15))
    Draw-3DTile $g "O" "1" ($tX + 1*($tSize+$gap)) $tY $tSize ([System.Drawing.Color]::FromArgb(255, 244, 63, 94)) ([System.Drawing.Color]::FromArgb(255, 159, 18, 57)) ([System.Drawing.Color]::White)
    Draw-3DTile $g "R" "1" ($tX + 2*($tSize+$gap)) $tY $tSize ([System.Drawing.Color]::FromArgb(255, 16, 185, 129)) ([System.Drawing.Color]::FromArgb(255, 4, 120, 87)) ([System.Drawing.Color]::White)
    Draw-3DTile $g "D" "2" ($tX + 3*($tSize+$gap)) $tY $tSize ([System.Drawing.Color]::FromArgb(255, 14, 165, 233)) ([System.Drawing.Color]::FromArgb(255, 3, 105, 161)) ([System.Drawing.Color]::White)

    # Overlaid Golden Search Magnifier
    Draw-VectorMagnifier $g ($tX + 3*($tSize+$gap) + 60) ($tY - 30) 95

    # Main Typography: "WORD HUNT"
    $fontHero = [System.Drawing.Font]::new("Segoe UI", 68, [System.Drawing.FontStyle]::Bold)
    $fontHeroSub = [System.Drawing.Font]::new("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)
    $sfCenter = [System.Drawing.StringFormat]::new()
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center

    $g.DrawString("WORD HUNT", $fontHero, $blueB, [System.Drawing.RectangleF]::new(0, 420, $w, 90), $sfCenter)
    $g.DrawString("Word Search Adventure  |  10,000+ Progressive Levels  |  9 Languages", $fontHeroSub, $darkB, [System.Drawing.RectangleF]::new(0, 520, $w, 50), $sfCenter)

    # Main "PLAY LEVEL 1" 3D Button
    $btnRect = [System.Drawing.Rectangle]::new(710, 610, 500, 95)
    $btnBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        $btnRect,
        [System.Drawing.Color]::FromArgb(255, 37, 99, 235),
        [System.Drawing.Color]::FromArgb(255, 79, 70, 229),
        90.0
    )
    $null = Draw-RoundedRectangle $g $btnBrush $btnRect 28

    # Play Icon triangle
    $playPts = @(
        [System.Drawing.PointF]::new(850, 642),
        [System.Drawing.PointF]::new(850, 672),
        [System.Drawing.PointF]::new(875, 657)
    )
    $g.FillPolygon($whiteB, $playPts)

    $fontBtn = [System.Drawing.Font]::new("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("PLAY LEVEL 1", $fontBtn, $whiteB, 890, 638)

    # 3 Bottom Feature Badges
    $badgeY = 760
    $badges = @(
        @{ title = "100% Offline Ready"; desc = "Play anywhere without WiFi"; x = 280; col = [System.Drawing.Color]::FromArgb(255, 16, 185, 129) },
        @{ title = "Zero Ads & Purchases"; desc = "100% Safe family gameplay"; x = 740; col = [System.Drawing.Color]::FromArgb(255, 37, 99, 235) },
        @{ title = "12 Mystical Worlds"; desc = "Progressive brain challenges"; x = 1200; col = [System.Drawing.Color]::FromArgb(255, 245, 158, 11) }
    )

    $fontBTitle = [System.Drawing.Font]::new("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
    $fontBDesc = [System.Drawing.Font]::new("Segoe UI", 13, [System.Drawing.FontStyle]::Regular)

    foreach ($b in $badges) {
        $bRect = [System.Drawing.Rectangle]::new($b.x, $badgeY, 440, 110)
        $null = Draw-RoundedRectangle $g $whiteB $bRect 22
        $null = Draw-RoundedOutline $g $penBorder $bRect 22

        # Checkmark circle
        $cBrush = [System.Drawing.SolidBrush]::new($b.col)
        $g.FillEllipse($cBrush, ($b.x + 25), ($badgeY + 35), 40, 40)
        $checkPen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, 3)
        $g.DrawLine($checkPen, ($b.x + 35), ($badgeY + 55), ($b.x + 43), ($badgeY + 63))
        $g.DrawLine($checkPen, ($b.x + 43), ($badgeY + 63), ($b.x + 55), ($badgeY + 47))

        $g.DrawString($b.title, $fontBTitle, $darkB, ($b.x + 80), ($badgeY + 28))
        $g.DrawString($b.desc, $fontBDesc, [System.Drawing.Brushes]::Gray, ($b.x + 80), ($badgeY + 60))
    }

    $bmp.Save(".\public\screenshots\desktop-1.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: desktop-1.png (Home Screen)"
}

# ==============================================================================
# SCREENSHOT 2: GAMEPLAY & LETTER GRID SCREEN
# ==============================================================================
function Generate-Screenshot2 {
    $w = 1920
    $h = 1080
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $bgRect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $bgRect,
        [System.Drawing.Color]::FromArgb(255, 248, 250, 252),
        [System.Drawing.Color]::FromArgb(255, 238, 242, 255),
        90.0
    )
    $g.FillRectangle($bgBrush, $bgRect)

    # Top Header
    $headerRect = [System.Drawing.Rectangle]::new(120, 30, 1680, 80)
    $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $null = Draw-RoundedRectangle $g $whiteBrush $headerRect 20
    $penBorder = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 226, 232, 240), 2)
    $null = Draw-RoundedOutline $g $penBorder $headerRect 20

    $fontNav = [System.Drawing.Font]::new("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
    $darkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $blueBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 37, 99, 235))
    $goldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 245, 158, 11))

    $g.DrawString("ESC", $fontNav, $darkBrush, 160, 55)

    $sfCenter = [System.Drawing.StringFormat]::new()
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("LEVEL 1 - ANIMALS", $fontNav, $blueBrush, [System.Drawing.RectangleF]::new(0, 55, $w, 40), $sfCenter)

    # Stars in top right
    Draw-VectorStar $g $goldBrush 1520 68 14 7
    $g.DrawString("3 STARS", $fontNav, $goldBrush, 1545, 55)

    # Hints badge
    $hintBadge = [System.Drawing.Rectangle]::new(1660, 50, 115, 40)
    $hintBBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 254, 243, 199))
    $null = Draw-RoundedRectangle $g $hintBBrush $hintBadge 12
    $fontHintB = [System.Drawing.Font]::new("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("HINT (1)", $fontHintB, $goldBrush, 1680, 60)

    # Left: 6x6 Letter Grid Board
    $gridCard = [System.Drawing.Rectangle]::new(120, 140, 980, 880)
    $null = Draw-RoundedRectangle $g $whiteBrush $gridCard 30
    $null = Draw-RoundedOutline $g $penBorder $gridCard 30

    $sampleGrid = @(
        @("L", "I", "O", "N", "S", "X"),
        @("T", "I", "G", "E", "R", "Y"),
        @("B", "E", "A", "R", "P", "Z"),
        @("W", "O", "L", "F", "K", "A"),
        @("D", "O", "G", "C", "A", "T"),
        @("E", "A", "G", "L", "E", "M")
    )

    $cellW = 115
    $gap = 16
    $gridStartX = 175
    $gridStartY = 190
    $fontCell = [System.Drawing.Font]::new("Segoe UI", 34, [System.Drawing.FontStyle]::Bold)

    for ($r = 0; $r -lt 6; $r++) {
        for ($c = 0; $c -lt 6; $c++) {
            $cx = $gridStartX + ($c * ($cellW + $gap))
            $cy = $gridStartY + ($r * ($cellW + $gap))
            $cellRect = [System.Drawing.Rectangle]::new($cx, $cy, $cellW, $cellW)

            # Highlight found word row 0 (LION)
            if ($r -eq 0 -and $c -le 3) {
                $hlBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 191, 219, 254))
                $null = Draw-RoundedRectangle $g $hlBrush $cellRect 18
                $txtB = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 30, 58, 138))
            } elseif ($r -eq 1 -and $c -le 4) {
                # TIGER in green
                $hlBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 167, 243, 208))
                $null = Draw-RoundedRectangle $g $hlBrush $cellRect 18
                $txtB = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 6, 95, 70))
            } else {
                $cBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
                $null = Draw-RoundedRectangle $g $cBrush $cellRect 18
                $txtB = $darkBrush
            }
            $null = Draw-RoundedOutline $g $penBorder $cellRect 18
            $g.DrawString($sampleGrid[$r][$c], $fontCell, $txtB, [System.Drawing.RectangleF]::new($cx, ($cy + 20), $cellW, $cellW), $sfCenter)
        }
    }

    # Right: Words Card
    $wordsCard = [System.Drawing.Rectangle]::new(1140, 140, 660, 880)
    $null = Draw-RoundedRectangle $g $whiteBrush $wordsCard 30
    $null = Draw-RoundedOutline $g $penBorder $wordsCard 30

    $fontSideTitle = [System.Drawing.Font]::new("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("TARGET WORDS (2 / 6)", $fontSideTitle, $darkBrush, 1180, 180)

    # Progress bar
    $barBg = [System.Drawing.Rectangle]::new(1180, 240, 580, 22)
    $barBgBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 226, 232, 240))
    $null = Draw-RoundedRectangle $g $barBgBrush $barBg 11

    $barFill = [System.Drawing.Rectangle]::new(1180, 240, 195, 22)
    $barFillBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 37, 99, 235))
    $null = Draw-RoundedRectangle $g $barFillBrush $barFill 11

    # Word Pills
    $targetWords = @("LION", "TIGER", "BEAR", "WOLF", "EAGLE", "CAT")
    $fontPill = [System.Drawing.Font]::new("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
    $greenPill = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 209, 250, 229))
    $greenText = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 6, 95, 70))
    $grayPill  = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 241, 245, 249))

    for ($wIdx = 0; $wIdx -lt $targetWords.Length; $wIdx++) {
        $wy = 300 + ($wIdx * 95)
        $wRect = [System.Drawing.Rectangle]::new(1180, $wy, 580, 75)
        if ($wIdx -lt 2) {
            $null = Draw-RoundedRectangle $g $greenPill $wRect 18
            # Checkmark
            $chkPen = [System.Drawing.Pen]::new($greenText, 3)
            $g.DrawLine($chkPen, 1210, ($wy + 38), 1220, ($wy + 48))
            $g.DrawLine($chkPen, 1220, ($wy + 48), 1235, ($wy + 28))
            $g.DrawString($targetWords[$wIdx], $fontPill, $greenText, 1255, ($wy + 20))
        } else {
            $null = Draw-RoundedRectangle $g $grayPill $wRect 18
            $g.DrawString($targetWords[$wIdx], $fontPill, $darkBrush, 1220, ($wy + 20))
        }
    }

    # Bottom Hint Tip Card
    $hintBox = [System.Drawing.Rectangle]::new(1180, 890, 580, 85)
    $blueLight = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 239, 246, 255))
    $null = Draw-RoundedRectangle $g $blueLight $hintBox 20
    $fontHint = [System.Drawing.Font]::new("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Tip: Drag across letters horizontally or vertically to find words!", $fontHint, $blueBrush, 1205, 918)

    $bmp.Save(".\public\screenshots\desktop-2.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: desktop-2.png (Gameplay Screen)"
}

# ==============================================================================
# SCREENSHOT 3: 12 MYSTICAL WORLDS EXPEDITIONS
# ==============================================================================
function Generate-Screenshot3 {
    $w = 1920
    $h = 1080
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Mystical Midnight Gradient
    $bgRect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $bgRect,
        [System.Drawing.Color]::FromArgb(255, 10, 15, 30),
        [System.Drawing.Color]::FromArgb(255, 30, 27, 75),
        90.0
    )
    $g.FillRectangle($bgBrush, $bgRect)

    # Ambient Star dust
    $starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 255, 255, 255))
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
    Draw-VectorStar $g $starBrush 220 180 6 3
    Draw-VectorStar $g $starBrush 1700 150 8 4
    Draw-VectorStar $g $starBrush 900 220 5 2
    Draw-VectorStar $g $goldBrush 1600 220 12 5

    $fontTitle = New-Object System.Drawing.Font("Segoe UI", 52, [System.Drawing.FontStyle]::Bold)
    $fontSub = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Regular)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center

    $g.DrawString("EXPLORE 12 MYSTICAL WORLDS", $fontTitle, $whiteBrush, [System.Drawing.RectangleF]::new(0, 60, $w, 80), $sfCenter)
    $g.DrawString("Embark on an epic journey across 10,000 handcrafted puzzle levels", $fontSub, $goldBrush, [System.Drawing.RectangleF]::new(0, 150, $w, 50), $sfCenter)

    # 4 Cards for Worlds
    $worldCards = @(
        @{ title = "Green Valley"; lv = "Levels 1 - 50"; badge = "COMPLETED"; col = [System.Drawing.Color]::FromArgb(255, 16, 185, 129); emblem = "VALLEY" },
        @{ title = "Sunny Beach"; lv = "Levels 51 - 100"; badge = "UNLOCKED"; col = [System.Drawing.Color]::FromArgb(255, 245, 158, 11); emblem = "SUN" },
        @{ title = "Mystic Forest"; lv = "Levels 101 - 150"; badge = "EXPEDITION"; col = [System.Drawing.Color]::FromArgb(255, 139, 92, 246); emblem = "FOREST" },
        @{ title = "Aurora Kingdom"; lv = "Levels 601 - 10,000"; badge = "LEGENDARY"; col = [System.Drawing.Color]::FromArgb(255, 14, 165, 233); emblem = "CROWN" }
    )

    $cardW = 380
    $cardH = 680
    $gap = 50
    $startX = 150
    $cy = 250

    $fontWTitle = [System.Drawing.Font]::new("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
    $fontWLv = [System.Drawing.Font]::new("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $fontBadge = [System.Drawing.Font]::new("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)

    for ($i = 0; $i -lt 4; $i++) {
        $cData = $worldCards[$i]
        $cx = $startX + ($i * ($cardW + $gap))
        $cRect = [System.Drawing.Rectangle]::new($cx, $cy, $cardW, $cardH)
        $cBrush = [System.Drawing.SolidBrush]::new($cData.col)
        $null = Draw-RoundedRectangle $g $cBrush $cRect 30

        $penRim = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(100, 255, 255, 255), 4)
        $null = Draw-RoundedOutline $g $penRim $cRect 30

        # Vector Emblem in Center of Card
        $emblemX = $cx + ($cardW / 2)
        $emblemY = $cy + 160
        $goldB = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 251, 191, 36))
        
        # Draw central vector symbol
        if ($cData.emblem -eq "VALLEY") {
            # Mountain Peak
            $mPts = @(
                [System.Drawing.PointF]::new(($emblemX - 50), ($emblemY + 40)),
                [System.Drawing.PointF]::new($emblemX, ($emblemY - 45)),
                [System.Drawing.PointF]::new(($emblemX + 50), ($emblemY + 40))
            )
            $g.FillPolygon($whiteBrush, $mPts)
        } elseif ($cData.emblem -eq "SUN") {
            # Radiant Sun
            $g.FillEllipse($goldB, [int]($emblemX - 40), [int]($emblemY - 40), 80, 80)
            Draw-VectorStar $g $whiteBrush $emblemX $emblemY 50 25
        } elseif ($cData.emblem -eq "FOREST") {
            # Pine Tree
            $pPts = @(
                [System.Drawing.PointF]::new(($emblemX - 45), ($emblemY + 45)),
                [System.Drawing.PointF]::new($emblemX, ($emblemY - 45)),
                [System.Drawing.PointF]::new(($emblemX + 45), ($emblemY + 45))
            )
            $g.FillPolygon($whiteBrush, $pPts)
        } else {
            # Royal Crown
            $crownPts = @(
                [System.Drawing.PointF]::new(($emblemX - 50), ($emblemY + 30)),
                [System.Drawing.PointF]::new(($emblemX - 40), ($emblemY - 30)),
                [System.Drawing.PointF]::new(($emblemX - 15), ($emblemY + 0)),
                [System.Drawing.PointF]::new($emblemX, ($emblemY - 40)),
                [System.Drawing.PointF]::new(($emblemX + 15), ($emblemY + 0)),
                [System.Drawing.PointF]::new(($emblemX + 40), ($emblemY - 30)),
                [System.Drawing.PointF]::new(($emblemX + 50), ($emblemY + 30))
            )
            $g.FillPolygon($goldB, $crownPts)
        }

        # Text labels
        $g.DrawString($cData.title, $fontWTitle, $whiteBrush, [System.Drawing.RectangleF]::new($cx, ($cy + 290), $cardW, 60), $sfCenter)
        $g.DrawString($cData.lv, $fontWLv, $whiteBrush, [System.Drawing.RectangleF]::new($cx, ($cy + 355), $cardW, 40), $sfCenter)

        # Status badge pill
        $badgePill = [System.Drawing.Rectangle]::new(($cx + 60), ($cy + 420), ($cardW - 120), 45)
        $bPillBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(60, 0, 0, 0))
        $null = Draw-RoundedRectangle $g $bPillBrush $badgePill 16
        Draw-VectorStar $g $goldBrush ($cx + 105) ($cy + 442) 10 5
        $g.DrawString($cData.badge, $fontBadge, $goldBrush, [System.Drawing.RectangleF]::new(($cx + 25), ($cy + 432), ($cardW - 25), 40), $sfCenter)

        # Unlock / Play Button
        $bRect = [System.Drawing.Rectangle]::new(($cx + 40), ($cy + 550), ($cardW - 80), 65)
        $bBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        $null = Draw-RoundedRectangle $g $bBrush $bRect 20
        $fontBtn = [System.Drawing.Font]::new("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
        $btnTextB = [System.Drawing.SolidBrush]::new($cData.col)
        $g.DrawString("EXPLORE", $fontBtn, $btnTextB, [System.Drawing.RectangleF]::new($cx, ($cy + 565), $cardW, 40), $sfCenter)
    }

    $bmp.Save(".\public\screenshots\desktop-3.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: desktop-3.png (12 Mystical Worlds)"
}

Generate-Screenshot1
Generate-Screenshot2
Generate-Screenshot3
