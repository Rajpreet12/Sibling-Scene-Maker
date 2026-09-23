Add-Type -AssemblyName System.Speech

$root = $PSScriptRoot
$dataPath = Join-Path $root "episode-data.json"
$audioDir = Join-Path $root "public\audio"
New-Item -ItemType Directory -Force -Path $audioDir | Out-Null

$data = Get-Content $dataPath -Raw | ConvertFrom-Json

function Get-WavDurationSeconds($path) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $pos = 12 # skip RIFF header + WAVE tag
    $byteRate = 0
    $dataSize = 0
    while ($pos -lt $bytes.Length - 8) {
        $chunkId = [System.Text.Encoding]::ASCII.GetString($bytes, $pos, 4)
        $chunkSize = [System.BitConverter]::ToInt32($bytes, $pos + 4)
        if ($chunkId -eq "fmt ") {
            $byteRate = [System.BitConverter]::ToInt32($bytes, $pos + 16)
        } elseif ($chunkId -eq "data") {
            $dataSize = $chunkSize
        }
        $pos += 8 + $chunkSize + ($chunkSize % 2)
    }
    if ($byteRate -eq 0) { return 0 }
    return [Math]::Round($dataSize / $byteRate, 3)
}

$voices = @{}
function Get-Synth($voiceName, $rate, $volume) {
    $key = "$voiceName|$rate|$volume"
    if (-not $voices.ContainsKey($key)) {
        $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
        $s.SelectVoice($voiceName)
        $s.Rate = $rate
        $s.Volume = $volume
        $voices[$key] = $s
    }
    return $voices[$key]
}

function Get-SpeakerVoice($speaker) {
    switch ($speaker) {
        "narrator" { return Get-Synth "Microsoft David Desktop" -2 90 }
        "teacher"  { return Get-Synth "Microsoft David Desktop" 0 100 }
        "sarvgun"  { return Get-Synth "Microsoft Zira Desktop" -1 100 }
        "elahi"    { return Get-Synth "Microsoft Zira Desktop" 1 100 }
        default    { return Get-Synth "Microsoft David Desktop" 0 100 }
    }
}

$durations = @{}
$count = 0

for ($ai = 0; $ai -lt $data.acts.Count; $ai++) {
    $act = $data.acts[$ai]
    for ($si = 0; $si -lt $act.scenes.Count; $si++) {
        $scene = $act.scenes[$si]

        # Narrated action line
        $id = "a$ai-s$si-action"
        $file = Join-Path $audioDir "$id.wav"
        $synth = Get-SpeakerVoice "narrator"
        $synth.SetOutputToWaveFile($file)
        $synth.Speak($scene.action)
        $synth.SetOutputToNull()
        $durations[$id] = Get-WavDurationSeconds $file
        $count++

        for ($li = 0; $li -lt $scene.lines.Count; $li++) {
            $line = $scene.lines[$li]
            $id = "a$ai-s$si-l$li"
            $file = Join-Path $audioDir "$id.wav"
            $synth = Get-SpeakerVoice $line.speaker
            $synth.SetOutputToWaveFile($file)
            $synth.Speak($line.text)
            $synth.SetOutputToNull()
            $durations[$id] = Get-WavDurationSeconds $file
            $count++
        }
    }
}

$moralFile = Join-Path $audioDir "moral.wav"
$synth = Get-SpeakerVoice "narrator"
$synth.SetOutputToWaveFile($moralFile)
$synth.Speak($data.moral)
$synth.SetOutputToNull()
$durations["moral"] = Get-WavDurationSeconds $moralFile
$count++

$durations | ConvertTo-Json | Set-Content -Path (Join-Path $audioDir "durations.json") -Encoding utf8

Write-Host "Generated $count audio files."
