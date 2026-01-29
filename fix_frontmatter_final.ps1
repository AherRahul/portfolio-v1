$files = @(
    "content\articles\04-get-started-with-react\*.md",
    "content\articles\05-aws-solution-architect\*.md",
    "content\articles\06-learn-ai-with-me\*.md",
    "content\articles\07-system-design\*.md"
)

$fixedCount = 0

foreach ($pattern in $files) {
    Get-ChildItem -Path $pattern | ForEach-Object {
        $lines = [System.Collections.ArrayList](Get-Content $_.FullName)
        $modified = $false
        
        # Find the closing --- and remove blank lines before it
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^---\s*$') {
                # Check if previous line(s) are blank
                $j = $i - 1
                while ($j -ge 0 -and $lines[$j] -match '^\s*$') {
                    $lines.RemoveAt($j)
                    $modified = $true
                    $i-- # Adjust index after removal
                    $j--
                }
                break
            }
        }
        
        # Also ensure content after --- is proper (not just a heading)
        $closingIndex = -1
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^---\s*$' -and $i -gt 0) {
                $closingIndex = $i
                break
            }
        }
        
        if ($closingIndex -ge 0 -and $closingIndex + 1 -lt $lines.Count) {
            # Check if content after --- is just a heading without proper content
            $contentStart = $closingIndex + 1
            # Skip blank lines
            while ($contentStart -lt $lines.Count -and $lines[$contentStart] -match '^\s*$') {
                $contentStart++
            }
            
            if ($contentStart -lt $lines.Count -and $lines[$contentStart] -match '^#\s+[^\n]+$') {
                # Replace heading with proper content
                $lines.RemoveRange($contentStart, $lines.Count - $contentStart)
                $lines.Add("") | Out-Null
                $lines.Add("## Launching Soon..!!") | Out-Null
                $lines.Add("") | Out-Null
                $lines.Add("This content is coming soon. Stay tuned!") | Out-Null
                $modified = $true
            }
        }
        
        if ($modified) {
            $lines -join "`n" | Set-Content $_.FullName -NoNewline
            # Ensure file ends with newline
            $content = [System.IO.File]::ReadAllText($_.FullName)
            if (-not $content.EndsWith("`n")) {
                [System.IO.File]::AppendAllText($_.FullName, "`n")
            }
            $fixedCount++
            Write-Host "Fixed: $($_.Name)"
        }
    }
}

Write-Host "`nTotal files fixed: $fixedCount"

