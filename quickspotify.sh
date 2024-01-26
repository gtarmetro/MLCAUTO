#!/bin/bash
#This program runs my playwright tests
echo Enter Title
read title
echo Enter Artist
read artist
export TITLE=$title
export ARTIST=$artist
npx playwright test tests/quickspotify.spec.ts