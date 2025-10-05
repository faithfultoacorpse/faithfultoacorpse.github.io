import os
from renderer import Renderer

def main(): 
    articles_to_ignore = ["jungle-cats.txt"]
    raw_dir = '/home/ftac/Code/private/faithfultoacorpse.github.io/raw'
    raw_files = os.listdir(raw_dir)
    rendered_dir = '/home/ftac/Code/private/faithfultoacorpse.github.io/rendered'
    for raw_file in raw_files:
        if raw_file not in articles_to_ignore:
            raw_path = os.path.join(raw_dir, raw_file)
            filename = os.path.basename(raw_file)
            rendered_filename = f"{rendered_dir}/{os.path.splitext(filename)[0]}.html"
            renderer = Renderer(raw_path, rendered_filename)
            renderer.write_rendered()

main()
