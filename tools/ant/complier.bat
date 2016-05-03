@echo off
echo "Complier Start..."
set targetFile=TilesPuzzleHtml5-v1.0.js
del "%cd%\..\..\project\HTML5\%targetFile%"
call ant.bat -f "%cd%\..\..\project\HTML5\src\build.xml"
copy "%cd%\..\..\project\HTML5\%targetFile%" %cd%
echo "Complier End..."
Pause