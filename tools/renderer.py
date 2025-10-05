import os

from html_formatter import HTMLFormatter
from md_parser import MDParser

class Renderer(HTMLFormatter, MDParser):
    def __init__(self, raw_file, output_file):
        HTMLFormatter.__init__(self)
        MDParser.__init__(self, raw_file)
        self.output_file = output_file

    def format_article(self):
        raw_article = self.parse_md()
        title = raw_article["title"]
        date = raw_article["date"]
        rendered_lines = self.format_article_header(title, date)
        for block_type, block in raw_article["body"]:
            rendered_lines += self.format_by_type(block_type, block)
        rendered_lines.append(self.tab + self.div_end)
        rendered_lines.append(self.tab + self.return_link)
        rendered_lines.append(self.article_end)
        return rendered_lines

    def write_rendered(self):
        formatted = self.format_article()
        with open(self.output_file, 'w') as of:
            for line in formatted:
                of.write(line + '\n')

    def format_by_type(self, block_type, block):
        if block_type == "image":
            filepath = self.get_image_path(block[0])
            return [self.format_image(filepath)]
        block = [self.inline_format(b) for b in block]
        if block_type == "header":
            return [self.format_header_text(block[0])]
        elif block_type == "normal":
            line = " ".join(block)
            return [self.format_normal_text(line)]
        elif block_type == "block_quote": 
            return self.format_block_quote(block)
        else:
            return []

    def inline_format(self, line):
        if '*' in line:
            phrases = line.split('*')
            for idx, p in enumerate(phrases):
                if idx % 2:
                    phrases[idx] = self.emph_text(p)
            line = "".join(phrases)
        if '](' in line:
            line = self.format_links(line)
        return line

    def get_image_path(self, line):
        line = line.split('(')[-1]
        filepath = line[:-1]
        return filepath

    def format_links(self, line):
        if '](' in line:
            text_start = len(line)
            text_end = -1
            link_start = len(line)
            link_end = -1
            for idx, char in enumerate(line):
                if char == "[":
                    text_start = idx + 1
                if char == "]" and idx > text_start:
                    if line[idx + 1] != '(':
                        break
                    else:
                        text_end = idx 
                        link_start = idx + 2
                if char == ")" and idx > link_start:
                    link_end = idx
                    break
            label = line[text_start:text_end]
            link = line[link_start:link_end]
            line_start = line[:text_start-1]
            line_end = line[link_end+1:]
            hyperlink = self.format_hyperlink(link, label)
            new_line = "".join([line_start, hyperlink, line_end])
            return self.format_links(new_line)
        else:
            return line
