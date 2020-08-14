SOURCE=$1
NAME=ExampleApp
if  [ ! "$2" == "" ]; then
    NAME=$2
fi
# create $NAME.iconset folder
mkdir $NAME.iconset
# resize all the images
sips -z 16 16     $SOURCE --out $NAME.iconset/icon_16x16.png
sips -z 32 32     $SOURCE --out $NAME.iconset/icon_16x16@2x.png
sips -z 32 32     $SOURCE --out $NAME.iconset/icon_32x32.png
sips -z 64 64     $SOURCE --out $NAME.iconset/icon_32x32@2x.png
sips -z 128 128   $SOURCE --out $NAME.iconset/icon_128x128.png
sips -z 256 256   $SOURCE --out $NAME.iconset/icon_128x128@2x.png
sips -z 256 256   $SOURCE --out $NAME.iconset/icon_256x256.png
sips -z 512 512   $SOURCE --out $NAME.iconset/icon_256x256@2x.png
sips -z 512 512   $SOURCE --out $NAME.iconset/icon_512x512.png
# create the .icns
iconutil -c icns $NAME.iconset
# remove the temp folder
rm -R $NAME.iconset

cp $NAME.icns release-builds/$NAME-darwin-x64/$NAME.app/Contents/Resources/electron.icns