**Syntax**: `(url) [-e "extension type"] [-d "destination"]` <br>
\- *double quotes are only for this example*

use `[-u "url"]` for a different syntax approach <br>
**Example**: `-e mkv -d C:\Users\*\Music -u https://*.com/*`

Obviously you can insert video ID instead of url, take your preference

### Known issues 
\- Video download will abort thus the file will remain corrupt while it's still streamable up to a point in the seekbar <br>
\- Audio works but sometimes will fail to download entirely (Fix: delete empty file & retry)

### Note
YTDL settings in this are set so it downloads video with highest quality possible, resulting in lack of audio stream <br>
Same could be said for audio, if you do choose to download just audio, it's quality is set to as highest possible.

Unfortunately I know of no way to merge audio & video streams, I've tried with ffmpeg but I'll still have to try, trial & error

### Simple showcase
<video src="https://github.com/user-attachments/assets/debfa1a2-2e97-4113-b0d7-7edcc74812cb">
