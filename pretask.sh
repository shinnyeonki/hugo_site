#!/bin/bash

# management_frontmatter.py 실행후 create_hugo_site_file.py 를 실행
python3 ./pretask/create_search_index.py
python3 ./pretask/management_frontmatter.py
python3 ./pretask/create_hugo_site_file.py

echo "Pretask scripts executed successfully."