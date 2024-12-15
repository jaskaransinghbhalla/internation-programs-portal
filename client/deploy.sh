rsync \
    --rsync-path="sudo /usr/bin/rsync" \
    --verbose --chmod=+rx --recursive --delete --force --checksum --itemize-changes \
    build/ frontend@10.17.50.150:/var/www/html
