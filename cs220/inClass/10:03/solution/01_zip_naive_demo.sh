if test "$1" == "build"; then
    docker build -t zip_naive_demo .
fi

mem_limit=200000000
docker run -it --rm --memory $mem_limit --memory-swap $mem_limit -v $(pwd):/app zip_naive_demo sh -c "tsc --outDir /build && node /build/01_zip_naive.js"
