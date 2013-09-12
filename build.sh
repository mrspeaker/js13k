#!/bin/bash

# Concats the library into Ω500.js
echo
echo "...concatting..."
header=$(cat << EOF
/*
	js13k game by Mr Speaker
*/
EOF
)

echo "${header}" | \

cat - \
\
src/scripts/utils.js \
src/scripts/audio/audio.js \
src/scripts/Particles.js \
src/scripts/map/gen.js \
src/scripts/map/BLOCKS.js \
src/scripts/map/Sheet.js \
src/scripts/map/Map.js \
src/scripts/entities/Entity.js \
src/scripts/entities/Ghoul.js \
src/scripts/entities/Player.js \
src/scripts/entities/Spear.js \
src/scripts/entities/Pickup.js \
src/scripts/entities/Piece.js \
src/scripts/Camera.js \
src/scripts/screens/Dialog.js \
src/scripts/screens/title.js \
src/scripts/screens/level.js \
src/scripts/input.js \
src/scripts/game.js \
\
> build/js13k.js

echo
echo "...uglifying..."
uglifyjs build/js13k.js -v -c -m -o build/js13k.min.js

echo
echo "...zipping..."
mkdir build/js13k-MrSpeaker
cp build/js13k.min.js build/js13k-MrSpeaker
cp build/index.html build/js13k-MrSpeaker
cp build/README build/js13k-MrSpeaker
cp src/css/main.css build/js13k-MrSpeaker

cd build
zip -9 js13k.zip js13k-MrSpeaker/*
cd ../

rm -rf build/js13k-MrSpeaker

echo
echo "...done..."
bytes=$(stat -f "%z" build/js13k.zip)

echo "Used: ${bytes} bytes"
echo "Free: $(expr 13 \* 1024 - $bytes) bytes"
echo


