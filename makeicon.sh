SOURCE=$1
NAME=$2
# create $NAME.iconset folder
mkdir $NAME.icons
sips -z 16 16     $SOURCE --out $NAME.icons/16.png
sips -z 32 32     $SOURCE --out $NAME.icons/32.png
sips -z 48 48   $SOURCE --out $NAME.icons/48.png
sips -z 128 128   $SOURCE --out $NAME.icons/128.png
convert $NAME.icons/16.png $NAME.icons/32.png $NAME.icons/48.png $NAME.icons/128.png $NAME.ico
rm -rf $NAME.icons


