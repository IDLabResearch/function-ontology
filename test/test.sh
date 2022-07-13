#!/bin/bash
set -e

echo "Resources that should conform"
for x in $( find test/resources/valid -maxdepth 1 -type f -name '*.ttl' ); do
  echo "👉 $x"
  shacl v -q --data $x --shapes shape.ttl | grep -e "conforms"
done

echo "Resources that should NOT conform"
for x in $( find test/resources/invalid -maxdepth 1 -type f -name '*.ttl' ); do
  echo "👉 $x"
  shacl v -q --data $x --shapes shape.ttl | grep -e "conforms"
done
