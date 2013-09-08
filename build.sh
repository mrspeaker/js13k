#!/bin/bash

# Concats the library into Ω500.js

echo "concatting"

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
src/scripts/gen.js \
src/scripts/audio/audio.js \
src/scripts/map/BLOCKS.js \
src/scripts/map/Sheet.js \
src/scripts/map/Map.js \
src/scripts/entities/Entity.js \
src/scripts/entities/Ghoul.js \
src/scripts/entities/Player.js \
src/scripts/entities/Spear.js \
src/scripts/Camera.js \
src/scripts/screens/title.js \
src/scripts/screens/level.js \
src/scripts/input.js \
src/scripts/game.js \
\
> build/js13k.js

echo "uglifying"
uglifyjs build/js13k.js -v -c -m -o build/js13k.min.js
