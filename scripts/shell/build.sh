#!/bin/bash

npx google-closure-compiler \
--language_in ECMASCRIPT5_STRICT \
--language_out ECMASCRIPT5_STRICT \
--warning_level DEFAULT \
--compilation_level WHITESPACE_ONLY \
--isolation_mode IIFE \
--js "./../../lib/rune.js" \
--js "./../../src/scope/Manifest.js" \
--js "./../../src/data/resource/Requests.js" \
--js "./../../src/entity/Player.js" \
--js "./../../src/ui/graphic/Platform.js" \
--js "./../../src/ui/graphic/Shield.js" \
--js "./../../src/handler/ShieldHandler.js" \
--js "./../../src/handler/MakeLevel.js" \
--js "./../../src/handler/CloudHandler.js" \
--js "./../../src/handler/PlatformHandler.js" \
--js "./../../src/handler/PlayerHandler.js" \
--js "./../../src/scene/menu/Paus.js" \
--js "./../../src/scene/menu/More.js" \
--js "./../../src/scene/menu/Credits.js" \
--js "./../../src/scene/game/Game.js" \
--js "./../../src/scene/menu/Menu.js" \
--js "./../../src/system/Main.js" \
--js "./../../src/scope/Alias.js" \
--js_output_file "./../../dist/runmysteriet.js";