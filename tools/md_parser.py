import os
from datetime import datetime 

class MDParser:
    def __init__(self, raw_file):
        self.raw_file = raw_file

    def get_title_and_date(self, lines):
        line0 = lines[0]
        if line0[0] == "#":
            title = line0[2:]
            date = lines[1]
            return title, date, lines[2:]
        else: # no title in md
            filename, _ = os.path.splitext(self.raw_file)
            words = filename.split('_')
            for idx, word in enumerate(words):
                words[idx][0] = word[0].upper()
            title = " ".join(words)
            timestamp = os.path.getmtime(self.raw_file)
            date = datetime.fromtimestamp(timestamp).strftime("%B %d, %Y")
            return title, date, lines

    def parse_md(self):
        article = {}
        parsed = []
        with open(self.raw_file, 'r') as rf:
            lines = rf.readlines()
        title, date, lines = self.get_title_and_date(lines)
        lines.append("")
        article["title"] = title.strip()
        article["date"] = date.strip()
        current_block = []
        current_type = ""
        for line in lines:
            line = line.strip()
            if len(line) == 0 or current_type == "header" or current_type == "image":
                parsed.append((current_type, current_block))
                current_type = ""
                current_block = []
            elif len(line) > 0:
                if not current_type:
                    current_type = self.get_block_type_from_line(line)
                current_block.append(line)
        article["body"] = parsed
        return article
            
    def get_block_type_from_line(self, line):
        if line[0] == "#":
            return "header"
        elif line[0] == ">":
            return "block_quote"
        elif line[0] == "!":
            return "image"
        else:
            return "normal"

